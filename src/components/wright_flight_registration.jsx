import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './wright_flight_registration.css';
import wrightFlightQr from '../images/wright_flight_qr.jpeg';
import {
    WRIGHT_FLIGHT_REGISTRATION_STATUS,
    WRIGHT_FLIGHT_MAX_SLOTS,
    WRIGHT_FLIGHT_REGISTRATION_FEE,
    WRIGHT_FLIGHT_GST_RATE,
    WRIGHT_FLIGHT_GST_AMOUNT,
    WRIGHT_FLIGHT_TOTAL_AMOUNT
} from '../data/wrightFlightRegistration.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
import {
    saveToCollection,
    checkDuplicateWrightFlightRegistration,
    getWrightFlightRegistrationCount
} from '../firebase.js';

// Registration status, capacity, and payment amounts are managed in
// src/data/wrightFlightRegistration.js and shared with the registrations hub.
const MAX_TEAM_SIZE = 4;
const MAX_SCREENSHOT_DIMENSION = 900;
const TARGET_DATA_URL_BYTES = 450 * 1024;
const MAX_UPLOAD_FILE_BYTES = 10 * 1024 * 1024;

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Could not read file'));
        reader.readAsDataURL(file);
    });
}

function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = src;
    });
}

async function compressScreenshotToDataURL(file) {
    const originalDataUrl = await readFileAsDataURL(file);
    const img = await loadImageElement(originalDataUrl);
    let { width, height } = img;

    if (width > MAX_SCREENSHOT_DIMENSION || height > MAX_SCREENSHOT_DIMENSION) {
        const scale = MAX_SCREENSHOT_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, width, height);

    let quality = 0.82;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    while (dataUrl.length > TARGET_DATA_URL_BYTES && quality > 0.35) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    return dataUrl;
}



const WrightFlightClosedPage = ({ maxSlots }) => (
    <div className="wright-flight-guidelines registration-closed-box">
        <div className="closed-icon">LOCKED</div>
        <h3 className="guidelines-heading" style={{ color: '#ef4444' }}>
            Registrations are Closed
        </h3>
        <p className="closed-subtext">
            We have reached the maximum capacity of <strong>{maxSlots} team registrations</strong> for
            <strong> Wright Flight</strong>. Thank you for your interest.
        </p>
    </div>
);

const WrightFlightUpcomingPage = () => (
    <div className="wright-flight-guidelines registration-upcoming-box">
        <div className="closed-icon">SOON</div>
        <h3 className="guidelines-heading">Registrations Opening Soon</h3>
        <p className="closed-subtext">
            Registrations for <strong>Wright Flight</strong> will open soon.
            Please check back for updates before making any payment.
        </p>
    </div>
);

