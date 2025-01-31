import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../contexts/ToastContext';
import { getMaintenance, deleteMaintenance } from '../services/dataService';
import MaintenanceForm from '../components/MaintenanceForm';
import CarSelector from '../components/CarSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Maintenance.css';

const MaintenancePage = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        if (!userId || !selectedCarId) return;

        const unsubscribe = getMaintenance(userId, selectedCarId, 
            (records) => {
                setMaintenanceRecords(records);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching maintenance records:', error);
                showToast('Error loading maintenance records', 'error');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId, selectedCarId, showToast]);

    const handleDeleteMaintenanceRecord = async (recordId) => {
        try {
            await deleteMaintenance(userId, selectedCarId, recordId);
            showToast('Maintenance record deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting maintenance record:', error);
            showToast('Error deleting maintenance record', 'error');
        }
    };

    return (
        <div className="maintenance-page">
            <h1>Maintenance Records</h1>
            
            <div className="car-selector-container">
                <CarSelector
                    selectedCarId={selectedCarId}
                    onCarSelect={setSelectedCarId}
                />
            </div>

            {selectedCarId && <MaintenanceForm carId={selectedCarId} />}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {selectedCarId ? (
                        <div className="maintenance-list">
                            {maintenanceRecords.length === 0 ? (
                                <p className="no-maintenance">No maintenance records yet.</p>
                            ) : (
                                maintenanceRecords.map(record => (
                                    <div key={record.id} className="maintenance-card">
                                        <div className="maintenance-info">
                                            <div className="maintenance-header">
                                                <h3>{record.date}</h3>
                                                <span className="maintenance-cost">
                                                    ${record.cost.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="maintenance-details">
                                                <p>Service: {record.service}</p>
                                                <p>Mileage: {record.mileage} km</p>
                                            </div>
                                        </div>
                                        <div className="maintenance-actions">
                                            <button
                                                className="button button-danger"
                                                onClick={() => handleDeleteMaintenanceRecord(record.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <p className="select-car-message">
                            Please select a car to view and add maintenance records.
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default MaintenancePage;