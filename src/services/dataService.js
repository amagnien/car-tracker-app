// src/services/dataService.js
import { collection, addDoc, doc, updateDoc, deleteDoc, query, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

class DataServiceError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

// --- Expense ---

export const addExpense = async (data, userId) => {
    if (!userId || !data.carId) {
        throw new Error('Missing required parameters');
    }

    try {
        const expenseRef = collection(db, 'users', userId, 'cars', data.carId, 'expenses');
        const docData = {
            ...data,
            date: new Date(data.date),
            timestamp: serverTimestamp(),
            amount: Number(data.amount)
        };

        const docRef = await addDoc(expenseRef, docData);
        return docRef.id;
    } catch (error) {
        console.error('Error adding expense:', error);
        throw new Error('Failed to add expense');
    }
};

export const getExpenses = (userId, carId, onSuccess, onError) => {
    if (!userId || !carId) {
        if (onError) onError(new Error('Missing required parameters'));
        return () => {};
    }

    try {
        const expensesRef = collection(db, 'users', userId, 'cars', carId, 'expenses');
        const q = query(expensesRef, orderBy('date', 'desc'));

        return onSnapshot(q,
            (snapshot) => {
                const records = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate?.() || doc.data().date
                }));
                if (onSuccess && typeof onSuccess === 'function') {
                    onSuccess(records);
                }
            },
            (error) => {
                console.error('Error fetching expenses:', error);
                if (onError && typeof onError === 'function') {
                    onError(error);
                }
            }
        );
    } catch (error) {
        console.error('Error setting up expenses listener:', error);
        if (onError && typeof onError === 'function') {
            onError(error);
        }
        return () => {};
    }
};

export const deleteExpense = async (userId, expenseId) => {
    try {
        const expenseDoc = doc(db, `users/${userId}/expenses`, expenseId);
        await deleteDoc(expenseDoc);
    } catch (e) {
        console.log(e);
    }
};

export const updateExpense = async (userId, expenseId, updatedData) => {
    try {
        const expenseDoc = doc(db, `users/${userId}/expenses`, expenseId);
        await updateDoc(expenseDoc, updatedData);
    } catch (e) {
        console.log(e);
    }
};

// --- Maintenance ---

export const addMaintenance = async (data, userId) => {
    if (!userId || !data.carId) {
        throw new Error('Missing required parameters');
    }

    try {
        const maintenanceRef = collection(db, 'users', userId, 'cars', data.carId, 'maintenance');
        const docData = {
            ...data,
            date: new Date(data.date),
            timestamp: serverTimestamp(),
            totalCost: Number(data.totalCost),
            mileage: Number(data.mileage)
        };

        const docRef = await addDoc(maintenanceRef, docData);
        return docRef.id;
    } catch (error) {
        console.error('Error adding maintenance record:', error);
        throw new Error('Failed to add maintenance record');
    }
};

export const getMaintenance = (userId, carId, onSuccess, onError) => {
    if (!userId || !carId) {
        if (onError) onError(new Error('Missing required parameters'));
        return () => {};
    }

    try {
        const maintenanceRef = collection(db, 'users', userId, 'cars', carId, 'maintenance');
        const q = query(maintenanceRef, orderBy('date', 'desc'));

        return onSnapshot(q,
            (snapshot) => {
                const records = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate?.() || doc.data().date
                }));
                if (onSuccess && typeof onSuccess === 'function') {
                    onSuccess(records);
                }
            },
            (error) => {
                console.error('Error fetching maintenance records:', error);
                if (onError && typeof onError === 'function') {
                    onError(error);
                }
            }
        );
    } catch (error) {
        console.error('Error setting up maintenance records listener:', error);
        if (onError && typeof onError === 'function') {
            onError(error);
        }
        return () => {};
    }
};

export const deleteMaintenance = async (userId, maintenanceId) => {
    try {
        const maintenanceDoc = doc(db, `users/${userId}/maintenance`, maintenanceId);
        await deleteDoc(maintenanceDoc);
    } catch (e) {
        console.log(e);
    }
};

export const updateMaintenance = async (userId, maintenanceId, updatedData) => {
    try {
        const maintenanceDoc = doc(db, `users/${userId}/maintenance`, maintenanceId);
        await updateDoc(maintenanceDoc, updatedData);
    } catch (e) {
        console.log(e);
    }
};

// --- Fuel ---

export const addFuel = async (fuelData, userId) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        if (!fuelData.carId) throw new DataServiceError('Car ID is required', 'CAR_REQUIRED');
        
        const fuelCollection = collection(db, `users/${userId}/cars/${fuelData.carId}/fuel`);
        const docRef = await addDoc(fuelCollection, {
            ...fuelData,
            createdAt: new Date().toISOString()
        });
        
        // Update car's current mileage
        const carRef = doc(db, `users/${userId}/cars`, fuelData.carId);
        await updateDoc(carRef, {
            currentMileage: fuelData.mileage,
            updatedAt: new Date().toISOString()
        });
        
        return docRef.id;
    } catch (error) {
        throw new DataServiceError('Failed to add fuel record', 'ADD_FUEL_FAILED');
    }
};

