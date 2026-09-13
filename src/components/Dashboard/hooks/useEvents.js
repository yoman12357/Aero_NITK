import { useEffect, useState, useCallback } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Reads event-card content from your backend's /api/events route
 * (which itself reads from Sanity via the CDN-backed read client).
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

    const refreshEvents = useCallback(async () => {
        setEventsLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/events`);
            const data = await res.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch events');
            }
            setEvents(data.events || []);
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
                const res = await fetch(`${BACKEND_URL}/api/events`);
                const data = await res.json();
                if (cancelled) return;
                if (!data.success) {
                    throw new Error(data.error || 'Failed to fetch events');
                }
                setEvents(data.events || []);
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