import { useEffect, useState } from 'react';
import {
    fetchRegistrationCounts,
    fetchRecentRegistrations,
} from '../services/registrationService.js';

/**
 * Custom hook that fetches registration counts and recent registrations
 * from Firebase on mount.
 *
 * @param {number} recentLimit — max recent registrations to fetch (default 5)
 * @returns {{ regCounts, recentRegistrations, regLoading }}
 */
export function useRegistrations(recentLimit = 5) {
    const [regCounts, setRegCounts] = useState(null);
    const [recentRegistrations, setRecentRegistrations] = useState([]);
    const [regLoading, setRegLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            setRegLoading(true);
            try {
                const [counts, recent] = await Promise.all([
                    fetchRegistrationCounts(),
                    fetchRecentRegistrations(recentLimit),
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
    }, [recentLimit]);

    return { regCounts, recentRegistrations, regLoading };
}
