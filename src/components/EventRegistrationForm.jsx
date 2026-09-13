import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './recruitment_page.css';
import {
    saveEventRegistration,
    checkDuplicateEventRegistration,
    getEventRegistrationCount
} from '../firebase.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const branches = [
    "Computer Science and Engineering", "Artificial Intelligence", "Information Technology",
    "Electronics and Communication Engineering", "Electrical and Electronics Engineering",
    "Computational and Data Science", "Mechanical Engineering", "Mathematical and Computational Sciences",
    "Civil Engineering", "Chemical Engineering", "Metallurgical and Materials Engineering", "Mining Engineering"
];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

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
        hp_field: ""
    });

    // Look up this event's details from the backend by its registrationKey,
    // so the form shows the right title/description without any new
    // per-event backend route.
    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/events`);
                const data = await res.json();
                if (!data.success) throw new Error(data.error || 'Failed to load event');
                const match = (data.events || []).find((e) => e.registrationKey === registrationKey);
                if (isMounted) {
                    setEvent(match || null);
                    if (!match) setEventError('This registration link is no longer active.');
                }
            } catch (err) {
                console.error('Error loading event:', err);
                if (isMounted) setEventError('Could not load this registration form. Please try again later.');
            } finally {
                if (isMounted) setEventLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [registrationKey]);

    useEffect(() => {
        if (!registrationKey) return;
        let isMounted = true;
        (async () => {
            const count = await getEventRegistrationCount(registrationKey);
            if (isMounted) setApplicationCount(count);
        })();
        return () => { isMounted = false; };
    }, [registrationKey]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        if (!/^(251|241)/.test(formData.rollNo)) {
            alert("Roll number must start with 251 or 241.");
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

        setIsSubmitting(true);

        const duplicateCheck = await checkDuplicateEventRegistration(registrationKey, {
            rollNo: formData.rollNo,
            email: formData.email,
            phone: formData.phone
        });

        if (duplicateCheck.duplicate) {
            alert(`An application with this ${duplicateCheck.field} already exists. Each user can only submit one registration.`);
            setIsSubmitting(false);
            return;
        }

        const { hp_field, ...submissionData } = formData;
        const result = await saveEventRegistration(registrationKey, submissionData);
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
            alert('Something went wrong submitting your registration. Please try again.');
        }
    };

    if (eventLoading) {
        return (
            <section className="recruitment-section">
                <p style={{ color: '#aaa', textAlign: 'center' }}>Loading...</p>
                <Footer />
            </section>
        );
    }

    if (eventError || !event) {
        return (
            <section className="recruitment-section">
                <h2 className="recruitment-title">Registration Unavailable</h2>
                <p style={{ color: '#ff6b6b', textAlign: 'center' }}>{eventError}</p>
                <Link to="/registrations" className="apply-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', marginTop: '20px' }}>
                    Back to Registrations
                </Link>
                <Footer />
            </section>
        );
    }

    if (event.status !== 'open') {
        return (
            <section className="recruitment-section">
                <h2 className="recruitment-title">{event.title}</h2>
                <p style={{ color: '#aaa', textAlign: 'center' }}>
                    Registrations for this event are not currently open.
                </p>
                <Link to="/registrations" className="apply-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', marginTop: '20px' }}>
                    Back to Registrations
                </Link>
                <Footer />
            </section>
        );
    }

    if (submitted) {
        return (
            <section className="recruitment-section">
                <h2 className="recruitment-title">Thank You!</h2>
                <p style={{ color: '#ddd', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
                    Your registration for <strong>{event.title}</strong> has been submitted successfully.
                    We'll be in touch with further details soon.
                </p>
                <Link to="/registrations" className="apply-btn" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', marginTop: '20px' }}>
                    Back to Registrations
                </Link>
                <Footer />
            </section>
        );
    }

    return (
        <>
            <Helmet>
                <title>{event.title} Registration | Aero NITK</title>
                <meta name="description" content={event.description || `Register for ${event.title} at Aero NITK.`} />
                <link rel="canonical" href={`https://aeronitk.in/register/${registrationKey}`} />
            </Helmet>
            <section className="recruitment-section">
                {applicationCount !== null && (
                    <div className="application-counter">
                        <span className="counter-label">Total Registrations:</span>
                        <span className="counter-number">{applicationCount}</span>
                    </div>
                )}

                <h2 className="recruitment-title">{event.title}</h2>
                {event.description && (
                    <p style={{ color: '#aaa', textAlign: 'center', maxWidth: '480px', margin: '0 auto 20px' }}>
                        {event.description}
                    </p>
                )}

                <form className="recruitment-card" onSubmit={handleSubmit}>
                    <div style={{ display: 'none' }} aria-hidden="true">
                        <input type="text" name="hp_field" value={formData.hp_field} onChange={handleInputChange} tabIndex="-1" autoComplete="off" />
                    </div>

                    <label>NAME
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your Full Name" />
                    </label>
                    <label>E-Mail
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="you@nitk.edu.in" />
                    </label>
                    <label>ROLL NUMBER
                        <input type="text" name="rollNo" value={formData.rollNo} onChange={handleInputChange} required placeholder="Your Roll Number" />
                    </label>
                    <label>PHONE NUMBER
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="10-Digit Number" pattern="[0-9]{10}" />
                    </label>
                    <label>BRANCH
                        <select name="branch" value={formData.branch} onChange={handleInputChange} required>
                            <option value="" disabled hidden>Select Here</option>
                            {branches.map((br, idx) => (
                                <option key={idx} value={br}>{br}</option>
                            ))}
                        </select>
                    </label>
                    <label>YEAR
                        <select name="year" value={formData.year} onChange={handleInputChange} required>
                            <option value="" disabled hidden>Select Here</option>
                            {years.map((yr, idx) => (
                                <option key={idx} value={yr}>{yr}</option>
                            ))}
                        </select>
                    </label>

                    <button className="apply-btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "SUBMITTING..." : "REGISTER NOW"}
                    </button>
                </form>
            </section>
            <Footer />
        </>
    );
};

export default EventRegistrationForm;