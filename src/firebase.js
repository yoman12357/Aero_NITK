import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, increment, getDocs, query, where, orderBy, limit as fsLimit, getCountFromServer } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();
export { collection, addDoc, serverTimestamp };

// Optimized save to collection with better error handling
export const saveToCollection = async (collectionName, data) => {
    try {
        await addDoc(collection(db, collectionName), {
            ...data,
            submittedAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error(`Error saving to ${collectionName}:`, error);
        }
        return { success: false, error };
    }
};

// Generic duplicate check by rollNo/email/phone against any collection
const checkDuplicateInCollection = async (collectionName, { rollNo, email, phone }) => {
    try {
        const col = collection(db, collectionName);
        const checks = [
            { field: 'rollNo', value: rollNo, label: 'Roll Number' },
            { field: 'email', value: email, label: 'Email ID' },
            { field: 'phone', value: phone, label: 'Phone Number' },
        ];

        for (const { field, value, label } of checks) {
            if (!value) continue;
            const snap = await getDocs(query(col, where(field, '==', value)));
            if (!snap.empty) {
                return { duplicate: true, field: label };
            }
        }
        return { duplicate: false };
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error(`Duplicate check error (${collectionName}):`, error);
        }
        // On error, let the submission through (fail open)
        return { duplicate: false };
    }
};

// Generic registration count for any collection
const getCollectionCount = async (collectionName) => {
    try {
        const col = collection(db, collectionName);
        const snapshot = await getCountFromServer(col);
        return snapshot.data().count;
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error(`Count error (${collectionName}):`, error);
        }
        return null; // null = unknown, don't block form
    }
};

// ---------------------------------------------------------------------------
// Generic, per-event registrations
// ---------------------------------------------------------------------------
// Every Sanity event has a `registrationKey` (e.g. "workshop", "aeroModelling2026").
// New events automatically get their own Firestore collection named
// `${registrationKey}_registrations` — no new code needed per event.
//
// A couple of collections predate this convention and use a different name;
// list them here so old data keeps being written to the same place.
const LEGACY_COLLECTION_OVERRIDES = {
    wrightFlight: 'wright_flight_registrations',
};

const collectionForEvent = (registrationKey) => {
    if (!registrationKey) {
        throw new Error('registrationKey is required to resolve a Firestore collection');
    }
    return LEGACY_COLLECTION_OVERRIDES[registrationKey] || `${registrationKey}_registrations`;
};

// Save a registration document for a given event.
// data fields become the 3rd-level "fields" shown in the Firestore console
// (name, email, rollNo, phone, branch, year, ...).
export const saveEventRegistration = (registrationKey, data) =>
    saveToCollection(collectionForEvent(registrationKey), data);

export const checkDuplicateEventRegistration = (registrationKey, { rollNo, email, phone }) =>
    checkDuplicateInCollection(collectionForEvent(registrationKey), { rollNo, email, phone });

export const getEventRegistrationCount = (registrationKey) =>
    getCollectionCount(collectionForEvent(registrationKey));

// Most recent N registration documents for one event, newest first.
// Used to build a merged "recent registrations" feed across all events.
export const getRecentRegistrations = async (registrationKey, count = 5) => {
    try {
        const col = collection(db, collectionForEvent(registrationKey));
        const snap = await getDocs(query(col, orderBy('submittedAt', 'desc'), fsLimit(count)));
        return snap.docs.map((d) => {
            const data = d.data();
            return {
                id: d.id,
                registrationKey,
                // registrationType/registrationLabel feed the admin dashboard's
                // Event column + badge styling (RegistrationsTab.jsx).
                // eventTitle is saved on the doc at submission time by
                // EventRegistrationForm.jsx — falls back to the raw key
                // for any pre-existing docs that predate that field.
                registrationType: registrationKey,
                registrationLabel: data.eventTitle || registrationKey,
                ...data
            };
        });
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error(`Recent registrations error (${registrationKey}):`, error);
        }
        return [];
    }
};

// ---------------------------------------------------------------------------
// Legacy wrappers (kept so existing workshop / Wright Flight components,
// if still imported anywhere, keep working unchanged)
// ---------------------------------------------------------------------------
export const checkDuplicateRegistration = (args) => checkDuplicateEventRegistration('workshop', args);
export const getRegistrationCount = () => getEventRegistrationCount('workshop');
export const checkDuplicateWrightFlightRegistration = (args) => checkDuplicateEventRegistration('wrightFlight', args);
export const getWrightFlightRegistrationCount = () => getEventRegistrationCount('wrightFlight');

// Internal visitor tracking — writes to:
//   metadata/siteStats         → total_visits (all-time counter)
//   daily_visits/YYYY-MM-DD    → count        (per-day counter, IST)
export const incrementVisitorCount = async (retries = 3) => {
    // Get today's date in IST (UTC+5:30) as YYYY-MM-DD
    const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const dateKey = nowIST.toISOString().slice(0, 10); // e.g. "2026-03-03"

    for (let i = 0; i < retries; i++) {
        try {
            // 1. Increment global all-time counter
            const statsRef = doc(db, "metadata", "siteStats");
            await setDoc(statsRef, {
                total_visits: increment(1)
            }, { merge: true });

            // 2. Increment today's daily counter
            const dailyRef = doc(db, "daily_visits", dateKey);
            await setDoc(dailyRef, {
                date: dateKey,
                count: increment(1)
            }, { merge: true });

            break; // success — stop retrying
        } catch (error) {
            if (i === retries - 1 && import.meta.env.MODE === 'development') {
                console.error("Error updating visitor stats:", error);
            }
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
            }
        }
    }
};


// Compatibility for recruitment page
export const saveApplicant = (data) => saveToCollection("applicants", data);

// Check for duplicate recruitment application by rollNo, email, or phone
export const checkDuplicateApplication = (args) => checkDuplicateInCollection('applicants', args);

// Returns current number of recruitment applications (efficient — no document download)
export const getApplicationCount = () => getCollectionCount('applicants');
