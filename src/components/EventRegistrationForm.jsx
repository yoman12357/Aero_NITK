import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './recruitment_page.css';
import {
    saveEventRegistration,
    checkDuplicateEventRegistration,
    getEventRegistrationCount,
    getEventTemplateMapping,
    getRegistrationTemplates
} from '../firebase.js';
import { client as sanityClient, EVENTS_QUERY } from '../lib/sanity.js';
import { findTemplateById } from '../data/registrationTemplates.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

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
    const [template, setTemplate] = useState(null);
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
        hp_field: ""
    });

    // Look up this event's details from backend or Sanity, and load its assigned template
    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                let eventsData = null;
                try {
                    const res = await fetch(`${BACKEND_URL}/api/events`);
                    const data = await res.json();
                    if (data.success && Array.isArray(data.events)) {
                        eventsData = data.events;
                    }
                } catch {
                    // Backend server unavailable
                }

                if (!eventsData) {
                    eventsData = await sanityClient.fetch(EVENTS_QUERY);
                }

                const match = (eventsData || []).find(
                    (e) => e.registrationKey === registrationKey
                );

                if (isMounted) {
                    setEvent(match || null);

                    if (!match) {
                        setEventError(
                            'This registration link is no longer active.'
                        );
                    } else {
                        // Load template for this event
                        const mapping = await getEventTemplateMapping(registrationKey);
                        const templateId = mapping?.templateId || match.registrationTemplate || (
                            match.registrationKey === 'wrightFlight' ? 'wrightFlight' :
                            match.registrationKey?.toLowerCase().includes('drone') ? 'droneCompetition' : 'standard'
                        );

                        const customList = await getRegistrationTemplates();
                        const foundTemplate = findTemplateById(templateId, customList);
                        if (foundTemplate && Array.isArray(foundTemplate.fields) && foundTemplate.fields.length > 0) {
                            setTemplate(foundTemplate);
                            const initial = { hp_field: '' };
                            foundTemplate.fields.forEach((f) => {
                                initial[f.id] = '';
                            });
                            setFormData((prev) => ({ ...initial, ...prev }));
                        }
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

    const handleFileChange = (name, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setFormData((prev) => ({
                ...prev,
                [name]: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Honeypot check
        if (formData.hp_field) {
            console.warn("Bot detected via honeypot.");
            return;
        }

        // Custom template validation
        if (template && Array.isArray(template.fields) && template.fields.length > 0) {
            for (const field of template.fields) {
                const val = formData[field.id];
                if (field.required && (val === undefined || val === null || val === '')) {
                    alert(`Please fill in required field: ${field.label}`);
                    return;
                }

                if (field.type === 'email' && val) {
                    const requiresNitk = field.helpText?.includes('@nitk.edu.in') || field.label?.includes('@nitk.edu.in') || field.placeholder?.includes('@nitk.edu.in');
                    if (requiresNitk) {
                        if (!/^[^\s@]+@nitk\.edu\.in$/.test(val)) {
                            alert(`Please enter a valid NITK email address (@nitk.edu.in) for ${field.label}.`);
                            return;
                        }
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                        alert(`Please enter a valid email address for ${field.label}.`);
                        return;
                    }
                }

                if (field.type === 'tel' && val) {
                    if (!/^[0-9]{10}$/.test(val)) {
                        alert(`Please enter a valid 10-digit phone number for ${field.label}.`);
                        return;
                    }
                }
            }
        } else {
            // Default 6 fields validation
            const emailRegex = /^[^\s@]+@nitk\.edu\.in$/;

            if (!emailRegex.test(formData.email)) {
                alert("Please enter a valid NITK email address (@nitk.edu.in).");
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
        }

        setIsSubmitting(true);

        // Check duplicate if rollNo, email, or phone are provided
        if (formData.rollNo || formData.email || formData.phone) {
            const duplicateCheck = await checkDuplicateEventRegistration(
                registrationKey,
                {
                    rollNo: formData.rollNo || '',
                    email: formData.email || '',
                    phone: formData.phone || ''
                }
            );

            if (duplicateCheck.duplicate) {
                alert(
                    `An application with this ${duplicateCheck.field} already exists. Each user can only submit one registration.`
                );

                setIsSubmitting(false);
                return;
            }
        }

        const submissionData = Object.fromEntries(
            Object.entries(formData).filter(([fieldName]) => fieldName !== 'hp_field')
        );

        if (event?.title) {
            submissionData.eventTitle = event.title;
        }

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

                    {template && Array.isArray(template.fields) && template.fields.length > 0 ? (
                        template.fields.map((field) => (
                            <label key={field.id} style={{ display: 'block', marginBottom: '16px' }}>
                                <span>
                                    {field.label.toUpperCase()} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                                </span>

                                {field.type === 'select' ? (
                                    <select
                                        name={field.id}
                                        value={formData[field.id] || ''}
                                        onChange={handleInputChange}
                                        required={field.required}
                                    >
                                        <option value="" disabled hidden>
                                            Select {field.label}
                                        </option>
                                        {field.options?.map((opt, oi) => (
                                            <option key={oi} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        name={field.id}
                                        rows="3"
                                        value={formData[field.id] || ''}
                                        onChange={handleInputChange}
                                        placeholder={field.placeholder || `Enter ${field.label}`}
                                        required={field.required}
                                    />
                                ) : field.type === 'file' ? (
                                    <div style={{ marginTop: '6px' }}>
                                        {/* Render QR code section directly above screenshot upload if template has one */}
                                        {template.qrCodeImage && (
                                            <div className="payment-qr-section" style={{ marginBottom: '16px' }}>
                                                {template.paymentAmount && (
                                                    <strong style={{ color: '#fff', fontSize: '1rem' }}>
                                                        Total payable: {template.paymentAmount}
                                                    </strong>
                                                )}
                                                {template.paymentInstructions ? (
                                                    <span className="payment-qr-label">{template.paymentInstructions}</span>
                                                ) : (
                                                    <span className="payment-qr-label">Scan &amp; Pay</span>
                                                )}
                                                <img
                                                    src={template.qrCodeImage}
                                                    alt="Payment QR code"
                                                    className="payment-qr-image"
                                                />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => handleFileChange(field.id, e.target.files?.[0])}
                                            required={field.required && !formData[field.id]}
                                        />
                                        {formData[field.id] && (
                                            <small style={{ color: '#4ade80', display: 'block', marginTop: '4px' }}>
                                                ✓ File attached successfully
                                            </small>
                                        )}
                                    </div>
                                ) : field.type === 'radio' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '8px 0' }}>
                                        {field.options?.map((opt, oi) => (
                                            <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'normal', cursor: 'pointer', margin: 0 }}>
                                                <input
                                                    type="radio"
                                                    name={field.id}
                                                    value={opt}
                                                    checked={formData[field.id] === opt}
                                                    onChange={handleInputChange}
                                                    required={field.required}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                ) : field.type === 'checkbox' ? (
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: '8px 0' }}>
                                        <input
                                            type="checkbox"
                                            name={field.id}
                                            checked={Boolean(formData[field.id])}
                                            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.checked })}
                                            required={field.required}
                                        />
                                        <span>I confirm / agree</span>
                                    </label>
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        name={field.id}
                                        value={formData[field.id] || ''}
                                        onChange={handleInputChange}
                                        placeholder={field.placeholder || `Enter ${field.label}`}
                                        required={field.required}
                                        pattern={field.type === 'tel' ? '[0-9]{10}' : undefined}
                                    />
                                )}

                                {field.helpText && (
                                    <small style={{ color: '#888', display: 'block', marginTop: '4px', fontSize: '0.8rem' }}>
                                        {field.helpText}
                                    </small>
                                )}
                            </label>
                        ))
                    ) : (
                        <>
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
                        </>
                    )}

                    <button
                        className="apply-btn"
                        type="submit"
                        disabled={isSubmitting}
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
