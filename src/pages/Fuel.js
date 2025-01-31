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
            <CarSelector onSelectCar={setSelectedCarId} />
            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {selectedCarId ? (
                        <div className="fuel-content">
                            <FuelForm carId={selectedCarId} />
                            <div className="fuel-records">
                                {fuelRecords.length === 0 ? (
                                    <p>No fuel records found.</p>
                                ) : (
                                    fuelRecords.map((record) => (
                                        <div key={record.id} className="fuel-record">
                                            <div className="fuel-details">
                                                <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                                                <p>Liters: {record.liters}</p>
                                                <p>Total Cost: ${record.totalCost}</p>
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
