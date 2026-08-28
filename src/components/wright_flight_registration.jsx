import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './wright_flight_registration.css';
import {
    saveToCollection,
    checkDuplicateWrightFlightRegistration,
    getWrightFlightRegistrationCount
} from '../firebase.js';

// Registration control panel for this event.
// Change only these 2 values when you want to manage this form:
// 1. WRIGHT_FLIGHT_REGISTRATION_STATUS:
//    - 'upcoming' -> shows inside the Upcoming tab
//    - 'ongoing'  -> shows inside the Ongoing tab and enables the form
//    - 'closed'   -> shows inside the Past tab and blocks submissions
// 2. WRIGHT_FLIGHT_MAX_SLOTS:
//    - total number of registrations allowed for this event
export const WRIGHT_FLIGHT_REGISTRATION_STATUS = 'upcoming';
export const WRIGHT_FLIGHT_MAX_SLOTS = 100;

const branches = [
    "Computer Science and Engineering", "Artificial Intelligence", "Information Technology",
    "Electronics and Communication Engineering", "Electrical and Electronics Engineering",
    "Computational and Data Science", "Mechanical Engineering", "Mathematical and Computational Sciences",
    "Civil Engineering", "Chemical Engineering", "Metallurgical and Materials Engineering", "Mining Engineering"
];

// These helper flags are derived from the status above.
// Usually there is no need to edit them.
const isWrightFlightOngoing = WRIGHT_FLIGHT_REGISTRATION_STATUS === 'ongoing';
const isWrightFlightUpcoming = WRIGHT_FLIGHT_REGISTRATION_STATUS === 'upcoming';

const WrightFlightClosedPage = ({ maxSlots }) => (
    <div className="wright-flight-guidelines registration-closed-box">
        <div className="closed-icon">LOCKED</div>
        <h3 className="guidelines-heading" style={{ color: '#ef4444' }}>
            Registrations are Closed
        </h3>
        <p className="closed-subtext">
            We have reached the maximum capacity of <strong>{maxSlots} participants</strong> for
            <strong> Wright Flight</strong>. Thank you for your interest.
        </p>
    </div>
);

const WrightFlightUpcomingPage = () => (
    <div className="wright-flight-guidelines registration-upcoming-box">
        <div className="closed-icon">SOON</div>
        <h3 className="guidelines-heading">Registrations Opening Soon</h3>
        <p className="closed-subtext">
            <strong>Wright Flight</strong> is currently marked as upcoming. Once you set
            <strong> WRIGHT_FLIGHT_REGISTRATION_STATUS</strong> to <strong>'ongoing'</strong> in this file,
            it will move to the ongoing tab and this form will become active.
        </p>
    </div>
);

const WrightFlightRegistration = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [duplicateError, setDuplicateError] = useState('');
    const [slotsLeft, setSlotsLeft] = useState(isWrightFlightOngoing ? null : WRIGHT_FLIGHT_MAX_SLOTS);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rollNo: '',
        phone: '',
        branch: '',
        year: '1',
        expectations: '',
        hp_field: ''
    });

    useEffect(() => {
        // Only load live slot data from Firebase when the form is open.
        // For upcoming/closed states, this page stays static.
        if (!isWrightFlightOngoing) return;

        getWrightFlightRegistrationCount().then((count) => {
            if (count !== null) setSlotsLeft(Math.max(0, WRIGHT_FLIGHT_MAX_SLOTS - count));
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        if (formData.name.trim().length < 3) {
            alert('Please enter your full name (min 3 characters).');
            return;
        }

        const rollNoTrimmed = formData.rollNo.trim();
        if (!rollNoTrimmed.startsWith('251') || rollNoTrimmed.length < 8) {
            alert('Roll Number must start with 251 (e.g., 251CS001). Please check and try again.');
            return;
        }
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            alert('Phone number must be exactly 10 digits.');
            return;
        }

        setIsSubmitting(true);
        setDuplicateError('');

        // so we do not accept responses above the slot limit.
        const currentCount = await getWrightFlightRegistrationCount();
        if (currentCount !== null && currentCount >= WRIGHT_FLIGHT_MAX_SLOTS) {
            setDuplicateError(
                `Registrations are now closed - we've reached the maximum of ${WRIGHT_FLIGHT_MAX_SLOTS} participants for Wright Flight.`
            );
            setSlotsLeft(0);
            setIsSubmitting(false);
            return;
        }

        // Prevent the same person from registering more than once.
        const dupCheck = await checkDuplicateWrightFlightRegistration({
            rollNo: formData.rollNo.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
        });

        if (dupCheck.duplicate) {
            setDuplicateError(
                `Your ${dupCheck.field} is already registered for Wright Flight. If you think this is a mistake, please contact us.`
            );
            setIsSubmitting(false);
            return;
        }

        // Save the response in Firestore if all checks pass.
        const result = await saveToCollection('wright_flight_registrations', {
            ...formData,
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
                name: '',
                email: '',
                rollNo: '',
                phone: '',
                branch: '',
                year: '1',
                expectations: '',
                hp_field: ''
            });
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

                {isWrightFlightOngoing && slotsLeft !== 0 && (
                    <div className="slots-banner">
                        {slotsLeft === null ? (
                            <span className="slots-loading">Checking availability...</span>
                        ) : (
                            <>
                                <span className={`slots-count ${slotsLeft <= 3 ? 'slots-low' : ''}`}>
                                    <strong>{slotsLeft}</strong> of {WRIGHT_FLIGHT_MAX_SLOTS} slots remaining
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

                {isWrightFlightUpcoming ? (
                    <WrightFlightUpcomingPage />
                ) : slotsLeft === 0 || !isWrightFlightOngoing ? (
                    <WrightFlightClosedPage maxSlots={WRIGHT_FLIGHT_MAX_SLOTS} />
                ) : (
                    <>
                        <div className="wright-flight-guidelines">
                            <h3 className="guidelines-heading">Guidelines</h3>
                            <ul className="guidelines-list">
                                <li>Each participant should register individually.</li>
                                <li>Selection is on a first-come, first-served basis.</li>
                                <li>Only <strong>{WRIGHT_FLIGHT_MAX_SLOTS} total registrations</strong> are accepted.</li>
                                <li>Please enter valid contact details so we can reach you.</li>
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

                            <label>NAME
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Your Full Name"
                                />
                            </label>

                            <label>E-MAIL
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="E-mail"
                                />
                            </label>

                            <label>
                                ROLL NUMBER <span className="roll-hint">(e.g., 251CS001)</span>
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={formData.rollNo}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="251XXXXXX"
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
                                />
                            </label>

                            <label>BRANCH
                                <select name="branch" value={formData.branch} onChange={handleInputChange} required>
                                    <option value="" disabled hidden>Select Here</option>
                                    {branches.map((branch, idx) => (
                                        <option key={idx} value={branch}>{branch}</option>
                                    ))}
                                </select>
                            </label>

                            <label>YEAR OF STUDY
                                <input type="text" value="1st Year" readOnly className="readonly-input" />
                            </label>

                            <label>WHAT DO YOU EXPECT FROM WRIGHT FLIGHT?
                                <textarea
                                    name="expectations"
                                    value={formData.expectations}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Tell us what you'd like to learn..."
                                    rows="4"
                                />
                            </label>

                            <button className="register-btn" type="submit" disabled={isSubmitting}>
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
