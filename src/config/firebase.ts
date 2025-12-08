import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDF0ZwmuwOxZcq6yi8Z6AZ6xphkN9fxXLk",
    authDomain: "bizcomplyng.firebaseapp.com",
    projectId: "bizcomplyng",
    storageBucket: "bizcomplyng.firebasestorage.app",
    messagingSenderId: "697778267096",
    appId: "1:697778267096:web:4d7395bb7534526330c8ad",
    measurementId: "G-NLFLLJ3N3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Initialize Firestore with settings for better stability and offline support
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    }),
    experimentalForceLongPolling: true, // Helps with firewalls/proxies and "offline" errors
});

export const storage = getStorage(app);

export default app;
