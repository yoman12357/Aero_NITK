import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './DroneCompetitionRegistration.css';
import wrightFlightQr from '../images/wright_flight_qr.jpeg';



const REGISTRATION_FEE = 300;
const GST_RATE = 18;
const GST_AMOUNT = REGISTRATION_FEE * GST_RATE / 100;
const TOTAL_AMOUNT = REGISTRATION_FEE + GST_AMOUNT;


const DroneCompetitionRegistration = () => {
    const [formData, setFormData] = useState({
        teamName: '',
        captainName: '',
        email: '',
        phone: '',
        collegeName: '',
        teamMembers: '',
        hp_field: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <Helmet>
                <title>Drone Competition Registration | Aero NITK</title>
                <meta
                    name="description"
                    content="Drone Competition registration by Aero NITK."
                />
            </Helmet>

            <section className="drone-registration-section">
                <h1 className="drone-registration-title">
                    DRONE COMPETITION
                    <span>REGISTRATION</span>
                </h1>

                <div className="drone-registration-notice">
                    <h2>Registration Form</h2>
                    <p>
                        The registration structure is being prepared.
                        Official competition details will be announced soon.
                    </p>
                    <p>
                        Please wait for the registration form to officially open.
                    </p>

                </div>

                <div className="drone-registration-payment">
                    <h2>Registration Fee</h2>

                    <div className="drone-registration-fee-row">
                        <span>Registration fee</span>
                        <span>₹{REGISTRATION_FEE}</span>
                    </div>

                    <div className="drone-registration-fee-row">
                        <span>GST ({GST_RATE}%)</span>
                        <span>₹{GST_AMOUNT}</span>
                    </div>

                    <div className="drone-registration-fee-row drone-registration-fee-total">
                        <strong>Total payable</strong>
                        <strong>₹{TOTAL_AMOUNT}</strong>
                    </div>

                    <p className="drone-registration-payment-hint">
                        Please do not make payment until registrations officially open.
                    </p>

                    <img
                        src={wrightFlightQr}
                        alt="Aero NITK payment QR code"
                        className="drone-registration-qr"
                    />
                </div>

                <form
                    className="drone-registration-card"
                    onSubmit={handleSubmit}

                >
                    <h2>Team Information</h2>

                    <label>
                        TEAM NAME
                        <input
                            type="text"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleInputChange}
                            placeholder="Enter your team name"
                            disabled
                        />
                    </label>

                    <label>
                        TEAM CAPTAIN NAME
                        <input
                            type="text"
                            name="captainName"
                            value={formData.captainName}
                            onChange={handleInputChange}
                            placeholder="Enter captain's full name"
                            disabled
                        />
                    </label>

                    <label>
                        EMAIL ADDRESS
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            disabled
                        />
                    </label>

                    <label>
                        PHONE NUMBER
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                            disabled
                        />
                    </label>

                    <label>
                        COLLEGE / INSTITUTION
                        <input
                            type="text"
                            name="collegeName"
                            value={formData.collegeName}
                            onChange={handleInputChange}
                            placeholder="Enter college name"
                            disabled
                        />
                    </label>

                    <label>
                        TEAM MEMBERS
                        <textarea
                            name="teamMembers"
                            value={formData.teamMembers}
                            onChange={handleInputChange}
                            placeholder="Team member names will be collected here"
                            rows={4}
                            disabled
                        />
                    </label>

                    <button type="submit" disabled>
                        Registrations Opening Soon
                    </button>

                    <p className="drone-registration-footnote">
                        Final fields and eligibility requirements will be
                        updated after the official details are received.
                    </p>
                </form>
            </section>

            <Footer />
        </>
    );
};

export default DroneCompetitionRegistration;