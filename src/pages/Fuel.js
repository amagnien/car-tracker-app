// src/pages/Fuel.js
import React, { useEffect, useState, useContext } from 'react';
import FuelForm from '../components/FuelForm';
import { getFuel, deleteFuel } from "../services/dataService";
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Fuel.css';
import CarSelector from '../components/CarSelector';

const FuelPage = () => {
    const [fuelList, setFuelList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);
    const [selectedCarId, setSelectedCarId] = useState('');

    useEffect(() => {
        if (userId && selectedCarId) {
            const unsubscribe = getFuel(
                userId,
                selectedCarId,
                (fuelList) => {
                    setFuelList(fuelList);
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

    const handleDeleteFuel = async (fuelId) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            try {
                await deleteFuel(userId, fuelId);
                showToast('Fuel record deleted successfully', 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    };

    if (loading) {
        return <LoadingSpinner size="large" />;
    }

    return (
        <div className="fuel-page">
            <h2>Fuel Tracking</h2>
            <CarSelector
                selectedCarId={selectedCarId}
                onCarSelect={setSelectedCarId}
            />
            {selectedCarId ? (
                <>
                    <FuelForm />
                    {fuelList.length === 0 ? (
                        <p className="no-data">No fuel records found. Add your first fuel record above.</p>
                    ) : (
                        <div className="fuel-list">
                            {fuelList.map((fuel) => (
                                <div key={fuel.id} className="fuel-card">
                                    <div className="fuel-info">
                                        <div className="fuel-date">{new Date(fuel.date).toLocaleDateString()}</div>
                                        <div className="fuel-details">
                                            <span>{fuel.liters} liters</span>
                                            <span>${fuel.pricePerLiter}/L</span>
                                            <span>{fuel.mileage} km</span>
                                        </div>
                                    </div>
                                    <button 
                                        className="delete-button"
                                        onClick={() => handleDeleteFuel(fuel.id)}
                                        aria-label="Delete fuel record"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <p>Please select a car to view and add fuel records.</p>
            )}
        </div>
    );
};

export default FuelPage;
