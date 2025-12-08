import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAKU8ffQA8M9JjsFk3jJOX0Dn6ZbqZgHwE",
    authDomain: "datacomply-ng.firebaseapp.com",
    projectId: "datacomply-ng",
    storageBucket: "datacomply-ng.firebasestorage.app",
    messagingSenderId: "709160697564",
    appId: "1:709160697564:web:73b224e2985d5fafc93e19",
    measurementId: "G-6P3YME0E8M"
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
