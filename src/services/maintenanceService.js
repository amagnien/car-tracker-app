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

export const addMaintenance = async (maintenanceData) => {
    try {
        const docRef = await addDoc(collection(db, 'maintenance_records'), maintenanceData);
        return { id: docRef.id, ...maintenanceData };
    } catch (error) {
        throw new Error('Error adding maintenance record: ' + error.message);
    }
};

export const updateMaintenance = async (recordId, maintenanceData) => {
    try {
        const recordRef = doc(db, 'maintenance_records', recordId);
        await updateDoc(recordRef, maintenanceData);
        return { id: recordId, ...maintenanceData };
    } catch (error) {
        throw new Error('Error updating maintenance record: ' + error.message);
    }
};

export const deleteMaintenance = async (recordId) => {
    try {
        await deleteDoc(doc(db, 'maintenance_records', recordId));
        return recordId;
    } catch (error) {
        throw new Error('Error deleting maintenance record: ' + error.message);
    }
};

export const getCarMaintenanceRecords = async (carId) => {
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