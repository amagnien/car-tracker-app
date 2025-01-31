import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    getDocs 
} from 'firebase/firestore';
import { db } from '../firebase';

export const addCar = async (carData) => {
    try {
        const docRef = await addDoc(collection(db, 'cars'), carData);
        return { id: docRef.id, ...carData };
    } catch (error) {
        throw new Error('Error adding car: ' + error.message);
    }
};

export const updateCar = async (carId, carData) => {
    try {
        const carRef = doc(db, 'cars', carId);
        await updateDoc(carRef, carData);
        return { id: carId, ...carData };
    } catch (error) {
        throw new Error('Error updating car: ' + error.message);
    }
};

export const deleteCar = async (carId) => {
    try {
        await deleteDoc(doc(db, 'cars', carId));
        return carId;
    } catch (error) {
        throw new Error('Error deleting car: ' + error.message);
    }
};

export const getUserCars = async (userId) => {
    try {
        const q = query(collection(db, 'cars'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw new Error('Error fetching cars: ' + error.message);
    }
}; 