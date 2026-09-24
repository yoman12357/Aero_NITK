import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './recruitment_page.css';
import {
    saveEventRegistration,
    checkDuplicateEventRegistration,
    getEventRegistrationCount
} from '../firebase.js';
import wrightFlightQr from '../images/wright_flight_qr.jpeg';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// ---------------------------------------------------------------------------
// Payment screenshot handling
// ---------------------------------------------------------------------------
// Screenshots are stored directly on the Firestore registration document
// (no Firebase Storage), so they're kept small: resized + re-encoded as a
// JPEG data URL that comfortably fits inside Firestore's 1 MiB per-document
// limit alongside the rest of the form fields.
const MAX_SCREENSHOT_DIMENSION = 1000; // px, longest side
const TARGET_DATA_URL_BYTES = 700 * 1024; // ~700KB, safely under the 1MB doc cap
const MAX_UPLOAD_FILE_BYTES = 10 * 1024 * 1024; // 10MB — reject before we even try to process it

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

// Resizes + compresses an uploaded screenshot into a small JPEG data URL.
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
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    let quality = 0.82;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);

    // Step quality down until it comfortably fits, or we hit a floor.
    while (dataUrl.length > TARGET_DATA_URL_BYTES && quality > 0.35) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    return dataUrl;
}

