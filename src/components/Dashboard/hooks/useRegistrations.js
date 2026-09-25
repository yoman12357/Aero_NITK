import { useEffect, useState } from 'react';
import {
    fetchRegistrationCounts,
} from '../services/registrationService.js';

/**
 * Fetches registration counts on mount and whenever the events change.
 * Full documents (including screenshots) are intentionally fetched only
 * after an admin opens a specific event in the Registrations tab.
 *
 * @param {Array} events — events from useEvents(); each event's
 *   `registrationKey` (when present and not "none") determines which
 *   Firestore collection to read. New events need no code changes here —
 *   they just need a registrationKey set in the dashboard.
 * @returns {{ regCounts, regLoading }}
 */
export function useRegistrations(events = []) {
    const [regCounts, setRegCounts] = useState(null);
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
            setRegLoading(false);
            return;
        }

        let cancelled = false;
        const keys = registrationKeys.split(',');

        const fetchData = async () => {
            setRegLoading(true);
            try {
                const counts = await fetchRegistrationCounts(keys);
                if (cancelled) return;
                setRegCounts(counts);
            } catch (error) {
                console.error('Error fetching registration data:', error);
            } finally {
                if (!cancelled) setRegLoading(false);
            }
        };

        fetchData();

        return () => { cancelled = true; };
    }, [registrationKeys]);

    return { regCounts, regLoading };
}
