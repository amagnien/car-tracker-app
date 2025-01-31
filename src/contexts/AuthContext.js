import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Export the context so it can be imported directly
export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only subscribe once when component mounts
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        register: async (email, password) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                setUser(userCredential.user);
                return userCredential.user;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        login: async (email, password) => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                setUser(userCredential.user);
                return userCredential.user;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        logout: async () => {
            try {
                await signOut(auth);
                setUser(null);
            } catch (error) {
                throw new Error(error.message);
            }
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}; 