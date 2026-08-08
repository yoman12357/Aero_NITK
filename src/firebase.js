import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, increment, getDocs, query, where, getCountFromServer } from "firebase/firestore";
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

// Check for duplicate workshop registration by rollNo, email, or phone
export const checkDuplicateRegistration = async ({ rollNo, email, phone }) => {
    try {
        const col = collection(db, 'workshop_registrations');
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
            console.error('Duplicate check error:', error);
        }
        // On error, let the submission through (fail open)
        return { duplicate: false };
    }
};

// Returns current number of workshop registrations (efficient — no document download)
export const getRegistrationCount = async () => {
    try {
        const col = collection(db, 'workshop_registrations');
        const snapshot = await getCountFromServer(col);
        return snapshot.data().count;
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error('Registration count error:', error);
        }
        return null; // null = unknown, don't block form
    }
};

// Check for duplicate Wright Flight registration by rollNo, email, or phone
export const checkDuplicateWrightFlightRegistration = async ({ rollNo, email, phone }) => {
    try {
        const col = collection(db, 'wright_flight_registrations');
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
            console.error('Wright Flight duplicate check error:', error);
        }
        return { duplicate: false };
    }
};

// Returns current number of Wright Flight registrations
export const getWrightFlightRegistrationCount = async () => {
    try {
        const col = collection(db, 'wright_flight_registrations');
        const snapshot = await getCountFromServer(col);
        return snapshot.data().count;
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error('Wright Flight registration count error:', error);
        }
        return null;
    }
};

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
export const checkDuplicateApplication = async ({ rollNo, email, phone }) => {
    try {
        const col = collection(db, 'applicants');
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
            console.error('Duplicate check error:', error);
        }
        // On error, let the submission through (fail open)
        return { duplicate: false };
    }
};

// Returns current number of recruitment applications (efficient — no document download)
export const getApplicationCount = async () => {
    try {
        const col = collection(db, 'applicants');
        const snapshot = await getCountFromServer(col);
        return snapshot.data().count;
    } catch (error) {
        if (import.meta.env.MODE === 'development') {
            console.error('Application count error:', error);
        }
        return null; // null = unknown, don't block form
    }
};
