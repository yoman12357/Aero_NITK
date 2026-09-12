import React from 'react';
import { FaPlus } from 'react-icons/fa';
import EventCard from '../components/EventCard.jsx';

/**
 * Events tab — lists all events as cards with an "Add Event" action.
 * Clicking a card's manage icon opens the same EventFormModal in edit mode.
 * Clicking delete removes the event after a confirmation prompt.
 *
 * @param {{
 *   events: Array,
 *   eventsLoading: boolean,
 *   regCounts: Object|null,
 *   onAddEvent: () => void,
 *   onManageEvent: (event: Object) => void,
 *   onDeleteEvent: (eventId: string) => void,
 * }} props
 */
function EventsTab({ events, eventsLoading, regCounts, onAddEvent, onManageEvent, onDeleteEvent }) {
    return (
        <div className="admin-dashboard-section admin-dashboard-events-section">
            <div className="admin-dashboard-section-header">
                <div>
                    <h3 className="admin-dashboard-section-title">Events & Registrations</h3>
                    <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                        Create and manage events shown on the public Registrations page.
                    </p>
                </div>
                <button type="button" className="admin-dashboard-add-btn" onClick={onAddEvent}>
                    <FaPlus style={{ marginRight: '6px' }} />
                    Add Event
                </button>
            </div>

            {eventsLoading ? (
                <div className="admin-dashboard-gallery-empty admin-dashboard-gallery-empty-inline">
                    Loading events...
                </div>
            ) : events.length === 0 ? (
                <div className="admin-dashboard-gallery-empty admin-dashboard-gallery-empty-inline">
                    No events created yet. Click "+ Add Event" to create your first one.
                </div>
            ) : (
                <div className="admin-dashboard-events-grid">
                    {events.map((event, index) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            index={index}
                            regCounts={regCounts}
                            onManage={onManageEvent}
                            onDelete={onDeleteEvent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default EventsTab;