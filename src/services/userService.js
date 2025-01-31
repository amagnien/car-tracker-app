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