
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';

import {
    getCustomRegistration
} from '../data/customRegistrationRoutes.js';
import './RegistrationsPage.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const STATUS_META = {
    open: { tab: 'ongoing', badge: 'Open Now' },
    soon: { tab: 'upcoming', badge: 'Opens Soon' },
    closed: { tab: 'past', badge: 'Closed' }
};


function normalizeEvent(event) {
    const normalizeKey = (value) =>
        String(value || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');

    const eventTitle = normalizeKey(event.title);
    const eventKey = normalizeKey(event.registrationKey);
    const eventCtaLink = (event.ctaLink || '').trim();

    const isWrightFlight =
        eventKey === 'wrightflight' ||
        eventTitle === 'wrightflight' ||
        eventCtaLink === '/wright_flight_registration';

    const customRegistration =
        getCustomRegistration(event.registrationKey) ||
        (eventTitle === 'dronecompetition' || eventTitle === 'dronecompetetion'
            ? getCustomRegistration('droneCompetition')
            : null);

    // Use the status saved by the admin dashboard.
    const meta = STATUS_META[event.status];

    if (!meta) return null;

    const builtInRegistrationLink = isWrightFlight
        ? '/wright_flight_registration'
        : customRegistration
            ? customRegistration.path
            : event.registrationKey
                ? `/register/${event.registrationKey}`
                : null;

    const resolvedLink = isWrightFlight || customRegistration
        ? builtInRegistrationLink
        : eventCtaLink || builtInRegistrationLink;

    const ctaLabel = isWrightFlight && meta.tab !== 'ongoing'
        ? meta.tab === 'upcoming'
            ? 'Opens Soon'
            : 'Registration Closed'
        : event.ctaLabel?.trim()
            ? event.ctaLabel.trim()
            : meta.tab === 'ongoing'
                ? 'Open Registration Form'
                : meta.tab === 'upcoming'
                    ? 'Opens Soon'
                    : 'Registration Closed';

    return {
        id: event._id,
        title: event.title,
        subtitle: event.subtitle || 'Aero NITK Registration',
        status: meta.tab,
        badge: meta.badge,
        description: event.description || '',
        ctaLabel,
        ctaLink: meta.tab === 'ongoing' ? resolvedLink : null
    };
}




const renderEventDescription = (description) => {
    const parts = String(description || '').split(
        /(https?:\/\/[^\s]+)/gi
    );

    return parts.map((part, index) => {
        if (!/^https?:\/\//i.test(part)) {
            return part;
        }

        const punctuation = part.match(/[.,!?;:)\]]+$/)?.[0] || '';
        const url = punctuation
            ? part.slice(0, -punctuation.length)
            : part;

        let label = '';

        try {
            const hostname = new URL(url).hostname.toLowerCase();

            if (
                hostname === 'wa.me' ||
                hostname === 'whatsapp.com' ||
                hostname.endsWith('.whatsapp.com')
            ) {
                label = 'Join Group';
            } else if (
                hostname === 'drive.google.com' ||
                hostname === 'docs.google.com'
            ) {
                label = 'View Rulebook';
            }
        } catch {
            return part;
        }

        if (!label) {
            return part;
        }

        return (
            <React.Fragment key={`description-link-${index}`}>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {label}
                </a>
                {punctuation}
            </React.Fragment>
        );
    });
};

const RegistrationsPage = () => {
    const [rawEvents, setRawEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('ongoing');

    useEffect(() => {
        let isMounted = true;

        const loadEvents = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/events`);
                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error || 'Failed to fetch events');
                }

                if (isMounted) {
                    setRawEvents(data.events || []);
                    setError(null);
                }
            } catch (err) {
                console.error('Error loading registrations:', err);

                if (isMounted) {
                    setError(
                        'Could not load registrations. Please try again later.'
                    );
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadEvents();

        return () => {
            isMounted = false;
        };
    }, []);

    const events = useMemo(
        () => rawEvents.map(normalizeEvent).filter(Boolean),
        [rawEvents]
    );

    useEffect(() => {
        if (loading || events.length === 0) return;

        const hasActiveTabEvents = events.some(
            (event) => event.status === activeTab
        );

        if (!hasActiveTabEvents) {
            const firstNonEmptyTab = ['ongoing', 'upcoming', 'past'].find(
                (tab) => events.some((event) => event.status === tab)
            );

            if (firstNonEmptyTab) setActiveTab(firstNonEmptyTab);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, events]);

    const filteredEvents = events.filter(
        (event) => event.status === activeTab
    );

    const renderCardAction = (event) => {
        if (event.ctaLink) {
            const isExternalLink = /^https?:\/\//i.test(event.ctaLink);

            if (isExternalLink) {
                return (
                    <a
                        href={event.ctaLink}
                        className="registration-card-button"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {event.ctaLabel}
                    </a>
                );
            }

            return (
                <Link
                    to={event.ctaLink}
                    className="registration-card-button"
                >
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
                <link
                    rel="canonical"
                    href="https://aeronitk.in/registrations"
                />
            </Helmet>

            <section className="registrations-page">
                <div className="registrations-shell">
                    <div className="registrations-header">
                        <p className="registrations-kicker">Event Portal</p>
                        <h1>Registrations</h1>
                        <p className="registrations-intro">
                            Browse current Aero NITK registration windows.
                            Ongoing events accept responses, upcoming events
                            are announced here in advance, and past
                            registrations are shown as closed.
                        </p>
                    </div>

                    <div
                        className="registrations-tabs"
                        role="tablist"
                        aria-label="Registration categories"
                    >
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
                                className={`registrations-tab ${activeTab === tab.key ? 'active' : ''
                                    }`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="registrations-grid">
                        {loading ? null : error ? (
                            <div className="registrations-empty">
                                <h2>Couldn't load registrations</h2>
                                <p>{error}</p>
                            </div>
                        ) : filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <article
                                    key={event.id}
                                    className={`registration-card ${event.status}`}
                                >
                                    <div className="registration-card-top">
                                        <span
                                            className={`registration-status ${event.status}`}
                                        >
                                            {event.badge}
                                        </span>
                                        <p>{event.subtitle}</p>
                                    </div>

                                    <h2>{event.title}</h2>

                                    <p className="registration-card-description">
                                        {renderEventDescription(event.description)}
                                    </p>

                                    {renderCardAction(event)}
                                </article>
                            ))
                        ) : (
                            <div className="registrations-empty">
                                <h2>No events here right now</h2>
                                <p>
                                    There are no {activeTab} registrations
                                    at the moment. Check the other tabs
                                    for updates.
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