export const getFuel = (userId, carId, callback, errorCallback) => {
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
            errorCallback(error instanceof DataServiceError ? error : new DataServiceError('Failed to set up fuel listener', 'FUEL_LISTENER_FAILED'));
        }
        return () => {};
    }
};

export const deleteFuel = async (userId, carId, fuelId) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        if (!carId) throw new DataServiceError('Car ID is required', 'CAR_REQUIRED');
        
        const fuelRef = doc(db, `users/${userId}/cars/${carId}/fuel`, fuelId);
        await deleteDoc(fuelRef);
    } catch (error) {
        throw new DataServiceError('Failed to delete fuel record', 'DELETE_FUEL_FAILED');
    }
};

// --- Car ---

export const addCar = async (carData, userId) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        const carsCollection = collection(db, `users/${userId}/cars`);
        const docRef = await addDoc(carsCollection, {
            ...carData,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        throw new DataServiceError('Failed to add car', 'ADD_CAR_FAILED');
    }
};

export const getCars = (userId, callback, errorCallback) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        const carsCollection = collection(db, `users/${userId}/cars`);
        const q = query(carsCollection, orderBy('createdAt', 'desc'));
        
        return onSnapshot(q, 
            (querySnapshot) => {
                const carsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(carsList);
            },
            (error) => {
                if (errorCallback) {
                    errorCallback(new DataServiceError('Failed to fetch cars', 'FETCH_CARS_FAILED'));
                }
            }
        );
    } catch (error) {
        if (errorCallback) {
            errorCallback(error instanceof DataServiceError ? error : new DataServiceError('Failed to set up cars listener', 'CARS_LISTENER_FAILED'));
        }
        return () => {};
    }
};

export const deleteCar = async (userId, carId) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        const carRef = doc(db, `users/${userId}/cars`, carId);
        await deleteDoc(carRef);
    } catch (error) {
        throw new DataServiceError('Failed to delete car', 'DELETE_CAR_FAILED');
    }
};

export const updateCar = async (userId, carId, carData) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        const carRef = doc(db, `users/${userId}/cars`, carId);
        await updateDoc(carRef, {
            ...carData,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        throw new DataServiceError('Failed to update car', 'UPDATE_CAR_FAILED');
    }
};

// Fuel Records
export const getFuelRecords = (userId, carId, onSuccess, onError) => {
    try {
        const fuelRef = collection(db, 'users', userId, 'cars', carId, 'fuelRecords');
        const q = query(fuelRef, orderBy('date', 'desc'));

        return onSnapshot(q, 
            (snapshot) => {
                const records = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate?.() || doc.data().date
                }));
                onSuccess(records);
            },
            (error) => {
                console.error('Error fetching fuel records:', error);
                if (onError) onError(error);
            }
        );
    } catch (error) {
        console.error('Error setting up fuel records listener:', error);
        if (onError) onError(error);
        return () => {};
    }
};

export const addFuelRecord = async (data, userId) => {
    try {
        const fuelRef = collection(db, 'users', userId, 'cars', data.carId, 'fuelRecords');
        const docRef = await addDoc(fuelRef, {
            ...data,
            date: new Date(data.date),
            timestamp: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding fuel record:', error);
        throw error;
    }
};

export const deleteFuelRecord = async (userId, carId, recordId) => {
    try {
        const recordRef = doc(db, 'users', userId, 'cars', carId, 'fuelRecords', recordId);
        await deleteDoc(recordRef);
    } catch (error) {
        console.error('Error deleting fuel record:', error);
        throw error;
    }
};

// Maintenance Records
export const getMaintenanceRecords = (userId, carId, onSuccess, onError) => {
    try {
        const maintenanceRef = collection(db, 'users', userId, 'cars', carId, 'maintenance');
        const q = query(maintenanceRef, orderBy('date', 'desc'));

        return onSnapshot(q,
            (snapshot) => {
                const records = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate?.() || doc.data().date
                }));
                onSuccess(records);
            },
            (error) => {
                console.error('Error fetching maintenance records:', error);
                if (onError) onError(error);
            }
        );
    } catch (error) {
        console.error('Error setting up maintenance records listener:', error);
        if (onError) onError(error);
        return () => {};
    }
};

export const addMaintenanceRecord = async (data, userId) => {
    try {
        const maintenanceRef = collection(db, 'users', userId, 'cars', data.carId, 'maintenance');
        const docRef = await addDoc(maintenanceRef, {
            ...data,
            date: new Date(data.date),
            timestamp: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding maintenance record:', error);
        throw error;
    }
};

export const deleteMaintenanceRecord = async (userId, carId, recordId) => {
    try {
        const recordRef = doc(db, 'users', userId, 'cars', carId, 'maintenance', recordId);
        await deleteDoc(recordRef);
    } catch (error) {
        console.error('Error deleting maintenance record:', error);
        throw error;
    }
};
