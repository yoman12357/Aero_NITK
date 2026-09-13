// NOTE: I don't have your original registrationService.js, so this is a
// rebuild based on what useRegistrations.js and firebase.js expose. If your
// original file did anything extra (e.g. also merged in `applicants` from
// the recruitment page), let me know and I'll fold that back in.
//
// Adjust this import path if it doesn't match your actual folder depth —
// this assumes: src/components/Dashboard/services/registrationService.js
// and firebase.js at src/firebase.js.
import { getEventRegistrationCount, getRecentRegistrations } from '../../../firebase.js';

/**
 * Live registration count per event, keyed by registrationKey.
 * e.g. { workshop: 42, wrightFlight: 7, aeroModellingWorkshop2026: 3 }
 *
 * @param {string[]} registrationKeys — keys pulled from the events already
 *   loaded from Sanity (see useEvents). Events with no registrationKey
 *   ("none"/empty) should be filtered out before calling this.
 */
export async function fetchRegistrationCounts(registrationKeys = []) {
    const uniqueKeys = [...new Set(registrationKeys.filter(Boolean))];
    const entries = await Promise.all(
        uniqueKeys.map(async (key) => [key, await getEventRegistrationCount(key)])
    );
    return Object.fromEntries(entries);
}

/**
 * Most recent registrations across all given events, newest first,
 * capped at `limit` total.
 *
 * @param {string[]} registrationKeys
 * @param {number} limit
 */
export async function fetchRecentRegistrations(registrationKeys = [], limit = 5) {
    const uniqueKeys = [...new Set(registrationKeys.filter(Boolean))];

    // Pull up to `limit` from each collection, then merge + re-sort +
    // trim — cheaper than one big cross-collection query, which Firestore
    // doesn't support natively anyway.
    const perEventResults = await Promise.all(
        uniqueKeys.map((key) => getRecentRegistrations(key, limit))
    );

    const merged = perEventResults.flat();

    merged.sort((a, b) => {
        const aTime = a.submittedAt?.toMillis ? a.submittedAt.toMillis() : 0;
        const bTime = b.submittedAt?.toMillis ? b.submittedAt.toMillis() : 0;
        return bTime - aTime;
    });

    return merged.slice(0, limit);
}

/**
 * Formats a given timestamp into a human-readable relative time (e.g., "5m ago").
 * Safely handles Firebase Timestamps and standard JS Dates.
 *
 * @param {Object|Date|number} timestamp
 * @returns {string}
 */
export function formatRelativeTime(timestamp) {
    if (!timestamp) return 'Just now';

    // Safely parse Firebase Timestamps (which have a .toDate method) or fallback to standard Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (secondsPast < 60) return 'Just now';
    if (secondsPast < 3600) return `${Math.floor(secondsPast / 60)}m ago`;
    if (secondsPast < 86400) return `${Math.floor(secondsPast / 3600)}h ago`;
    if (secondsPast < 604800) return `${Math.floor(secondsPast / 86400)}d ago`;
    
    // Fallback to a standard date string for anything older than a week
    return date.toLocaleDateString();
}