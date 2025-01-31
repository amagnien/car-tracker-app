import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import LoadingSpinner from '../components/LoadingSpinner';
import CarForm from '../components/CarForm';
import { getCars, deleteCar } from '../services/dataService';
import '../styles/CarManagement.css';

const CarManagement = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        if (userId) {
            const unsubscribe = getCars(
                userId,
                (carsList) => {
                    setCars(carsList);
                    setLoading(false);
                },
                (error) => {
                    showToast(error.message, 'error');
                    setLoading(false);
                }
            );
            return () => unsubscribe();
        }
    }, [userId, showToast]);

    const handleDeleteCar = async (carId) => {
        if (window.confirm('Are you sure you want to delete this car? All associated records will also be deleted.')) {
            try {
                await deleteCar(userId, carId);
                showToast('Car deleted successfully', 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    };

    if (loading) {
        return <LoadingSpinner size="large" />;
    }

    return (
        <div className="car-management-page">
            <div className="header">
                <h2>My Cars</h2>
                <button 
                    className="add-car-button"
                    onClick={() => setShowAddForm(true)}
                >
                    Add New Car
                </button>
            </div>

            {showAddForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            className="close-button"
                            onClick={() => setShowAddForm(false)}
                        >
                            ×
                        </button>
                        <CarForm 
                            onSuccess={() => {
                                setShowAddForm(false);
                                showToast('Car added successfully', 'success');
                            }}
                        />
                    </div>
                </div>
            )}

            {cars.length === 0 ? (
                <p className="no-cars">No cars added yet. Add your first car to start tracking!</p>
            ) : (
                <div className="cars-grid">
                    {cars.map((car) => (
                        <div key={car.id} className="car-card">
                            <div className="car-image">
                                {car.imageUrl ? (
                                    <img src={car.imageUrl} alt={`${car.make} ${car.model}`} />
                                ) : (
                                    <div className="placeholder-image">🚗</div>
                                )}
                            </div>
                            <div className="car-info">
                                <h3>{car.make} {car.model}</h3>
                                <p className="car-year">{car.year}</p>
                                <p className="car-details">
                                    <span>License: {car.licensePlate}</span>
                                    <span>Mileage: {car.currentMileage}km</span>
                                </p>
                            </div>
                            <div className="car-actions">
                                <button 
                                    className="delete-button"
                                    onClick={() => handleDeleteCar(car.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarManagement; 