const branches = [
    "Computer Science and Engineering", "Artificial Intelligence", "Information Technology",
    "Electronics and Communication Engineering", "Electrical and Electronics Engineering",
    "Computational and Data Science", "Mechanical Engineering", "Mathematical and Computational Sciences",
    "Civil Engineering", "Chemical Engineering", "Metallurgical and Materials Engineering", "Mining Engineering"
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

/*
 * Renders the event description while automatically converting
 * URLs into clickable "Click here" links.
 *
 * Admins do NOT need to use Markdown or HTML.
 *
 * Example description entered in the admin dashboard:
 *
 * Join the mandatory Whatsapp group :-
 * https://chat.whatsapp.com/XXXXX
 *
 * The frontend will display:
 *
 * Join the mandatory Whatsapp group :-
 * Click here
 *
 * where "Click here" opens the URL.
 */
function renderDescription(description) {
    if (!description) return null;

    // Matches normal http:// and https:// URLs.
    const urlRegex = /https?:\/\/[^\s<>"']+/g;

    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(description)) !== null) {
        // Add the normal text before the URL.
        if (match.index > lastIndex) {
            elements.push(
                description.slice(lastIndex, match.index)
            );
        }

        let url = match[0];

        // Remove common punctuation that may have been typed immediately
        // after the URL in the description.
        let trailingPunctuation = '';

        while (/[.,!?;:]$/.test(url)) {
            trailingPunctuation = url.slice(-1) + trailingPunctuation;
            url = url.slice(0, -1);
        }

        // Handle closing brackets/parentheses if they are not part of the URL.
        const openingParentheses = (url.match(/\(/g) || []).length;
        const closingParentheses = (url.match(/\)/g) || []).length;

        if (closingParentheses > openingParentheses) {
            trailingPunctuation = ')' + trailingPunctuation;
            url = url.slice(0, -1);
        }

        const openingBrackets = (url.match(/\[/g) || []).length;
        const closingBrackets = (url.match(/\]/g) || []).length;

        if (closingBrackets > openingBrackets) {
            trailingPunctuation = ']' + trailingPunctuation;
            url = url.slice(0, -1);
        }

        // Add the clickable link.
        elements.push(
            <a
                key={`link-${match.index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    color: '#4da6ff',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                }}
            >
                JOIN GROUP
            </a>
        );

        // Add punctuation that was removed from the URL.
        if (trailingPunctuation) {
            elements.push(trailingPunctuation);
        }

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the final URL.
    if (lastIndex < description.length) {
        elements.push(
            description.slice(lastIndex)
        );
    }

    /*
     * Preserve line breaks entered in the admin dashboard textarea.
     *
     * Because the description is split into React elements, CSS
     * white-space handling is more reliable than inserting <br>
     * elements manually.
     */
    return (
        <span style={{ whiteSpace: 'pre-line' }}>
            {elements}
        </span>
    );
}

const EventRegistrationForm = () => {
    const { registrationKey } = useParams();

    const [event, setEvent] = useState(null);
    const [eventLoading, setEventLoading] = useState(true);
    const [eventError, setEventError] = useState(null);

    const [applicationCount, setApplicationCount] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rollNo: "",
        phone: "",
        branch: "",
        year: "",
        paymentScreenshot: "",
        hp_field: ""
    });

    const [screenshotFileName, setScreenshotFileName] = useState('');
    const [screenshotProcessing, setScreenshotProcessing] = useState(false);
    const [screenshotError, setScreenshotError] = useState('');
    const [qrImageFailed, setQrImageFailed] = useState(false);
    const screenshotInputRef = useRef(null);

    // Look up this event's details from the backend by its registrationKey,
    // so the form shows the right title/description without any new
    // per-event backend route.
    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/events`);
                const data = await res.json();

                if (!data.success) {
                    throw new Error(data.error || 'Failed to load event');
                }

                const match = (data.events || []).find(
                    (e) => e.registrationKey === registrationKey
                );

                if (isMounted) {
                    setEvent(match || null);

                    if (!match) {
                        setEventError(
                            'This registration link is no longer active.'
                        );
                    }
                }
            } catch (err) {
                console.error('Error loading event:', err);

                if (isMounted) {
                    setEventError(
                        'Could not load this registration form. Please try again later.'
                    );
                }
            } finally {
                if (isMounted) {
                    setEventLoading(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [registrationKey]);

    useEffect(() => {
        if (!registrationKey) return;

        let isMounted = true;

        (async () => {
            const count = await getEventRegistrationCount(registrationKey);

            if (isMounted) {
                setApplicationCount(count);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [registrationKey]);

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

        if (!file.type.startsWith('image/')) {
            setScreenshotError('Please upload an image file (JPG, PNG, etc.).');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_UPLOAD_FILE_BYTES) {
            setScreenshotError('That image is too large. Please upload a screenshot under 10MB.');
            e.target.value = '';
            return;
        }

        setScreenshotProcessing(true);

        try {
            const compressed = await compressScreenshotToDataURL(file);

            if (compressed.length > TARGET_DATA_URL_BYTES * 1.3) {
                setScreenshotError('Could not compress this image enough to upload. Please try a smaller screenshot.');
                e.target.value = '';
                return;
            }

            setFormData((prev) => ({ ...prev, paymentScreenshot: compressed }));
            setScreenshotFileName(file.name);
        } catch (err) {
            console.error('Error processing screenshot:', err);
            setScreenshotError('Could not process that image. Please try a different file.');
            e.target.value = '';
        } finally {
            setScreenshotProcessing(false);
        }
    };

    const handleRemoveScreenshot = () => {
        setFormData((prev) => ({ ...prev, paymentScreenshot: '' }));
        setScreenshotFileName('');
        setScreenshotError('');
        if (screenshotInputRef.current) {
            screenshotInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Honeypot check
        if (formData.hp_field) {
            console.warn("Bot detected via honeypot.");
            return;
        }

        // Validation — same rules as the recruitment form
        const emailRegex = /^[^\s@]+@nitk\.edu\.in$/;

        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid NITK email address (@nitk.edu.in).");
            return;
        }

        if (formData.name.trim().length < 3) {
            alert("Name must be at least 3 characters.");
            return;
        }

        if (formData.name.trim().length < 3) {
            alert("Name must be at least 3 characters.");
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }

        if (!formData.branch) {
            alert("Please select your branch.");
            return;
        }

        if (!formData.year) {
            alert("Please select your year.");
            return;
        }

        if (!formData.paymentScreenshot) {
            alert("Please upload a screenshot of your payment before submitting.");
            return;
        }

        setIsSubmitting(true);

        const duplicateCheck = await checkDuplicateEventRegistration(
            registrationKey,
            {
                rollNo: formData.rollNo,
                email: formData.email,
                phone: formData.phone
            }
        );

        if (duplicateCheck.duplicate) {
            alert(
                `An application with this ${duplicateCheck.field} already exists. Each user can only submit one registration.`
            );

            setIsSubmitting(false);
            return;
        }

        const { hp_field, ...submissionData } = formData;

        const result = await saveEventRegistration(
            registrationKey,
            submissionData
        );

        setIsSubmitting(false);

        if (result.success) {
            if (window.gtag) {
                window.gtag('event', 'event_registration_submit', {
                    'event_category': 'Engagement',
                    'event_label': registrationKey
                });
            }

            setSubmitted(true);
        } else {
            alert(
                'Something went wrong submitting your registration. Please try again.'
            );
        }
    };

    if (eventLoading) {
        return (
            <section className="recruitment-section">
                <p
                    style={{
                        color: '#aaa',
                        textAlign: 'center'
                    }}
                >
                    Loading...
                </p>

                <Footer />
            </section>
        );
    }

    if (eventError || !event) {
        return (
            <section className="recruitment-section">
                <h2 className="recruitment-title">
                    Registration Unavailable
                </h2>

                <p
                    style={{
                        color: '#ff6b6b',
                        textAlign: 'center'
                    }}
                >
                    {eventError}
                </p>

                <Link
                    to="/registrations"
                    className="apply-btn"
                    style={{
                        display: 'inline-block',
                        textAlign: 'center',
                        textDecoration: 'none',
                        marginTop: '20px'
                    }}
                >
                    Back to Registrations
                </Link>

                <Footer />
            </section>
        );
    }

    if (event.status !== 'open') {
        return (
            <section className="recruitment-section">
                <h2 className="recruitment-title">
                    {event.title}
                </h2>

                <p
                    style={{
                        color: '#aaa',
                        textAlign: 'center'
                    }}
                >
                    Registrations for this event are not currently open.
                </p>

                <Link
                    to="/registrations"
                    className="apply-btn"
                    style={{
                        display: 'inline-block',
                        textAlign: 'center',
                        textDecoration: 'none',
                        marginTop: '20px'
                    }}
                >
                    Back to Registrations
                </Link>

                <Footer />
            </section>
        );
    }

    if (submitted) {
        return (
            <section className="recruitment-section">
                <h2 className="recruitment-title">
                    Thank You!
                </h2>

                <p
                    style={{
                        color: '#ddd',
                        textAlign: 'center',
                        maxWidth: '480px',
                        margin: '0 auto'
                    }}
                >
                    Your registration for <strong>{event.title}</strong> has
                    been submitted successfully.
                    We'll be in touch with further details soon.
                </p>

                <Link
                    to="/registrations"
                    className="apply-btn"
                    style={{
                        display: 'inline-block',
                        textAlign: 'center',
                        textDecoration: 'none',
                        marginTop: '20px'
                    }}
                >
                    Back to Registrations
                </Link>

                <Footer />
            </section>
        );
    }

    return (
        <>
            <Helmet>
                <title>
                    {event.title} Registration | Aero NITK
                </title>

                <meta
                    name="description"
                    content={
                        event.description ||
                        `Register for ${event.title} at Aero NITK.`
                    }
                />

                <link
                    rel="canonical"
                    href={`https://aeronitk.in/register/${registrationKey}`}
                />
            </Helmet>

            <section className="recruitment-section">

                {applicationCount !== null && (
                    <div className="application-counter">
                        <span className="counter-label">
                            Total Registrations:
                        </span>

                        <span className="counter-number">
                            {applicationCount}
                        </span>
                    </div>
                )}

                <h2 className="recruitment-title">
                    {event.title}
                </h2>

                {event.description && (
                    <p
                        style={{
                            color: '#aaa',
                            textAlign: 'center',
                            maxWidth: '480px',
                            margin: '0 auto 20px'
                        }}
                    >
                        {renderDescription(event.description)}
                    </p>
                )}

                <form
                    className="recruitment-card"
                    onSubmit={handleSubmit}
                >
                    <div
                        style={{ display: 'none' }}
                        aria-hidden="true"
                    >
                        <input
                            type="text"
                            name="hp_field"
                            value={formData.hp_field}
                            onChange={handleInputChange}
                            tabIndex="-1"
                            autoComplete="off"
                        />
                    </div>

                    <label>
                        NAME
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Your Full Name"
                        />
                    </label>

                    <label>
                        E-Mail
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="you@nitk.edu.in"
                        />
                    </label>

                    <label>
                        ROLL NUMBER
                        <input
                            type="text"
                            name="rollNo"
                            value={formData.rollNo}
                            onChange={handleInputChange}
                            required
                            placeholder="Your Roll Number"
                        />
                    </label>

                    <label>
                        PHONE NUMBER
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

                    <label>
                        BRANCH
                        <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleInputChange}
                            required
                        >
                            <option
                                value=""
                                disabled
                                hidden
                            >
                                Select Here
                            </option>

                            {branches.map((br, idx) => (
                                <option
                                    key={idx}
                                    value={br}
                                >
                                    {br}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        YEAR
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            required
                        >
                            <option
                                value=""
                                disabled
                                hidden
                            >
                                Select Here
                            </option>

                            {years.map((yr, idx) => (
                                <option
                                    key={idx}
                                    value={yr}
                                >
                                    {yr}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="payment-qr-section">
    <span className="payment-qr-label">
        Scan &amp; Pay
    </span>

    <img
        src={
            registrationKey === 'wright-flight'
                ? wrightFlightQr
                : !qrImageFailed
                ? `/qr-codes/${registrationKey}.png`
                : wrightFlightQr
        }
        alt={`Payment QR code for ${event.title}`}
        className="payment-qr-image"
        onError={() => setQrImageFailed(true)}
    />
</div>

                    <label>
                        PAYMENT SCREENSHOT
                        <input
                            ref={screenshotInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotChange}
                        />
                    </label>

                    {screenshotProcessing && (
                        <p className="payment-upload-status">
                            Processing image…
                        </p>
                    )}

                    {screenshotError && (
                        <p className="payment-upload-error">
                            {screenshotError}
                        </p>
                    )}

                    {formData.paymentScreenshot && !screenshotProcessing && (
                        <div className="payment-upload-preview">
                            <img
                                src={formData.paymentScreenshot}
                                alt="Payment screenshot preview"
                            />

                            <div className="payment-upload-preview-info">
                                <span>
                                    {screenshotFileName || 'Screenshot attached'}
                                </span>

                                <button
                                    type="button"
                                    onClick={handleRemoveScreenshot}
                                    className="remove-screenshot-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        className="apply-btn"
                        type="submit"
                        disabled={isSubmitting || screenshotProcessing}
                    >
                        {isSubmitting
                            ? "SUBMITTING..."
                            : "REGISTER NOW"}
                    </button>
                </form>

            </section>

            <Footer />
        </>
    );
};

export default EventRegistrationForm;
