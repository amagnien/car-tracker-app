import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    getDocs,
    orderBy 
} from 'firebase/firestore';
import { db } from './firebase';

export const addExpense = async (expenseData) => {
    try {
        const docRef = await addDoc(collection(db, 'expenses'), expenseData);
        return { id: docRef.id, ...expenseData };
    } catch (error) {
        throw new Error('Error adding expense: ' + error.message);
    }
};

export const updateExpense = async (expenseId, expenseData) => {
    try {
        const expenseRef = doc(db, 'expenses', expenseId);
        await updateDoc(expenseRef, expenseData);
        return { id: expenseId, ...expenseData };
    } catch (error) {
        throw new Error('Error updating expense: ' + error.message);
    }
};

export const deleteExpense = async (expenseId) => {
    try {
        await deleteDoc(doc(db, 'expenses', expenseId));
        return expenseId;
    } catch (error) {
        throw new Error('Error deleting expense: ' + error.message);
    }
};

export const getCarExpenses = async (carId) => {
    try {
        const q = query(
            collection(db, 'expenses'),
            where('carId', '==', carId),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw new Error('Error fetching expenses: ' + error.message);
    }
};

export const getUserExpenses = async (userId) => {
    try {
        const q = query(
            collection(db, 'expenses'),
            where('userId', '==', userId),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw new Error('Error fetching user expenses: ' + error.message);
    }
}; 