import React from 'react';
import EventCard from '../components/EventCard.jsx';

/**
 * Events tab — lists all events with add/edit/delete capabilities.
 *
 * @param {{
 *   events: Array,
 *   eventsLoading: boolean,
 *   eventImages: Object,
 *   regCounts: Object|null,
 *   onAddEvent: () => void,
 *   onEditEvent: (eventId: string) => void,
 *   onDeleteEvent: (eventId: string) => void,
 *   onImageChange: (eventId: string, file: File) => void,
 * }} props
 */
function EventsTab({ events, eventsLoading, eventImages, regCounts, onAddEvent, onEditEvent, onDeleteEvent, onImageChange }) {
    return (
        <div className="admin-dashboard-section">
            <div className="admin-dashboard-section-header">
                <h3 className="admin-dashboard-section-title">All Events</h3>
                <button type="button" className="admin-dashboard-add-btn" onClick={onAddEvent}>
                    + Add Event
                </button>
            </div>

            {eventsLoading ? (
                <div className="admin-dashboard-reg-loading">Loading events…</div>
            ) : events.length === 0 ? (
                <div className="admin-dashboard-reg-empty">No events found. Add one below!</div>
            ) : (
                <div className="admin-dashboard-events">
                    {events.map((event, index) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            index={index}
                            eventImage={eventImages[event.id]}
                            regCounts={regCounts}
                            onImageChange={onImageChange}
                            onEdit={onEditEvent}
                            onDelete={onDeleteEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default EventsTab;
