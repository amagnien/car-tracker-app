import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import firebaseService from '../services/firebase';

// Export the context so it can be imported directly
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = firebaseService.getAuth();

    useEffect(() => {
        if (!auth) return;
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    const value = {
        user,
        loading,
        register: async (email, password) => {
            if (!auth) throw new Error('Auth not initialized');
            try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                return user;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        login: async (email, password) => {
            if (!auth) throw new Error('Auth not initialized');
            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                return user;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        logout: async () => {
            if (!auth) throw new Error('Auth not initialized');
            try {
                await signOut(auth);
            } catch (error) {
                throw new Error(error.message);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 