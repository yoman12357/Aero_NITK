import React from 'react';

/**
 * Single event card used in the Events tab listing.
 *
 * @param {{
 *   event: Object,
 *   index: number,
 *   regCounts: Object|null,
 *   onManage: (event: Object) => void,
 *   onDelete: (eventId: string) => void,
 * }} props
 */
function EventCard({ event, index, regCounts, onManage, onDelete }) {
    // Inject live participant count for events that match a registration type
    const regKey = event.registrationKey;

    // Parse legacy string if needed
    let baseCount = event.manualParticipantCount || 0;
    let maxCap = event.maxCapacity || 0;

    const actualCount = regKey && regCounts && regCounts[regKey] !== undefined
        ? regCounts[regKey]
        : baseCount;

    const displayParticipants = maxCap > 0
        ? `${actualCount}/${maxCap}`
        : `${actualCount}`;

    return (
        <article className="admin-dashboard-event-card">
            <div
                className={`admin-dashboard-event-thumb thumb-${(index % 3) + 1} ${event.imageUrl ? 'has-image' : ''}`}
                style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : undefined}
            >
            </div>
            <div className="admin-dashboard-event-copy">
                {event.status && event.status !== 'none' ? <span className={`admin-dashboard-status status-${event.status}`}>{event.status === 'soon' ? 'OPENS SOON' : event.status.toUpperCase()}</span> : null}
                <h3>{event.title}</h3>
                <p>{event.description}</p>
            </div>
            <div className="admin-dashboard-event-meta">
                <strong>{displayParticipants}</strong>
                <span>Participants</span>
            </div>
            <div className="admin-dashboard-event-actions">
                <button type="button" aria-label={`Manage ${event.title} in Sanity Studio`} title="Manage in Sanity Studio" onClick={() => onManage(event)}>
                    <svg viewBox="0 0 24 24"><path d="M4 20h4l10-10-4-4L4 16v4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M13 7l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
                {onDelete && (
                    <button type="button" aria-label={`Delete ${event.title}`} title="Delete event" onClick={() => onDelete(event._id)}>
                        <svg viewBox="0 0 24 24"><path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M9 7V4h6v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 7l1 13h10l1-13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                    </button>
                )}
            </div>
        </article>
    );
}

export default EventCard;