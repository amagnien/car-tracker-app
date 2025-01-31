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
import { db } from '../firebase';

export const addFuelRecord = async (fuelData) => {
    try {
        const docRef = await addDoc(collection(db, 'fuel_records'), fuelData);
        return { id: docRef.id, ...fuelData };
    } catch (error) {
        throw new Error('Error adding fuel record: ' + error.message);
    }
};

export const updateFuelRecord = async (recordId, fuelData) => {
    try {
        const recordRef = doc(db, 'fuel_records', recordId);
        await updateDoc(recordRef, fuelData);
        return { id: recordId, ...fuelData };
    } catch (error) {
        throw new Error('Error updating fuel record: ' + error.message);
    }
};

export const deleteFuelRecord = async (recordId) => {
    try {
        await deleteDoc(doc(db, 'fuel_records', recordId));
        return recordId;
    } catch (error) {
        throw new Error('Error deleting fuel record: ' + error.message);
    }
};

export const getCarFuelRecords = async (carId) => {
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

export const calculateFuelEfficiency = (fuelRecords) => {
    if (fuelRecords.length < 2) return null;

    // Sort records by mileage
    const sortedRecords = [...fuelRecords].sort((a, b) => a.mileage - b.mileage);
    
    // Calculate total distance and fuel consumed
    const totalDistance = sortedRecords[sortedRecords.length - 1].mileage - sortedRecords[0].mileage;
    const totalFuel = sortedRecords.reduce((sum, record) => sum + record.liters, 0);

    // Calculate L/100km
    return (totalFuel / totalDistance) * 100;
}; 