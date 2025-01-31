import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../contexts/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import CarForm from '../components/CarForm';
import { getUserCars, deleteCar } from '../services/dataService';
import '../styles/CarManagement.css';

const CarManagement = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = getUserCars(user.uid, (fetchedCars) => {
            setCars(fetchedCars);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDelete = async (carId) => {
        try {
            await deleteCar(user.uid, carId);
            showToast('Car deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting car:', error);
            showToast('Error deleting car', 'error');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="car-management">
            <h1>Car Management</h1>
            <CarForm />
            <div className="cars-list">
                {cars.map((car) => (
                    <div key={car.id} className="car-card">
                        <h3>{car.make} {car.model}</h3>
                        <p>Year: {car.year}</p>
                        <button 
                            onClick={() => handleDelete(car.id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarManagement;