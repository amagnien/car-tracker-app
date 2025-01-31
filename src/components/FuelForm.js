// src/components/FuelForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { addFuelRecord } from '../services/fuelService';
import './styles/FuelForm.css';

const FuelForm = ({ carId, onSuccess }) => {
    const { user } = useAuth();
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
    const liters = watch('liters', 0);
    const pricePerLiter = watch('pricePerLiter', 0);

    const calculateTotal = () => {
        const total = liters * pricePerLiter;
        return isNaN(total) ? '0.00' : total.toFixed(2);
    };

    const onSubmit = async (data) => {
        try {
            await addFuelRecord({
                ...data,
                carId,
                userId: user.uid,
                liters: parseFloat(data.liters),
                pricePerLiter: parseFloat(data.pricePerLiter),
                totalCost: parseFloat(calculateTotal()),
                mileage: parseFloat(data.mileage),
                date: new Date(data.date).toISOString(),
                createdAt: new Date().toISOString()
            });
            reset();
            onSuccess?.();
        } catch (error) {
            console.error('Error adding fuel record:', error);
            throw error;
        }
    };

    return (
        <form className="fuel-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="date"
                        {...register('date', { required: 'Date is required' })}
                        className={errors.date ? 'error' : ''}
                    />
                    {errors.date && <span className="error-message">{errors.date.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="liters">Liters</label>
                    <input
                        id="liters"
                        type="number"
                        step="0.01"
                        {...register('liters', {
                            required: 'Liters is required',
                            min: { value: 0.01, message: 'Must be greater than 0' }
                        })}
                        className={errors.liters ? 'error' : ''}
                    />
                    {errors.liters && <span className="error-message">{errors.liters.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="pricePerLiter">Price per Liter ($)</label>
                    <input
                        id="pricePerLiter"
                        type="number"
                        step="0.001"
                        {...register('pricePerLiter', {
                            required: 'Price per liter is required',
                            min: { value: 0.01, message: 'Must be greater than 0' }
                        })}
                        className={errors.pricePerLiter ? 'error' : ''}
                    />
                    {errors.pricePerLiter && <span className="error-message">{errors.pricePerLiter.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="totalCost">Total Cost ($)</label>
                    <input
                        id="totalCost"
                        type="text"
                        value={calculateTotal()}
                        disabled
                        className="calculated-field"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mileage">Odometer Reading (km)</label>
                    <input
                        id="mileage"
                        type="number"
                        step="0.1"
                        {...register('mileage', {
                            required: 'Mileage is required',
                            min: { value: 0, message: 'Must be greater than 0' }
                        })}
                        className={errors.mileage ? 'error' : ''}
                    />
                    {errors.mileage && <span className="error-message">{errors.mileage.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="station">Gas Station (optional)</label>
                    <input
                        id="station"
                        type="text"
                        {...register('station')}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
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
                {isSubmitting ? 'Adding Fuel Record...' : 'Add Fuel Record'}
            </button>
        </form>
    );
};

export default FuelForm;
