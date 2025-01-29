// src/services/auth.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';
import {auth} from '../config/firebaseConfig';

export const createUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
    return await signOut(auth);
};

export const  getCurrentUser = async () => {
    return new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        unsubscribe();
        resolve(user);
      }, e => {
        console.log(e)
        resolve(null);
      });
    });
  }
