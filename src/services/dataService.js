import { 
    collection, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    onSnapshot, 
    orderBy, 
    serverTimestamp, 
    where, 
    getDocs, 
    getDoc, 
    setDoc 
} from 'firebase/firestore';
import { db } from '../firebase';

export class DataServiceError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

// --- Expense ---

export const addExpense = async (userId, carId, expenseData) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        if (!carId) throw new DataServiceError('Car ID is required', 'CAR_REQUIRED');
        
        const expenseCollection = collection(db, `users/${userId}/cars/${carId}/expenses`);
        const docRef = await addDoc(expenseCollection, {
            ...expenseData,
            date: new Date(expenseData.date),
            timestamp: serverTimestamp(),
            amount: Number(expenseData.amount)
        });
        return docRef.id;
    } catch (error) {
        throw new DataServiceError('Failed to add expense', 'ADD_EXPENSE_FAILED');
    }
};

export const getExpenses = (userId, carId, callback, errorCallback) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        if (!carId) throw new DataServiceError('Car ID is required', 'CAR_REQUIRED');
        
        const expenseCollection = collection(db, `users/${userId}/cars/${carId}/expenses`);
        const q = query(expenseCollection, orderBy('date', 'desc'));
        
        return onSnapshot(q, 
            (querySnapshot) => {
                const expenseList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(expenseList);
            },
            (error) => {
                if (errorCallback) {
                    errorCallback(new DataServiceError('Failed to fetch expenses', 'FETCH_EXPENSES_FAILED'));
                }
            }
        );
    } catch (error) {
        if (errorCallback) {
            errorCallback(new DataServiceError('Failed to set up expenses listener', 'LISTENER_FAILED'));
        }
        return () => {};
    }
};

export const deleteExpense = async (userId, carId, expenseId) => {
    try {
        if (!userId || !carId || !expenseId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        const expenseRef = doc(db, `users/${userId}/cars/${carId}/expenses`, expenseId);
        await deleteDoc(expenseRef);
        return expenseId;
    } catch (error) {
        throw new DataServiceError('Failed to delete expense', 'DELETE_EXPENSE_FAILED');
    }
};

export const updateExpense = async (userId, carId, expenseId, updatedData) => {
    try {
        if (!userId || !carId || !expenseId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        const expenseRef = doc(db, `users/${userId}/cars/${carId}/expenses`, expenseId);
        await updateDoc(expenseRef, {
            ...updatedData,
            updatedAt: serverTimestamp()
        });
        return expenseId;
    } catch (error) {
        throw new DataServiceError('Failed to update expense', 'UPDATE_EXPENSE_FAILED');
    }
};

// --- Maintenance ---

export const addMaintenance = async (userId, carId, maintenanceData) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        if (!carId) throw new DataServiceError('Car ID is required', 'CAR_REQUIRED');
        
        const maintenanceCollection = collection(db, `users/${userId}/cars/${carId}/maintenance`);
        const docRef = await addDoc(maintenanceCollection, {
            ...maintenanceData,
            date: new Date(maintenanceData.date),
            timestamp: serverTimestamp(),
            totalCost: Number(maintenanceData.totalCost),
            mileage: Number(maintenanceData.mileage)
        });
        return docRef.id;
    } catch (error) {
        throw new DataServiceError('Failed to add maintenance record', 'ADD_MAINTENANCE_FAILED');
    }
};

export const getMaintenance = (userId, carId, callback, errorCallback) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        if (!carId) throw new DataServiceError('Car ID is required', 'CAR_REQUIRED');
        
        const maintenanceCollection = collection(db, `users/${userId}/cars/${carId}/maintenance`);
        const q = query(maintenanceCollection, orderBy('date', 'desc'));
        
        return onSnapshot(q, 
            (querySnapshot) => {
                const maintenanceList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(maintenanceList);
            },
            (error) => {
                if (errorCallback) {
                    errorCallback(new DataServiceError('Failed to fetch maintenance records', 'FETCH_MAINTENANCE_FAILED'));
                }
            }
        );
    } catch (error) {
        if (errorCallback) {
            errorCallback(new DataServiceError('Failed to set up maintenance listener', 'LISTENER_FAILED'));
        }
        return () => {};
    }
};

