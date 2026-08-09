import React from 'react';
import { EVENT_TO_REGISTRATION_KEY } from '../constants.js';

/**
 * Single event card used in the Events tab listing.
 *
 * @param {{
 *   event: Object,
 *   index: number,
 *   eventImage: string|undefined,
 *   regCounts: Object|null,
 *   onImageChange: (eventId: string, file: File) => void,
 *   onEdit: (eventId: string) => void,
 *   onDelete: (eventId: string) => void,
 * }} props
 */
function EventCard({ event, index, eventImage, regCounts, onImageChange, onEdit, onDelete }) {
    // Inject live participant count for events that match a registration type
    const regKey = EVENT_TO_REGISTRATION_KEY[event.id];

    // Parse legacy string if needed
    let baseCount = event.currentParticipants || 0;
    let maxCap = event.maxCapacity || 0;
    if (event.participants && !event.maxCapacity && !event.currentParticipants) {
        const parts = String(event.participants).split('/');
        baseCount = parseInt(parts[0], 10) || 0;
        if (parts[1]) maxCap = parseInt(parts[1], 10) || 0;
    }

    const actualCount = regKey && regCounts && regCounts[regKey] !== undefined
        ? regCounts[regKey]
        : baseCount;

    const displayParticipants = maxCap > 0
        ? `${actualCount}/${maxCap}`
        : `${actualCount}`;

    return (
        <article className="admin-dashboard-event-card">
            <div
                className={`admin-dashboard-event-thumb thumb-${(index % 3) + 1} ${eventImage ? 'has-image' : ''}`}
                style={eventImage ? { backgroundImage: `url(${eventImage})` } : undefined}
            >
                <label className="admin-dashboard-image-upload">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(changeEvent) => onImageChange(event.id, changeEvent.target.files?.[0])}
                    />
                    <span>{eventImage ? 'Change Image' : 'Add Image'}</span>
                </label>
            </div>
            <div className="admin-dashboard-event-copy">
                {event.status ? <span className={`admin-dashboard-status status-${event.statusTone}`}>{event.status}</span> : null}
                <h3>{event.title}</h3>
                <p>{event.description}</p>
            </div>
            <div className="admin-dashboard-event-meta">
                <strong>{displayParticipants}</strong>
                <span>Participants</span>
            </div>
            <div className="admin-dashboard-event-actions">
                <button type="button" aria-label="Edit event" onClick={() => onEdit(event.id)}>
                    <svg viewBox="0 0 24 24"><path d="M4 20h4l10-10-4-4L4 16v4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M13 7l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
                <button type="button" aria-label="Delete event" className="danger" onClick={() => onDelete(event.id)}>
                    <svg viewBox="0 0 24 24"><path d="M5 7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M7 7l1 13h8l1-13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
                </button>
            </div>
        </article>
    );
}

export default EventCard;
