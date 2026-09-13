import React from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './wright_flight_registration.css';
import './WrightFlightSuccess.css';

const WRIGHT_FLIGHT_WHATSAPP_LINK = 'https://chat.whatsapp.com/LNll34Lz6kR9653s0MsiXo';

const WrightFlightSuccess = () => {
    return (
        <>
            <Helmet>
                <title>Wright Flight Registration Successful | Aero NITK</title>
                <meta
                    name="description"
                    content="You have successfully registered for Wright Flight at Aero NITK."
                />
            </Helmet>

            <section className="wright-flight-section">
                <h2 className="wright-flight-title">REGISTRATION SUCCESSFUL</h2>

                <div className="wright-flight-guidelines wright-flight-success-card">
                    <div className="wright-flight-success-icon">OK</div>
                    <h3 className="guidelines-heading">You're in!</h3>
                    <p className="wright-flight-success-text">
                        Your registration for <strong>Wright Flight</strong> has been received successfully.
                    </p>
                    <div className="wright-flight-success-divider" />
                    <p className="wright-flight-success-text">
                        We will contact your team through the captain details you submitted.
                    </p>
                    <div className="wright-flight-success-divider" />
                    <div className="wright-flight-whatsapp-section">
                        <h3 className="wright-flight-whatsapp-heading">WhatsApp Group</h3>
                        <p className="wright-flight-whatsapp-text">
                            Join the official group for Wright Flight updates, schedules, and announcements.
                        </p>
                        <a
                            href={WRIGHT_FLIGHT_WHATSAPP_LINK}
                            className="wright-flight-whatsapp-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Join WhatsApp Group
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default WrightFlightSuccess;