const WrightFlightRegistration = () => {

    const navigate = useNavigate();

    const [registrationStatus, setRegistrationStatus] = useState(null);
    const [registrationStatusError, setRegistrationStatusError] = useState('');
    const [slotsLeft, setSlotsLeft] = useState(null);

    const isWrightFlightOngoing = registrationStatus === 'open';
    const isWrightFlightUpcoming = registrationStatus === 'soon';
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [duplicateError, setDuplicateError] = useState('');
    const [screenshotFileName, setScreenshotFileName] = useState('');
    const [screenshotProcessing, setScreenshotProcessing] = useState(false);
    const [screenshotError, setScreenshotError] = useState('');
    const screenshotInputRef = useRef(null);
    const [formData, setFormData] = useState({
        captainName: '',
        rollNo: '',
        phone: '',
        email: '',
        teamName: '',
        collegeName: '',
        participantCount: '1',
        teamMember1: '',
        teamMember2: '',
        teamMember3: '',
        paymentScreenshot: '',
        hp_field: ''
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleScreenshotChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setScreenshotError('');
        setScreenshotFileName(file.name);
        setScreenshotProcessing(true);

        try {
            if (!file.type.startsWith('image/')) {
                throw new Error('Please select an image file.');
            }

            if (file.size > MAX_UPLOAD_FILE_BYTES) {
                throw new Error('Screenshot must be 10 MB or smaller.');
            }

            const dataUrl = await compressScreenshotToDataURL(file);

            setFormData((prev) => ({
                ...prev,
                paymentScreenshot: dataUrl
            }));
        } catch (error) {
            setFormData((prev) => ({
                ...prev,
                paymentScreenshot: ''
            }));

            setScreenshotFileName('');
            setScreenshotError(
                error.message || 'Could not process the screenshot. Please try again.'
            );

            if (screenshotInputRef.current) {
                screenshotInputRef.current.value = '';
            }
        } finally {
            setScreenshotProcessing(false);
        }
    };


    useEffect(() => {
        import('./WrightFlightSuccess.jsx').catch((error) => {
            if (import.meta.env.MODE === 'development') {
                console.warn('Could not preload Wright Flight success page:', error);
            }
        });
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        async function loadRegistrationStatus() {
            try {
                const response = await fetch(`${BACKEND_URL}/api/events`, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(`Events API failed: ${response.status}`);
                }

                const data = await response.json();

                if (!data.success || !Array.isArray(data.events)) {
                    throw new Error('Invalid events API response');
                }

                const normalize = (value) =>
                    String(value || '')
                        .trim()
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, '');

                const event = data.events.find((item) =>
                    normalize(item.registrationKey) === 'wrightflight' ||
                    normalize(item.title) === 'wrightflight' ||
                    item.ctaLink === '/wright_flight_registration'
                );

                if (!event) {
                    throw new Error('Wright Flight event was not found in the events API');
                }

                const status = String(event.status || '').toLowerCase();
                const validStatuses = ['open', 'soon', 'closed'];

                if (!controller.signal.aborted) {
                    setRegistrationStatus(
                        validStatuses.includes(status) ? status : 'closed'
                    );
                    setRegistrationStatusError('');
                }
            } catch (error) {
                if (error.name !== 'AbortError' && !controller.signal.aborted) {
                    console.error('Could not load Wright Flight status:', error);
                    setRegistrationStatusError(
                        'Could not load registration status. Please refresh the page.'
                    );
                }
            }
        }

        loadRegistrationStatus();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!isWrightFlightOngoing) return;

        let cancelled = false;

        getWrightFlightRegistrationCount()
            .then((count) => {
                if (!cancelled && count !== null) {
                    setSlotsLeft(
                        Math.max(0, WRIGHT_FLIGHT_MAX_SLOTS - count)
                    );
                }
            })
            .catch((error) => {
                console.error('Could not load remaining Wright Flight slots:', error);
            });

        return () => {
            cancelled = true;
        };
    }, [isWrightFlightOngoing]);

    const handleRemoveScreenshot = () => {
        setFormData((prev) => ({ ...prev, paymentScreenshot: '' }));
        setScreenshotFileName('');
        setScreenshotError('');
        if (screenshotInputRef.current) screenshotInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Safety check:
        // even if someone manually visits this route, the form still submits
        // only when the registration status is 'ongoing'.
        if (!isWrightFlightOngoing) {
            alert(isWrightFlightUpcoming ? 'Wright Flight registrations are not open yet.' : 'Wright Flight registrations are closed.');
            return;
        }

        if (formData.hp_field) {
            console.warn('Bot detected via honeypot.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (formData.captainName.trim().length < 3) {
            alert("Please enter the team captain's full name (min 3 characters).");
            return;
        }
        if (formData.rollNo.trim().length < 3) {
            alert("Please enter the team captain's roll number or student ID.");
            return;
        }
        if (formData.teamName.trim().length < 2) {
            alert('Please enter your team name.');
            return;
        }
        if (formData.collegeName.trim().length < 2) {
            alert('Please enter your college name.');
            return;
        }
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            alert('Phone number must be exactly 10 digits.');
            return;
        }

        const participantCount = Number(formData.participantCount);
        if (!Number.isInteger(participantCount) || participantCount < 1 || participantCount > MAX_TEAM_SIZE) {
            alert(`A team can have between 1 and ${MAX_TEAM_SIZE} participants.`);
            return;
        }

        const requiredMemberNames = [
            formData.teamMember1,
            formData.teamMember2,
            formData.teamMember3
        ].slice(0, participantCount - 1);

        if (requiredMemberNames.some((memberName) => memberName.trim().length < 3)) {
            alert(`Please enter the full name of every team member (${participantCount - 1} required).`);
            return;
        }

        const normalizedParticipantNames = [formData.captainName, ...requiredMemberNames]
            .map((participantName) => participantName.trim().toLowerCase());
        if (new Set(normalizedParticipantNames).size !== normalizedParticipantNames.length) {
            alert('Each participant must have a different name.');
            return;
        }
        if (!formData.paymentScreenshot) {
            alert('Please upload a screenshot of your payment before submitting.');
            return;
        }

        setIsSubmitting(true);
        setDuplicateError('');

        // These checks are independent, so run them together instead of
        // making the participant wait for two sequential network round trips.
        const [currentCount, dupCheck] = await Promise.all([
            getWrightFlightRegistrationCount(),
            checkDuplicateWrightFlightRegistration({
                rollNo: formData.rollNo.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
            }),
        ]);

        if (currentCount !== null && currentCount >= WRIGHT_FLIGHT_MAX_SLOTS) {
            setDuplicateError(
                `Registrations are now closed - we've reached the maximum of ${WRIGHT_FLIGHT_MAX_SLOTS} teams for Wright Flight.`
            );
            setSlotsLeft(0);
            setIsSubmitting(false);
            return;
        }

        if (dupCheck.duplicate) {
            setDuplicateError(
                `Your ${dupCheck.field} is already registered for Wright Flight. If you think this is a mistake, please contact us.`
            );
            setIsSubmitting(false);
            return;
        }

        // Save the response in Firestore if all checks pass.
        const result = await saveToCollection('wright_flight_registrations', {
            captainName: formData.captainName.trim(),
            // Keep `name` for compatibility with the existing registrations dashboard.
            name: formData.captainName.trim(),
            rollNo: formData.rollNo.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim().toLowerCase(),
            teamName: formData.teamName.trim(),
            collegeName: formData.collegeName.trim(),
            participantCount,
            teamMembers: requiredMemberNames.map((memberName) => memberName.trim()),
            paymentScreenshot: formData.paymentScreenshot,
            registrationFee: WRIGHT_FLIGHT_REGISTRATION_FEE,
            gstRate: WRIGHT_FLIGHT_GST_RATE,
            gstAmount: WRIGHT_FLIGHT_GST_AMOUNT,
            totalAmount: WRIGHT_FLIGHT_TOTAL_AMOUNT,
            event: 'Wright Flight'
        });

        if (result.success) {
            if (window.gtag) {
                window.gtag('event', 'wright_flight_registration_submit', {
                    event_category: 'Conversion',
                    event_label: 'Wright Flight'
                });
            }

            setFormData({
                captainName: '',
                rollNo: '',
                phone: '',
                email: '',
                teamName: '',
                collegeName: '',
                participantCount: '1',
                teamMember1: '',
                teamMember2: '',
                teamMember3: '',
                paymentScreenshot: '',
                hp_field: ''
            });
            setScreenshotFileName('');
            setScreenshotError('');
            if (screenshotInputRef.current) screenshotInputRef.current.value = '';
            navigate('/wright_flight_success');
        } else {
            alert('Submission failed. Please try again.');
        }

        setIsSubmitting(false);
    };

    return (
        <>
            <Helmet>
                <title>Wright Flight Registration | Aero NITK</title>
                <meta
                    name="description"
                    content="Register for Wright Flight by Aero NITK."
                />
                <link rel="canonical" href="https://aeronitk.in/wright_flight_registration" />
            </Helmet>

            <section className="wright-flight-section">
                <h2 className="wright-flight-title">WRIGHT FLIGHT REGISTRATION</h2>
                <div className="wright-flight-registration-meta">
                    <div className="wright-flight-fee">
                        <strong>Registration Fee: ₹{WRIGHT_FLIGHT_REGISTRATION_FEE} per team (excluding taxes)</strong>
                        <span>GST ({WRIGHT_FLIGHT_GST_RATE}%): ₹{WRIGHT_FLIGHT_GST_AMOUNT}</span>
                        <strong>Total payable: ₹{WRIGHT_FLIGHT_TOTAL_AMOUNT} per team (including GST)</strong>
                    </div>
                    <a
                        className="wright-flight-rulebook-btn"
                        href="https://drive.google.com/file/d/1YAVtAMpws1qcgr_AZrWUNmN81KkMZF85/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Rulebook
                    </a>
                </div>

                {isWrightFlightOngoing && slotsLeft !== 0 && (
                    <div className="slots-banner">
                        {slotsLeft === null ? (
                            <span className="slots-loading">Checking availability...</span>
                        ) : (
                            <>
                                <span className={`slots-count ${slotsLeft <= 3 ? 'slots-low' : ''}`}>
                                    <strong>{slotsLeft}</strong> of {WRIGHT_FLIGHT_MAX_SLOTS} team slots remaining
                                </span>
                                <div className="slots-bar-track">
                                    <div
                                        className="slots-bar-fill"
                                        style={{ width: `${((WRIGHT_FLIGHT_MAX_SLOTS - slotsLeft) / WRIGHT_FLIGHT_MAX_SLOTS) * 100}%` }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {registrationStatusError ? (
                    <div className="wright-flight-guidelines">
                        <h3 className="guidelines-heading">Status Unavailable</h3>
                        <p className="closed-subtext">{registrationStatusError}</p>
                    </div>
                ) : registrationStatus === null ? (
                    <div className="wright-flight-guidelines">
                        <h3 className="guidelines-heading">
                            Loading registration status...
                        </h3>
                    </div>
                ) : isWrightFlightUpcoming ? (
                    <WrightFlightUpcomingPage />
                ) : slotsLeft === 0 || !isWrightFlightOngoing ? (
                    <WrightFlightClosedPage maxSlots={WRIGHT_FLIGHT_MAX_SLOTS} />
                ) : (
                    <>
                        <div className="wright-flight-guidelines">
                            <h3 className="guidelines-heading">Guidelines</h3>
                            <ul className="guidelines-list">
                                <li>One registration must be submitted per team by the team captain.</li>
                                <li>Teams from <strong>all colleges</strong> are welcome to participate.</li>
                                <li>Each team may have a maximum of <strong>{MAX_TEAM_SIZE} participants</strong>, including the captain.</li>
                                <li>Please enter valid captain contact details so we can reach your team.</li>
                                <li>Pay <strong>₹{WRIGHT_FLIGHT_TOTAL_AMOUNT} per team, including {WRIGHT_FLIGHT_GST_RATE}% GST</strong>, using the payment QR and upload a clear screenshot of the completed payment.</li>
                            </ul>
                        </div>

                        <form className="wright-flight-card" onSubmit={handleSubmit}>
                            <div style={{ display: 'none' }} aria-hidden="true">
                                <input
                                    type="text"
                                    name="hp_field"
                                    value={formData.hp_field}
                                    onChange={handleInputChange}
                                    tabIndex="-1"
                                    autoComplete="off"
                                />
                            </div>

                            <label>TEAM CAPTAIN NAME
                                <input
                                    type="text"
                                    name="captainName"
                                    value={formData.captainName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Captain's Full Name"
                                />
                            </label>

                            <label>PHONE NUMBER
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="10-Digit Number"
                                    pattern="[0-9]{10}"
                                    inputMode="numeric"
                                    maxLength="10"
                                />
                            </label>

                            <label>TEAM CAPTAIN ROLL NUMBER / STUDENT ID
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Captain's Roll Number"
                                />
                            </label>

                            <label>E-MAIL
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Captain's E-mail"
                                />
                            </label>

                            <label>TEAM NAME
                                <input
                                    type="text"
                                    name="teamName"
                                    value={formData.teamName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Your Team Name"
                                />
                            </label>

                            <label>COLLEGE NAME
                                <input
                                    type="text"
                                    name="collegeName"
                                    value={formData.collegeName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Full College Name"
                                />
                            </label>

                            <label>
                                NUMBER OF PARTICIPANTS
                                <span className="participant-hint">Maximum {MAX_TEAM_SIZE}, including the captain</span>
                                <select
                                    name="participantCount"
                                    value={formData.participantCount}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {[1, 2, 3, 4].map((count) => (
                                        <option key={count} value={count}>{count}</option>
                                    ))}
                                </select>
                            </label>

                            {Array.from({ length: Number(formData.participantCount) - 1 }, (_, index) => (
                                <label key={index}>TEAM MEMBER {index + 1} NAME
                                    <input
                                        type="text"
                                        name={`teamMember${index + 1}`}
                                        value={formData[`teamMember${index + 1}`]}
                                        onChange={handleInputChange}
                                        required
                                        placeholder={`Team Member ${index + 1} Full Name`}
                                    />
                                </label>
                            ))}

                            <div className="wright-payment-qr-section">
                                <strong className="wright-payment-total">Total payable: ₹{WRIGHT_FLIGHT_TOTAL_AMOUNT} per team</strong>
                                <span className="wright-payment-qr-label">
                                    ₹{WRIGHT_FLIGHT_REGISTRATION_FEE} registration fee (excluding taxes) + ₹{WRIGHT_FLIGHT_GST_AMOUNT} GST ({WRIGHT_FLIGHT_GST_RATE}%)
                                </span>
                                <span className="wright-payment-qr-label">Scan &amp; Pay</span>
                                <img
                                    src={wrightFlightQr}
                                    alt="Wright Flight payment QR code"
                                    className="wright-payment-qr-image"
                                />
                            </div>

                            <label>PAYMENT SCREENSHOT
                                <input
                                    ref={screenshotInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleScreenshotChange}
                                    required
                                />
                            </label>

                            {screenshotProcessing && (
                                <p className="wright-payment-upload-status">Processing image...</p>
                            )}

                            {screenshotError && (
                                <p className="wright-payment-upload-error" role="alert">{screenshotError}</p>
                            )}

                            {formData.paymentScreenshot && !screenshotProcessing && (
                                <div className="wright-payment-upload-preview">
                                    <img src={formData.paymentScreenshot} alt="Payment screenshot preview" />
                                    <div className="wright-payment-upload-preview-info">
                                        <span>{screenshotFileName || 'Screenshot attached'}</span>
                                        <button type="button" onClick={handleRemoveScreenshot}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button className="register-btn" type="submit" disabled={isSubmitting || screenshotProcessing}>
                                {isSubmitting ? 'CHECKING & REGISTERING...' : 'REGISTER NOW'}
                            </button>

                            {duplicateError && (
                                <div className="duplicate-error-box" role="alert">
                                    <span className="duplicate-error-icon">!</span>
                                    <p>{duplicateError}</p>
                                </div>
                            )}
                        </form>
                    </>
                )}
            </section>

            <Footer />
        </>
    );
};

export default WrightFlightRegistration;
