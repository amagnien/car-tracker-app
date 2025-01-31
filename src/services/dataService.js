// src/services/dataService.js
import { collection, addDoc, doc, updateDoc, deleteDoc, query, onSnapshot, orderBy, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

class DataServiceError extends Error {
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

export const addCar = async (userId, carData) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        const carsCollection = collection(db, `users/${userId}/cars`);
        const docRef = await addDoc(carsCollection, {
            ...carData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        throw new DataServiceError('Failed to add car', 'ADD_CAR_FAILED');
    }
};

export const getUserCars = (userId, callback, errorCallback) => {
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
            errorCallback(new DataServiceError('Failed to set up cars listener', 'LISTENER_FAILED'));
        }
        return () => {};
    }
};

export const deleteCar = async (userId, carId) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        if (!carId) throw new DataServiceError('Car ID is required', 'CAR_REQUIRED');
        
        await deleteDoc(doc(db, `users/${userId}/cars`, carId));
        return carId;
    } catch (error) {
        throw new DataServiceError('Failed to delete car', 'DELETE_CAR_FAILED');
    }
};

export const updateCar = async (userId, carId, carData) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        if (!carId) throw new DataServiceError('Car ID is required', 'CAR_REQUIRED');
        
        const carRef = doc(db, `users/${userId}/cars`, carId);
        await updateDoc(carRef, {
            ...carData,
            updatedAt: serverTimestamp()
        });
        return carId;
    } catch (error) {
        throw new DataServiceError('Failed to update car', 'UPDATE_CAR_FAILED');
    }
};

// Fuel Records
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
            errorCallback(new DataServiceError('Failed to set up fuel records listener', 'LISTENER_FAILED'));
        }
        return () => {};
    }
};

export const addFuelRecord = async (userId, carId, fuelData) => {
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

export const updateFuelRecord = async (userId, carId, recordId, fuelData) => {
    try {
        if (!userId || !carId || !recordId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        const recordRef = doc(db, `users/${userId}/cars/${carId}/fuel`, recordId);
        await updateDoc(recordRef, {
            ...fuelData,
            date: new Date(fuelData.date),
            updatedAt: serverTimestamp()
        });
        return recordId;
    } catch (error) {
        throw new DataServiceError('Failed to update fuel record', 'UPDATE_FUEL_FAILED');
    }
};

export const deleteFuelRecord = async (userId, carId, recordId) => {
    try {
        if (!userId || !carId || !recordId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        await deleteDoc(doc(db, `users/${userId}/cars/${carId}/fuel`, recordId));
        return recordId;
    } catch (error) {
        throw new DataServiceError('Failed to delete fuel record', 'DELETE_FUEL_FAILED');
    }
};

// Maintenance Records
export const getMaintenanceRecords = (userId, carId, callback, errorCallback) => {
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
            errorCallback(new DataServiceError('Failed to set up maintenance records listener', 'LISTENER_FAILED'));
        }
        return () => {};
    }
};

export const addMaintenanceRecord = async (userId, carId, maintenanceData) => {
    try {
        if (!userId || !carId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        const maintenanceCollection = collection(db, `users/${userId}/cars/${carId}/maintenance`);
        const docRef = await addDoc(maintenanceCollection, {
            ...maintenanceData,
            date: new Date(maintenanceData.date),
            timestamp: serverTimestamp(),
            cost: Number(maintenanceData.cost || 0)
        });
        return docRef.id;
    } catch (error) {
        throw new DataServiceError('Failed to add maintenance record', 'ADD_MAINTENANCE_FAILED');
    }
};

export const updateMaintenanceRecord = async (userId, carId, recordId, maintenanceData) => {
    try {
        if (!userId || !carId || !recordId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        const recordRef = doc(db, `users/${userId}/cars/${carId}/maintenance`, recordId);
        await updateDoc(recordRef, {
            ...maintenanceData,
            date: new Date(maintenanceData.date),
            updatedAt: serverTimestamp()
        });
        return recordId;
    } catch (error) {
        throw new DataServiceError('Failed to update maintenance record', 'UPDATE_MAINTENANCE_FAILED');
    }
};

export const deleteMaintenanceRecord = async (userId, carId, recordId) => {
    try {
        if (!userId || !carId || !recordId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
        
        await deleteDoc(doc(db, `users/${userId}/cars/${carId}/maintenance`, recordId));
        return recordId;
    } catch (error) {
        throw new DataServiceError('Failed to delete maintenance record', 'DELETE_MAINTENANCE_FAILED');
    }
};

export const getRecentFuel = async (carId) => {
    try {
        const q = query(
            collection(db, 'fuel_records'),
            where('carId', '==', carId),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw new Error('Error fetching fuel records: ' + error.message);
    }
};

export const getRecentMaintenance = async (carId) => {
    try {
        const q = query(
            collection(db, 'maintenance_records'),
            where('carId', '==', carId),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw new Error('Error fetching maintenance records: ' + error.message);
    }
};

// --- Settings ---
export const updateUserSettings = async (userId, settings) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        
        const settingsRef = doc(db, `users/${userId}/settings/preferences`);
        await updateDoc(settingsRef, {
            ...settings,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        throw new DataServiceError('Failed to update settings', 'UPDATE_SETTINGS_FAILED');
    }
};

export const getUserSettings = async (userId) => {
    try {
        if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
        
        const settingsRef = doc(db, `users/${userId}/settings/preferences`);
        const snapshot = await getDocs(settingsRef);
        return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
        throw new DataServiceError('Failed to fetch settings', 'FETCH_SETTINGS_FAILED');
    }
};

// --- Real-time listeners ---
export const subscribeToUserCars = (userId, callback) => {
    if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
    
    const carsRef = collection(db, `users/${userId}/cars`);
    const q = query(carsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
        const cars = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(cars);
    });
};

export const subscribeToCarData = (userId, carId, callback) => {
    if (!userId || !carId) throw new DataServiceError('Missing required parameters', 'PARAMS_REQUIRED');
    
    const carRef = doc(db, `users/${userId}/cars`, carId);
    return onSnapshot(carRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() });
        }
    });
};
