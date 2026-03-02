import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './workshop_registration.css';
import './WorkshopSuccess.css';

const WHATSAPP_LINK = 'https://chat.whatsapp.com/HJGDITPzGxNGgvrB9g2JnR?mode=gi_t';

const WorkshopSuccess = () => {
    const [joined, setJoined] = useState(false);

    // Block tab close / browser navigation until the user clicks the WhatsApp link
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!joined) {
                e.preventDefault();
                e.returnValue = ''; // Required for Chrome to show the dialog
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [joined]);

    const handleWhatsAppClick = () => {
        setJoined(true);
        window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Helmet>
                <title>Registration Successful | Aero NITK</title>
                <meta name="description" content="You have successfully registered for the Skyverse Aeromodelling Workshop at NITK Surathkal." />
            </Helmet>

            <section className="workshop-section">
                <h2 className="workshop-title">REGISTRATION SUCCESSFUL 🎉</h2>

                <div className="workshop-guidelines success-guidelines">
                    <div className="success-icon-wrap">
                        <div className="success-checkmark">✓</div>
                    </div>
                    <h3 className="guidelines-heading">You're in!</h3>
                    <p className="success-subtext">
                        Your registration for the <strong>Skyverse Aeromodelling Workshop</strong> has been received. Welcome aboard!
                    </p>

                    <div className="success-divider" />

                    <p className="whatsapp-instruction">
                        <strong>One last step:</strong> Join the official WhatsApp group to receive all workshop updates, schedules, and announcements.
                    </p>

                    <button
                        className={`whatsapp-join-btn ${joined ? 'whatsapp-joined' : ''}`}
                        onClick={handleWhatsAppClick}
                        disabled={joined}
                    >
                        {joined ? (
                            <>✓ Joined — See you at the workshop!</>
                        ) : (
                            <>
                                <svg className="whatsapp-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 0C7.163 0 0 7.163 0 16c0 2.825.737 5.476 2.027 7.774L0 32l8.469-2.001A15.937 15.937 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.267 13.267 0 01-6.759-1.845l-.486-.288-5.027 1.188 1.21-4.899-.317-.502A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.274-9.961c-.398-.199-2.356-1.163-2.72-1.296-.364-.133-.629-.199-.894.199-.266.398-1.029 1.296-1.261 1.562-.232.265-.465.298-.863.1-.398-.199-1.681-.619-3.201-1.977-1.183-1.057-1.981-2.362-2.214-2.76-.232-.398-.025-.613.175-.812.179-.178.398-.465.597-.698.199-.232.265-.398.398-.664.133-.265.066-.498-.033-.697-.1-.199-.894-2.157-1.227-2.953-.322-.775-.649-.669-.894-.682-.232-.012-.498-.015-.764-.015s-.697.1-.1062.498c-.364.398-1.394 1.362-1.394 3.32 0 1.959 1.427 3.851 1.626 4.117.199.265 2.809 4.288 6.807 5.514.951.326 1.694.521 2.273.667.955.241 1.824.207 2.512.126.766-.091 2.356-.963 2.688-1.894.332-.931.332-1.729.232-1.894-.099-.166-.364-.265-.762-.464z" />
                                </svg>
                                Join WhatsApp Group
                            </>
                        )}
                    </button>

                    {!joined && (
                        <p className="whatsapp-warning">
                            ⚠️ Please join the group before leaving this page — you may miss important updates.
                        </p>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
};

export default WorkshopSuccess;
