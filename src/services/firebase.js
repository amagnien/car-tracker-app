import { getApps, initializeApp, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let firebaseApp;
let auth;
let db;

class FirebaseService {
    constructor() {
        if (!firebaseApp) {
            const firebaseConfig = {
                apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
                authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
                storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.REACT_APP_FIREBASE_APP_ID,
                measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
            };

            try {
                firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
                auth = getAuth(firebaseApp);
                db = getFirestore(firebaseApp);
            } catch (error) {
                console.error('Firebase initialization error:', error);
            }
        }
    }

    getAuth() {
        return auth;
    }

    getDb() {
        return db;
    }

    getApp() {
        return firebaseApp;
    }
}

// Create a singleton instance
const firebaseService = new FirebaseService();
Object.freeze(firebaseService);

export default firebaseService; 