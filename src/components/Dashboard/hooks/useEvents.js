import { useEffect, useState, useCallback } from 'react';
import { client as sanityClient, EVENTS_QUERY } from '../../../lib/sanity.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Reads event-card content from your backend's /api/events route
 * (which itself reads from Sanity via the CDN-backed read client),
 * with graceful fallback directly to Sanity if the backend is down.
 *
 * @returns {{
 *   events: Array,
 *   eventsLoading: boolean,
 *   refreshEvents: () => Promise<void>,
 * }}
 */
export function useEvents() {
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);

    const fetchEventsList = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/events`);
            const data = await res.json();
            if (data.success && Array.isArray(data.events)) {
                return data.events;
            }
        } catch {
            // Backend offline or unreachable, fallback to direct Sanity query
        }

        try {
            const data = await sanityClient.fetch(EVENTS_QUERY);
            return data || [];
        } catch (sanityErr) {
            console.error('Error fetching events from Sanity:', sanityErr);
            return [];
        }
    };

    const refreshEvents = useCallback(async () => {
        setEventsLoading(true);
        try {
            const list = await fetchEventsList();
            setEvents(list);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setEventsLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const list = await fetchEventsList();
                if (!cancelled) setEvents(list);
            } catch (error) {
                console.error('Error fetching events:', error);
                if (!cancelled) setEvents([]);
            } finally {
                if (!cancelled) setEventsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    return {
        events,
        eventsLoading,
        refreshEvents
    };
}