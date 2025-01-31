import React from 'react';
import { FormSelect } from './common/Form';
import { useCarList } from '../hooks/useCarList';
import LoadingSpinner from './LoadingSpinner';

const CarSelector = ({ selectedCarId, onCarSelect, error }) => {
    const { cars, loading } = useCarList();

    if (loading) {
        return <LoadingSpinner size="small" />;
    }

    if (cars.length === 0) {
        return (
            <div className="form-message form-message-warning">
                No cars found. Please add a car first.
            </div>
        );
    }

    return (
        <FormSelect
            value={selectedCarId || ''}
            onChange={(e) => onCarSelect(e.target.value)}
            error={error}
        >
            <option value="">Select a car</option>
            {cars.map((car) => (
                <option key={car.id} value={car.id}>
                    {car.year} {car.make} {car.model} - {car.licensePlate}
                </option>
            ))}
        </FormSelect>
    );
};

export default CarSelector; 