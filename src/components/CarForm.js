import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { addCar } from '../services/carService';
import './styles/CarForm.css';

const CarForm = ({ onSuccess }) => {
    const { user } = useAuth();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await addCar({
                ...data,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                currentMileage: parseFloat(data.currentMileage)
            });
            reset();
            onSuccess?.();
        } catch (error) {
            console.error('Error adding car:', error);
            throw error;
        }
    };

    return (
        <form className="car-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="make">Make</label>
                    <input
                        id="make"
                        type="text"
                        {...register('make', { required: 'Make is required' })}
                        className={errors.make ? 'error' : ''}
                    />
                    {errors.make && <span className="error-message">{errors.make.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="model">Model</label>
                    <input
                        id="model"
                        type="text"
                        {...register('model', { required: 'Model is required' })}
                        className={errors.model ? 'error' : ''}
                    />
                    {errors.model && <span className="error-message">{errors.model.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="year">Year</label>
                    <input
                        id="year"
                        type="number"
                        {...register('year', {
                            required: 'Year is required',
                            min: { value: 1900, message: 'Year must be 1900 or later' },
                            max: { value: new Date().getFullYear() + 1, message: 'Invalid year' }
                        })}
                        className={errors.year ? 'error' : ''}
                    />
                    {errors.year && <span className="error-message">{errors.year.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="licensePlate">License Plate</label>
                    <input
                        id="licensePlate"
                        type="text"
                        {...register('licensePlate', { required: 'License plate is required' })}
                        className={errors.licensePlate ? 'error' : ''}
                    />
                    {errors.licensePlate && <span className="error-message">{errors.licensePlate.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="currentMileage">Current Mileage (km)</label>
                    <input
                        id="currentMileage"
                        type="number"
                        step="0.1"
                        {...register('currentMileage', {
                            required: 'Current mileage is required',
                            min: { value: 0, message: 'Mileage must be positive' }
                        })}
                        className={errors.currentMileage ? 'error' : ''}
                    />
                    {errors.currentMileage && <span className="error-message">{errors.currentMileage.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="color">Color</label>
                    <input
                        id="color"
                        type="text"
                        {...register('color')}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    {...register('notes')}
                    rows="3"
                />
            </div>

            <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Adding Car...' : 'Add Car'}
            </button>
        </form>
    );
};

export default CarForm; 