import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, updateProfile, updatePassword } from 'firebase/auth';

export const getUserSettings = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data().settings || getDefaultSettings();
        }
        return getDefaultSettings();
    } catch (error) {
        console.error('Error fetching user settings:', error);
        throw error;
    }
};

export const updateUserSettings = async (userId, settings) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            await updateDoc(userRef, { settings });
        } else {
            await setDoc(userRef, { settings });
        }
    } catch (error) {
        console.error('Error updating user settings:', error);
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error('No user logged in');

    try {
        await updateProfile(user, {
            displayName: profileData.displayName,
            photoURL: profileData.photoURL
        });

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            'profile.displayName': profileData.displayName,
            'profile.address': profileData.address,
            'profile.phone': profileData.phone
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const changeUserPassword = async (newPassword) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error('No user logged in');

    try {
        await updatePassword(user, newPassword);
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

export const getLatestFuelPrice = async (userId) => {
    try {
        const settings = await getUserSettings(userId);
        if (settings?.fuelPrices?.length > 0) {
            return settings.fuelPrices.reduce((latest, current) => {
                return new Date(current.date) > new Date(latest.date) ? current : latest;
            });
        }
        return null;
    } catch (error) {
        console.error('Error getting latest fuel price:', error);
        throw error;
    }
};

const getDefaultSettings = () => ({
    darkMode: false,
    currency: 'USD',
    fuelPrices: [],
    profile: {
        displayName: '',
        email: '',
        address: '',
        phone: ''
    }
}); 