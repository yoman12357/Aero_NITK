/**
 * registrationService.js
 *
 * Centralised Firebase read layer for the admin Dashboard.
 * Fetches registration data from the two existing Firestore collections
 * (workshop_registrations, wright_flight_registrations) and exposes
 * helpers the Dashboard can call on mount.
 *
 * Reuses the shared `db` instance from firebase.js — no duplicate config.
 */

import { db } from '../../../firebase.js';
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
} from 'firebase/firestore';

// ─── Collection metadata ───────────────────────────────────────────
// Maps internal keys to Firestore collection names and display labels.
export const REGISTRATION_COLLECTIONS = [
    {
        key: 'workshop',
        collection: 'workshop_registrations',
        label: 'Skyverse Workshop',
    },
    {
        key: 'wright_flight',
        collection: 'wright_flight_registrations',
        label: 'Wright Flight',
    },
];

// ─── fetchRegistrationCounts ───────────────────────────────────────
// Returns { workshop: number, wrightFlight: number, total: number }
// Uses getDocs + snap.size to count documents.
export const fetchRegistrationCounts = async () => {
    const counts = { workshop: 0, wrightFlight: 0, total: 0 };

    try {
        const [workshopSnap, wrightFlightSnap] = await Promise.all([
            getDocs(collection(db, 'workshop_registrations')),
            getDocs(collection(db, 'wright_flight_registrations')),
        ]);

        counts.workshop = workshopSnap.size;
        counts.wrightFlight = wrightFlightSnap.size;
        counts.total = counts.workshop + counts.wrightFlight;
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error('fetchRegistrationCounts error:', error);
        }
    }

    return counts;
};

// ─── fetchRecentRegistrations ──────────────────────────────────────
// Downloads the N most-recent docs from each collection, merges and
// sorts them, then returns the top `maxResults`.
// Falls back to an unordered query + client-side sort if the
// Firestore index for orderBy('submittedAt') does not exist yet.
export const fetchRecentRegistrations = async (maxResults = 5) => {
    try {
        const promises = REGISTRATION_COLLECTIONS.map(async (meta) => {
            let snap;
            try {
                // Preferred: server-side ordering (requires a Firestore index)
                const q = query(
                    collection(db, meta.collection),
                    orderBy('submittedAt', 'desc'),
                    limit(maxResults),
                );
                snap = await getDocs(q);
            } catch {
                // Fallback: fetch all docs, sort client-side
                snap = await getDocs(collection(db, meta.collection));
            }
            return snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                registrationType: meta.key,
                registrationLabel: meta.label,
            }));
        });

        const results = await Promise.all(promises);
        const merged = results.flat();

        // Sort by submittedAt descending (handle null/missing gracefully)
        merged.sort((a, b) => {
            const aTime = a.submittedAt?.toMillis?.() ?? 0;
            const bTime = b.submittedAt?.toMillis?.() ?? 0;
            return bTime - aTime;
        });

        return merged.slice(0, maxResults);
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error('fetchRecentRegistrations error:', error);
        }
        return [];
    }
};

// ─── fetchBranchBreakdown ──────────────────────────────────────────
// Downloads all docs to tally registrations by branch.
// Returns an object like { "Computer Science and Engineering": 14, ... }
export const fetchBranchBreakdown = async () => {
    const breakdown = {};

    try {
        const promises = REGISTRATION_COLLECTIONS.map(async (meta) => {
            const snap = await getDocs(collection(db, meta.collection));
            snap.docs.forEach((doc) => {
                const branch = doc.data().branch || 'Unknown';
                breakdown[branch] = (breakdown[branch] || 0) + 1;
            });
        });

        await Promise.all(promises);
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error('fetchBranchBreakdown error:', error);
        }
    }

    return breakdown;
};

// ─── Timestamp formatting helper ───────────────────────────────────
// Converts a Firestore Timestamp to a human-readable relative string.
export const formatRelativeTime = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return '—';

    const now = Date.now();
    const then = timestamp.toDate().getTime();
    const diffSeconds = Math.floor((now - then) / 1000);

    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) {
        const mins = Math.floor(diffSeconds / 60);
        return `${mins}m ago`;
    }
    if (diffSeconds < 86400) {
        const hrs = Math.floor(diffSeconds / 3600);
        return `${hrs}h ago`;
    }
    if (diffSeconds < 2592000) {
        const days = Math.floor(diffSeconds / 86400);
        return `${days}d ago`;
    }

    // Older than ~30 days → show a date
    return timestamp.toDate().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};
