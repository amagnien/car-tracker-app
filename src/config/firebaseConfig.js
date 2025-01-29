// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration provided by you
const firebaseConfig = {
  apiKey: "AIzaSyDRIcq9G3D6Kd6N-cDQnJtCDzVdxtWN_rQ",
  authDomain: "car-tracker-app-72e08.firebaseapp.com",
  projectId: "car-tracker-app-72e08",
  storageBucket: "car-tracker-app-72e08.firebasestorage.app",
  messagingSenderId: "1038472259925",
  appId: "1:1038472259925:web:d39c4b455c1d05fb7127dc",
  measurementId: "G-F2F74WDCQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
