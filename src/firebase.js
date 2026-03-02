import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, increment, getDocs, query, where } from "firebase/firestore";

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

// Internal visitor tracking - optimized with retry logic
export const incrementVisitorCount = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const statsRef = doc(db, "metadata", "siteStats");
            await setDoc(statsRef, {
                total_visits: increment(1)
            }, { merge: true });
            break;
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