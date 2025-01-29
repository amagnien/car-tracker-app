// src/services/dataService.js
import { collection, addDoc, doc, updateDoc, deleteDoc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

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
        const maintenanceCollection = collection(db, `users/${userId}/maintenance`);
        await addDoc(maintenanceCollection, maintenanceData);
    } catch (e) {
        console.log(e);
    }
};

export const getMaintenance = async (userId, callback) => {
    try {
        const maintenanceCollection = collection(db, `users/${userId}/maintenance`);
        const unsubscribe = onSnapshot(query(maintenanceCollection), (querySnapshot) => {
            const maintenanceList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            callback(maintenanceList);
        });
        return unsubscribe;
    } catch (e) {
        console.log(e);
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
        const fuelCollection = collection(db, `users/${userId}/fuel`);
        await addDoc(fuelCollection, fuelData);
    } catch (e) {
        console.log(e);
    }
};

export const getFuel = async (userId, callback) => {
    try {
        const fuelCollection = collection(db, `users/${userId}/fuel`);
        const unsubscribe = onSnapshot(query(fuelCollection), (querySnapshot) => {
            const fuelList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            callback(fuelList);
        });
        return unsubscribe;
    } catch (e) {
        console.log(e);
    }
};

export const deleteFuel = async (userId, fuelId) => {
    try {
        const fuelDoc = doc(db, `users/${userId}/fuel`, fuelId);
        await deleteDoc(fuelDoc);
    } catch (e) {
        console.log(e);
    }
};

export const updateFuel = async (userId, fuelId, updatedData) => {
    try {
        const fuelDoc = doc(db, `users/${userId}/fuel`, fuelId);
        await updateDoc(fuelDoc, updatedData);
    } catch (e) {
        console.log(e);
    }
};
