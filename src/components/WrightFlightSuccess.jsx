import React from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './wright_flight_registration.css';
import './WrightFlightSuccess.css';

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
                        We will contact selected participants through the details you submitted.
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default WrightFlightSuccess;
