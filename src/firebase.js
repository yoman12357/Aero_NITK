import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDQAAVGzCCLtDNOT2vGQA3iP5ww4K7iOxA",
    authDomain: "aeronitk-e0863.firebaseapp.com",
    projectId: "aeronitk-e0863",
    storageBucket: "aeronitk-e0863.firebasestorage.app",
    messagingSenderId: "676969086176",
    appId: "1:676969086176:web:32d0fa69ecc66f73a6a485",
    measurementId: "G-Y9NX05GYV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Helper function to save application data
export const saveApplicant = async (data) => {
    try {
        await addDoc(collection(db, "applicants"), {
            ...data,
            submittedAt: serverTimestamp(), // Records when they applied
        });
        return { success: true };
    } catch (error) {
        console.error("Error saving to Firebase:", error);
        return { success: false, error };
    }
};