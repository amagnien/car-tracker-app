// src/services/dataService.js
import { collection, addDoc, doc, updateDoc, deleteDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

class DataServiceError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

// --- Expense ---

export const addExpense = async (expenseData, userId) => {
    try {
        const expensesCollection = collection(db, `users/${userId}/expenses`);
        await addDoc(expensesCollection, expenseData);
    } catch (e) {
        console.log(e);
    }
};

export const getExpenses = async (userId, callback) => {
    try {
        const expensesCollection = collection(db, `users/${userId}/expenses`);
        const unsubscribe = onSnapshot(query(expensesCollection), (querySnapshot) => {
            const expenses = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            callback(expenses);
        });
        return unsubscribe;
    } catch (e) {
        console.log(e);
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

export const addMaintenance = async (maintenanceData, userId) => {
  try {
    if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');
    if (!maintenanceData) throw new DataServiceError('Maintenance data is required', 'INVALID_DATA');

    const maintenanceCollection = collection(db, `users/${userId}/maintenance`);
    const docRef = await addDoc(maintenanceCollection, {
      ...maintenanceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    if (error instanceof DataServiceError) throw error;
    throw new DataServiceError(
      'Failed to add maintenance record',
      'ADD_MAINTENANCE_FAILED'
    );
  }
};

export const getMaintenance = (userId, callback, errorCallback) => {
  try {
    if (!userId) throw new DataServiceError('User not authenticated', 'AUTH_REQUIRED');

    const maintenanceCollection = collection(db, `users/${userId}/maintenance`);
    const q = query(maintenanceCollection);
    
    return onSnapshot(q, 
      (querySnapshot) => {
        const maintenanceList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        callback(maintenanceList);
      },
      (error) => {
        if (errorCallback) {
          errorCallback(new DataServiceError(
            'Failed to fetch maintenance records',
            'FETCH_MAINTENANCE_FAILED'
          ));
        }
      }
    );
  } catch (error) {
    if (errorCallback) {
      errorCallback(error instanceof DataServiceError ? error : new DataServiceError(
        'Failed to set up maintenance listener',
        'MAINTENANCE_LISTENER_FAILED'
      ));
    }
    return () => {}; // Return empty cleanup function
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
