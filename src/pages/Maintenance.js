// src/pages/Maintenance.js
import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import { getMaintenance, deleteMaintenance } from '../services/dataService';
import MaintenanceForm from '../components/MaintenanceForm';
import CarSelector from '../components/CarSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Maintenance.css';

const MaintenancePage = () => {
    const [maintenance, setMaintenance] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [loading, setLoading] = useState(false);
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        let unsubscribe = () => {};

        if (userId && selectedCarId) {
            setLoading(true);
            unsubscribe = getMaintenance(
                userId,
                selectedCarId,
                (maintenanceList) => {
                    setMaintenance(maintenanceList);
                    setLoading(false);
                },
                (error) => {
                    console.error('Error fetching maintenance records:', error);
                    showToast('Error loading maintenance records', 'error');
                    setLoading(false);
                }
            );
        } else {
            setMaintenance([]);
            setLoading(false);
        }

        return () => unsubscribe();
    }, [userId, selectedCarId, showToast]);

    const handleDeleteMaintenance = async (maintenanceId) => {
        try {
            await deleteMaintenance(userId, selectedCarId, maintenanceId);
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
                            {maintenance.length === 0 ? (
                                <p className="no-maintenance">No maintenance records yet.</p>
                            ) : (
                                maintenance.map(record => (
                                    <div key={record.id} className="maintenance-card">
                                        <div className="maintenance-info">
                                            <div className="maintenance-header">
                                                <h3>{record.serviceType}</h3>
                                                <span className="maintenance-cost">
                                                    ${record.cost.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="maintenance-details">
                                                <p className="maintenance-date">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </p>
                                                <p className="maintenance-mileage">
                                                    {record.mileage.toLocaleString()} km
                                                </p>
                                            </div>
                                            {record.serviceProvider && (
                                                <p className="service-provider">
                                                    Provider: {record.serviceProvider}
                                                </p>
                                            )}
                                            {record.notes && (
                                                <p className="maintenance-notes">{record.notes}</p>
                                            )}
                                        </div>
                                        <div className="maintenance-actions">
                                            <button
                                                className="button button-danger"
                                                onClick={() => handleDeleteMaintenance(record.id)}
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
