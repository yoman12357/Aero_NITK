import { useEffect, useState } from 'react';
import {
    fetchRegistrationCounts,
    fetchRecentRegistrations,
} from '../services/registrationService.js';

/**
 * Custom hook that fetches registration counts and recent registrations
 * from Firebase on mount, and whenever the set of events changes.
 *
 * @param {Array} events — events from useEvents(); each event's
 *   `registrationKey` (when present and not "none") determines which
 *   Firestore collection to read. New events need no code changes here —
 *   they just need a registrationKey set in the dashboard.
 * @param {number} recentLimit — max recent registrations to fetch (default 5)
 * @returns {{ regCounts, recentRegistrations, regLoading }}
 */
export function useRegistrations(events = [], recentLimit = 5) {
    const [regCounts, setRegCounts] = useState(null);
    const [recentRegistrations, setRecentRegistrations] = useState([]);
    const [regLoading, setRegLoading] = useState(true);

    // Derive a stable, deduped list of registration keys from the events
    // list so the effect doesn't refire on every unrelated events re-render.
    const registrationKeys = [...new Set(
        events
            .map((e) => e.registrationKey)
            .filter((key) => key && key !== 'none')
    )].sort().join(',');

    useEffect(() => {
        if (!registrationKeys) {
            setRegCounts({});
            setRecentRegistrations([]);
            setRegLoading(false);
            return;
        }

        let cancelled = false;
        const keys = registrationKeys.split(',');

        const fetchData = async () => {
            setRegLoading(true);
            try {
                const [counts, recent] = await Promise.all([
                    fetchRegistrationCounts(keys),
                    fetchRecentRegistrations(keys, recentLimit),
                ]);
                if (cancelled) return;
                setRegCounts(counts);
                setRecentRegistrations(recent);
            } catch (error) {
                console.error('Error fetching registration data:', error);
            } finally {
                if (!cancelled) setRegLoading(false);
            }
        };

        fetchData();

        return () => { cancelled = true; };
    }, [registrationKeys, recentLimit]);

    return { regCounts, recentRegistrations, regLoading };
}
