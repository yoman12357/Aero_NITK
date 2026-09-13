import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from './footer.jsx';
import './RegistrationsPage.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Maps the Sanity `status` field to which Registrations tab an event
// appears under, and what its badge says.
const STATUS_META = {
    open: { tab: 'ongoing', badge: 'Open Now' },
    soon: { tab: 'upcoming', badge: 'Opens Soon' },
    closed: { tab: 'past', badge: 'Closed' }
    // 'none' status is intentionally omitted — those events are Hidden
    // and never shown on this page, matching the Sanity schema's label.
};

function normalizeEvent(event) {
    const meta = STATUS_META[event.status];
    if (!meta) return null; // status 'none' (Hidden), or unrecognized — skip entirely

    // Every event gets a registration link "for free" from its
    // registrationKey — pointing at the one generic form component.
    // A custom ctaLink (e.g. an external Unstop/Google Form link) still
    // takes priority when set on the event.
    const resolvedLink = event.ctaLink?.trim()
        ? event.ctaLink.trim()
        : event.registrationKey
            ? `/register/${event.registrationKey}`
            : null;

    // Only show a live, clickable CTA for events that are actually open —
    // upcoming/past events display the label as text, not a link, even if
    // a link technically exists (mirrors the previous hardcoded behavior).
    const ctaLink = meta.tab === 'ongoing' ? resolvedLink : null;

    const ctaLabel = event.ctaLabel?.trim()
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
        ctaLink
    };
}

const RegistrationsPage = () => {
    const [rawEvents, setRawEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('ongoing');

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/events`);
                const data = await res.json();
                if (!data.success) throw new Error(data.error || 'Failed to fetch events');
                if (isMounted) {
                    setRawEvents(data.events || []);
                    setError(null);
                }
            } catch (err) {
                console.error('Error loading events:', err);
                if (isMounted) setError('Could not load registrations. Please try again later.');
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    const events = useMemo(
        () => rawEvents.map(normalizeEvent).filter(Boolean),
        [rawEvents]
    );

    // If there's nothing in the tab the page defaulted to, land on the
    // first tab that actually has events, so the page isn't misleadingly
    // empty on first load.
    useEffect(() => {
        if (loading || events.length === 0) return;
        const hasActiveTabEvents = events.some((e) => e.status === activeTab);
        if (!hasActiveTabEvents) {
            const firstNonEmptyTab = ['ongoing', 'upcoming', 'past'].find(
                (tab) => events.some((e) => e.status === tab)
            );
            if (firstNonEmptyTab) setActiveTab(firstNonEmptyTab);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, events]);

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
                        {loading ? null : error ? (
                            <div className="registrations-empty">
                                <h2>Couldn't load registrations</h2>
                                <p>{error}</p>
                            </div>
                        ) : filteredEvents.length > 0 ? (
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
