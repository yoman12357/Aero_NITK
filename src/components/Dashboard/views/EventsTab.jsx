import React from 'react';
import EventCard from '../components/EventCard.jsx';

/**
 * Events tab — lists all events with add/edit/delete capabilities.
 *
 * @param {{
 *   events: Array,
 *   eventsLoading: boolean,
 *   regCounts: Object|null,
 *   onAddEvent: () => void,
 *   onManageEvent: (eventId: string) => void,
 * }} props
 */
function EventsTab({ events, eventsLoading, regCounts, onAddEvent, onManageEvent }) {
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
                            key={event._id}
                            event={event}
                            index={index}
                            regCounts={regCounts}
                            onManage={onManageEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default EventsTab;