export const deleteMaintenance = async (userId, carId, maintenanceId) => {
    try {
        if (!userId || !carId || !maintenanceId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        const maintenanceRef = doc(db, `users/${userId}/cars/${carId}/maintenance`, maintenanceId);
        await deleteDoc(maintenanceRef);
        return maintenanceId;
    } catch (error) {
        throw new DataServiceError('Failed to delete maintenance record', 'DELETE_MAINTENANCE_FAILED');
    }
};

export const updateMaintenance = async (userId, carId, maintenanceId, updatedData) => {
    try {
        if (!userId || !carId || !maintenanceId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        const maintenanceRef = doc(db, `users/${userId}/cars/${carId}/maintenance`, maintenanceId);
        await updateDoc(maintenanceRef, {
            ...updatedData,
            updatedAt: serverTimestamp()
        });
        return maintenanceId;
    } catch (error) {
        throw new DataServiceError('Failed to update maintenance record', 'UPDATE_MAINTENANCE_FAILED');
    }
};

export const addMaintenanceRecord = async (userId, carId, maintenanceData) => {
    try {
        const maintenanceRef = collection(db, 'users', userId, 'cars', carId, 'maintenance');
        await addDoc(maintenanceRef, maintenanceData);
    } catch (error) {
        console.error('Error adding maintenance record:', error);
        throw error;
    }
};

// --- Fuel ---

export const addFuel = async (userId, carId, fuelData) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        if (!carId) throw new DataServiceError('Car ID is required', 'CAR_REQUIRED');
        
        const fuelCollection = collection(db, `users/${userId}/cars/${carId}/fuel`);
        const docRef = await addDoc(fuelCollection, {
            ...fuelData,
            date: new Date(fuelData.date),
            timestamp: serverTimestamp(),
            liters: Number(fuelData.liters),
            pricePerLiter: Number(fuelData.pricePerLiter),
            totalCost: Number(fuelData.totalCost),
            mileage: Number(fuelData.mileage)
        });
        
        // Update car's current mileage
        await updateCar(userId, carId, {
            currentMileage: fuelData.mileage
        });
        
        return docRef.id;
    } catch (error) {
        throw new DataServiceError('Failed to add fuel record', 'ADD_FUEL_FAILED');
    }
};

export const getFuel = (userId, carId, callback, errorCallback) => {
    return fetchCollection(userId, carId, 'fuel', callback, errorCallback);
};

export const deleteFuel = async (userId, carId, fuelId) => {
    try {
        const fuelRef = doc(db, 'users', userId, 'cars', carId, 'fuel', fuelId);
        await deleteDoc(fuelRef);
    } catch (error) {
        console.error('Error deleting fuel record:', error);
        throw error;
    }
};

export const getUserCars = async (userId) => {
    try {
        const carsRef = collection(db, 'users', userId, 'cars');
        const snapshot = await getDocs(carsRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching user cars:', error);
        throw error;
    }
};

export const getCars = async (userId) => {
    try {
        const carsRef = collection(db, 'users', userId, 'cars');
        const snapshot = await getDocs(carsRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching cars:', error);
        throw error;
    }
};

export const getFuelRecords = (userId, carId, callback, errorCallback) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        if (!carId) throw new DataServiceError('Car ID is required', 'CAR_REQUIRED');
        
        const fuelCollection = collection(db, `users/${userId}/cars/${carId}/fuel`);
        const q = query(fuelCollection, orderBy('date', 'desc'));
        
        return onSnapshot(q, 
            (querySnapshot) => {
                const fuelList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(fuelList);
            },
            (error) => {
                if (errorCallback) {
                    errorCallback(new DataServiceError('Failed to fetch fuel records', 'FETCH_FUEL_FAILED'));
                }
            }
        );
    } catch (error) {
        if (errorCallback) {
            errorCallback(new DataServiceError('Failed to set up fuel listener', 'LISTENER_FAILED'));
        }
        return () => {};
    }
};

export const deleteFuelRecord = async (userId, carId, fuelId) => {
    try {
        if (!userId || !carId || !fuelId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        const fuelRef = doc(db, 'users', userId, 'cars', carId, 'fuel', fuelId);
        await deleteDoc(fuelRef);
    } catch (error) {
        throw new DataServiceError('Failed to delete fuel record', 'DELETE_FUEL_FAILED');
    }
};

export const getUserSettings = async (userId) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        
        const settingsRef = doc(db, 'users', userId, 'settings', 'userSettings');
        const snapshot = await getDoc(settingsRef);
        
        if (snapshot.exists()) {
            return snapshot.data();
        } else {
            throw new DataServiceError('User settings not found', 'SETTINGS_NOT_FOUND');
        }
    } catch (error) {
        throw new DataServiceError('Failed to fetch user settings', 'FETCH_SETTINGS_FAILED');
    }
};

export const updateCar = async (userId, carId, updatedData) => {
    try {
        if (!userId || !carId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        const carRef = doc(db, `users/${userId}/cars`, carId);
        await updateDoc(carRef, updatedData);
    } catch (error) {
        throw new DataServiceError('Failed to update car', 'UPDATE_CAR_FAILED');
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