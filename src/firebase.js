import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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

export const saveToCollection = async (collectionName, data) => {
    try {
        await addDoc(collection(db, collectionName), {
            ...data,
            submittedAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error(`Error saving to ${collectionName}:`, error);
        return { success: false, error };
    }
};

// Compatibility for recruitment page
export const saveApplicant = (data) => saveToCollection("applicants", data);