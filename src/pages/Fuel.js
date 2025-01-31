// src/pages/Fuel.js
import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../contexts/ToastContext';
import { getFuelRecords, deleteFuelRecord } from '../services/dataService';
import FuelForm from '../components/FuelForm';
import CarSelector from '../components/CarSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Fuel.css';

const FuelPage = () => {
    const [fuelRecords, setFuelRecords] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [loading, setLoading] = useState(false);
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        let unsubscribe = () => {};

        if (userId && selectedCarId) {
            setLoading(true);
            unsubscribe = getFuelRecords(
                userId,
                selectedCarId,
                (records) => {
                    setFuelRecords(records);
                    setLoading(false);
                },
                (error) => {
                    console.error('Error fetching fuel records:', error);
                    showToast('Error loading fuel records', 'error');
                    setLoading(false);
                }
            );
        } else {
            setFuelRecords([]);
            setLoading(false);
        }

        return () => unsubscribe();
    }, [userId, selectedCarId, showToast]);

    const handleDeleteFuelRecord = async (recordId) => {
        try {
            await deleteFuelRecord(userId, selectedCarId, recordId);
            showToast('Fuel record deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting fuel record:', error);
            showToast('Error deleting fuel record', 'error');
        }
    };

    return (
        <div className="fuel-page">
            <h1>Fuel Records</h1>
            
            <div className="car-selector-container">
                <CarSelector
                    selectedCarId={selectedCarId}
                    onCarSelect={setSelectedCarId}
                />
            </div>

            {selectedCarId && <FuelForm carId={selectedCarId} />}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {selectedCarId ? (
                        <div className="fuel-list">
                            {fuelRecords.length === 0 ? (
                                <p className="no-fuel">No fuel records yet.</p>
                            ) : (
                                fuelRecords.map(record => (
                                    <div key={record.id} className="fuel-card">
                                        <div className="fuel-info">
                                            <div className="fuel-header">
                                                <h3>{record.date}</h3>
                                                <span className="fuel-cost">
                                                    ${record.totalCost.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="fuel-details">
                                                <p>Liters: {record.liters}</p>
                                                <p>Price per liter: ${record.pricePerLiter.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="fuel-actions">
                                            <button
                                                className="button button-danger"
                                                onClick={() => handleDeleteFuelRecord(record.id)}
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
                            Please select a car to view and add fuel records.
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default FuelPage;
