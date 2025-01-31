import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getCars } from '../services/dataService';
import './styles/CarSelector.css';

const CarSelector = ({ selectedCarId, onCarSelect }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();

    useEffect(() => {
        if (userId) {
            const unsubscribe = getCars(
                userId,
                (carsList) => {
                    setCars(carsList);
                    setLoading(false);
                    // Auto-select the first car if none is selected
                    if (!selectedCarId && carsList.length > 0) {
                        onCarSelect(carsList[0].id);
                    }
                },
                (error) => {
                    console.error(error);
                    setLoading(false);
                }
            );
            return () => unsubscribe();
        }
    }, [userId, selectedCarId, onCarSelect]);

    if (loading) {
        return <div className="car-selector-loading">Loading cars...</div>;
    }

    if (cars.length === 0) {
        return (
            <div className="car-selector-empty">
                Please add a car in the Car Management section first.
            </div>
        );
    }

    return (
        <div className="car-selector">
            <select
                value={selectedCarId || ''}
                onChange={(e) => onCarSelect(e.target.value)}
                className="car-select"
            >
                <option value="">Select a car</option>
                {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                        {car.year} {car.make} {car.model} - {car.licensePlate}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CarSelector; 