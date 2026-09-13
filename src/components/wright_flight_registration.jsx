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
const MAX_TEAM_SIZE = 4;

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
        captainName: '',
        phone: '',
        email: '',
        teamName: '',
        collegeName: '',
        participantCount: '1',
        teamMember1: '',
        teamMember2: '',
        teamMember3: '',
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
        if (formData.captainName.trim().length < 3) {
            alert("Please enter the team captain's full name (min 3 characters).");
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

        setIsSubmitting(true);
        setDuplicateError('');

        // so we do not accept responses above the slot limit.
        const currentCount = await getWrightFlightRegistrationCount();
        if (currentCount !== null && currentCount >= WRIGHT_FLIGHT_MAX_SLOTS) {
            setDuplicateError(
                `Registrations are now closed - we've reached the maximum of ${WRIGHT_FLIGHT_MAX_SLOTS} teams for Wright Flight.`
            );
            setSlotsLeft(0);
            setIsSubmitting(false);
            return;
        }

        // Prevent the same person from registering more than once.
        const dupCheck = await checkDuplicateWrightFlightRegistration({
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
            captainName: formData.captainName.trim(),
            // Keep `name` for compatibility with the existing registrations dashboard.
            name: formData.captainName.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim().toLowerCase(),
            teamName: formData.teamName.trim(),
            collegeName: formData.collegeName.trim(),
            participantCount,
            teamMembers: requiredMemberNames.map((memberName) => memberName.trim()),
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
                phone: '',
                email: '',
                teamName: '',
                collegeName: '',
                participantCount: '1',
                teamMember1: '',
                teamMember2: '',
                teamMember3: '',
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

                {isWrightFlightUpcoming ? (
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
