import { useEffect, useState } from 'react';
import { EVENTS_QUERY, isSanityConfigured, sanityClient } from '../../../lib/sanity.js';

/**
 * Reads event-card content from Sanity. Event authoring happens in the Studio so
 * the public dashboard never needs a Sanity write token.
 *
 * @returns {{
 *   events: Array,
 *   eventsLoading: boolean,
 * }}
 */
export function useEvents() {
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchEvents = async () => {
            setEventsLoading(true);
            if (!isSanityConfigured || !sanityClient) {
                console.warn('Sanity is not configured. Add VITE_SANITY_PROJECT_ID to display events.');
                if (!cancelled) setEvents([]);
                if (!cancelled) setEventsLoading(false);
                return;
            }

            try {
                const eventList = await sanityClient.fetch(EVENTS_QUERY);
                if (cancelled) return;
                setEvents(eventList);
            } catch (error) {
                console.error('Error fetching Sanity events:', error);
                if (!cancelled) setEvents([]);
            } finally {
                if (!cancelled) setEventsLoading(false);
            }
        };

        fetchEvents();

        return () => { cancelled = true; };
    }, []);

    return {
        events,
        eventsLoading,
    };
}
