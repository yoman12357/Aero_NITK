import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './RegistrationsPage.css';
import { WORKSHOP_REGISTRATION_STATUS } from './workshop_registration.jsx';
import { WRIGHT_FLIGHT_REGISTRATION_STATUS } from './wright_flight_registration.jsx';

const RegistrationsPage = () => {
    // This helper decides which tab should show a registration card
    // based on the status exported by each registration file.
    const getTabForStatus = (status) => {
        if (status === 'ongoing') return 'ongoing';
        if (status === 'upcoming') return 'upcoming';
        return 'past';
    };

    const [activeTab, setActiveTab] = useState(getTabForStatus(WRIGHT_FLIGHT_REGISTRATION_STATUS));

    const events = useMemo(() => ([
        {
            id: 'wright-flight',
            title: 'Wright Flight',
            subtitle: 'Aero NITK Registration',
            status: getTabForStatus(WRIGHT_FLIGHT_REGISTRATION_STATUS),
            description:
                WRIGHT_FLIGHT_REGISTRATION_STATUS === 'ongoing'
                    ? 'Registrations are live now. Limited slots are available on a first-come, first-served basis.'
                    : WRIGHT_FLIGHT_REGISTRATION_STATUS === 'upcoming'
                        ? 'This registration will open soon. Keep an eye on this page for the official launch.'
                        : 'This registration has closed.',
            badge:
                WRIGHT_FLIGHT_REGISTRATION_STATUS === 'ongoing'
                    ? 'Open Now'
                    : WRIGHT_FLIGHT_REGISTRATION_STATUS === 'upcoming'
                        ? 'Opens Soon'
                        : 'Closed',
            ctaLabel: WRIGHT_FLIGHT_REGISTRATION_STATUS === 'ongoing' ? 'Open Registration Form' : 'Registration Closed',
            ctaLink: WRIGHT_FLIGHT_REGISTRATION_STATUS === 'ongoing' ? '/wright_flight_registration' : null
        },
        {
            id: 'skyverse-workshop',
            title: 'Skyverse Aeromodelling Workshop',
            subtitle: 'Aero NITK Registration',
            status: getTabForStatus(WORKSHOP_REGISTRATION_STATUS),
            description:
                WORKSHOP_REGISTRATION_STATUS === 'ongoing'
                    ? 'Workshop registrations are currently live.'
                    : WORKSHOP_REGISTRATION_STATUS === 'upcoming'
                        ? 'This workshop registration is announced in advance and will open soon.'
                        : 'This registration has already closed. All available slots were filled.',
            badge:
                WORKSHOP_REGISTRATION_STATUS === 'ongoing'
                    ? 'Open Now'
                    : WORKSHOP_REGISTRATION_STATUS === 'upcoming'
                        ? 'Opens Soon'
                        : 'Closed',
            ctaLabel: WORKSHOP_REGISTRATION_STATUS === 'ongoing' ? 'Open Registration Form' : 'Registration Closed',
            ctaLink: WORKSHOP_REGISTRATION_STATUS === 'ongoing' ? '/workshop_registration' : null
        }
    ]), []);

    const filteredEvents = events.filter((event) => event.status === activeTab);

    const renderCardAction = (event) => {
        if (event.ctaLink) {
            return (
                <Link to={event.ctaLink} className="registration-card-button">
                    {event.ctaLabel}
                </Link>
            );
        }

        return (
            <span className="registration-card-button disabled">
                {event.ctaLabel}
            </span>
        );
    };

    return (
        <>
            <Helmet>
                <title>Registrations | Aero NITK</title>
                <meta
                    name="description"
                    content="Track Aero NITK registrations across ongoing, upcoming, and past events."
                />
                <link rel="canonical" href="https://aeronitk.in/registrations" />
            </Helmet>

            <section className="registrations-page">
                <div className="registrations-shell">
                    <div className="registrations-header">
                        <p className="registrations-kicker">Event Portal</p>
                        <h1>Registrations</h1>
                        <p className="registrations-intro">
                            Browse current Aero NITK registration windows. Ongoing events accept responses,
                            upcoming events are announced here in advance, and past registrations are shown as closed.
                        </p>
                    </div>

                    <div className="registrations-tabs" role="tablist" aria-label="Registration categories">
                        {[
                            { key: 'ongoing', label: 'Ongoing' },
                            { key: 'upcoming', label: 'Upcoming' },
                            { key: 'past', label: 'Past' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.key}
                                className={`registrations-tab ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="registrations-grid">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <article key={event.id} className={`registration-card ${event.status}`}>
                                    <div className="registration-card-top">
                                        <span className={`registration-status ${event.status}`}>{event.badge}</span>
                                        <p>{event.subtitle}</p>
                                    </div>
                                    <h2>{event.title}</h2>
                                    <p className="registration-card-description">{event.description}</p>
                                    {renderCardAction(event)}
                                </article>
                            ))
                        ) : (
                            <div className="registrations-empty">
                                <h2>No events here right now</h2>
                                <p>
                                    There are no {activeTab} registrations at the moment. Check the other tabs for updates.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default RegistrationsPage;
