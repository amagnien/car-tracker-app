import { getApps, initializeApp, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

class FirebaseService {
    static instance = null;
    
    constructor() {
        if (FirebaseService.instance) {
            return FirebaseService.instance;
        }

        const firebaseConfig = {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID,
            measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
        };

        // Initialize Firebase
        this.app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);

        FirebaseService.instance = this;
    }

    getAuth() {
        return this.auth;
    }

    getDb() {
        return this.db;
    }

    getApp() {
        return this.app;
    }
}

// Create and freeze the singleton instance
const firebaseService = new FirebaseService();
Object.freeze(firebaseService);

export default firebaseService; 