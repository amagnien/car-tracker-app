// src/pages/Maintenance.js
import React, { useEffect, useState, useContext } from 'react';
import MaintenanceForm from '../components/MaintenanceForm';
import { getMaintenance, deleteMaintenance } from "../services/dataService";
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import CarSelector from '../components/CarSelector';
import LoadingSpinner from '../components/LoadingSpinner';

const MaintenancePage = () => {
    const [maintenanceList, setMaintenanceList] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        if (userId && selectedCarId) {
            const unsubscribe = getMaintenance(
                userId,
                selectedCarId,
                (maintenanceList) => {
                    setMaintenanceList(maintenanceList);
                    setLoading(false);
                },
                (error) => {
                    showToast(error.message, 'error');
                    setLoading(false);
                }
            );
            return () => unsubscribe();
        }
    }, [userId, selectedCarId, showToast]);

    const handleDeleteMaintenance = async (maintenanceId) => {
        if (window.confirm('Are you sure you want to delete this maintenance record?')) {
            try {
                await deleteMaintenance(userId, selectedCarId, maintenanceId);
                showToast('Maintenance record deleted successfully', 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    };

    if (loading && selectedCarId) {
        return <LoadingSpinner size="large" />;
    }

    return (
        <div className="maintenance-page">
            <h2>Maintenance Records</h2>
            <CarSelector
                selectedCarId={selectedCarId}
                onCarSelect={setSelectedCarId}
            />
            
            {selectedCarId ? (
                <>
                    <MaintenanceForm carId={selectedCarId} />
                    {maintenanceList.length === 0 ? (
                        <p className="no-records">No maintenance records found. Add your first record above.</p>
                    ) : (
                        <div className="maintenance-list">
                            {maintenanceList.map((maintenance) => (
                                <div key={maintenance.id} className="maintenance-card">
                                    <div className="maintenance-info">
                                        <h3>{maintenance.serviceType}</h3>
                                        <p className="date">{new Date(maintenance.date).toLocaleDateString()}</p>
                                        <p className="cost">${maintenance.cost}</p>
                                        <p className="mileage">{maintenance.mileage} km</p>
                                        {maintenance.notes && (
                                            <p className="notes">{maintenance.notes}</p>
                                        )}
                                    </div>
                                    <div className="maintenance-actions">
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteMaintenance(maintenance.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <p>Please select a car to view and add maintenance records.</p>
            )}
        </div>
    );
};

export default MaintenancePage;
