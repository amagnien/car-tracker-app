// src/components/MaintenanceForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { addMaintenance } from '../services/maintenanceService';
import './styles/MaintenanceForm.css';

const SERVICE_TYPES = [
    'Oil Change',
    'Tire Rotation',
    'Brake Service',
    'Air Filter',
    'Battery',
    'Transmission',
    'Other'
];

const MaintenanceForm = ({ carId, onSuccess }) => {
    const { user } = useAuth();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await addMaintenance({
                ...data,
                carId,
                userId: user.uid,
                cost: parseFloat(data.cost),
                mileage: parseFloat(data.mileage),
                date: new Date(data.date).toISOString(),
                createdAt: new Date().toISOString()
            });
            reset();
            onSuccess?.();
        } catch (error) {
            console.error('Error adding maintenance record:', error);
            throw error;
        }
    };

    return (
        <form className="maintenance-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="serviceType">Service Type</label>
                    <select
                        id="serviceType"
                        {...register('serviceType', { required: 'Service type is required' })}
                        className={errors.serviceType ? 'error' : ''}
                    >
                        <option value="">Select service type</option>
                        {SERVICE_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.serviceType && <span className="error-message">{errors.serviceType.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="date">Service Date</label>
                    <input
                        id="date"
                        type="date"
                        {...register('date', { required: 'Date is required' })}
                        className={errors.date ? 'error' : ''}
                    />
                    {errors.date && <span className="error-message">{errors.date.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="cost">Cost ($)</label>
                    <input
                        id="cost"
                        type="number"
                        step="0.01"
                        {...register('cost', {
                            required: 'Cost is required',
                            min: { value: 0, message: 'Cost must be positive' }
                        })}
                        className={errors.cost ? 'error' : ''}
                    />
                    {errors.cost && <span className="error-message">{errors.cost.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="mileage">Mileage at Service (km)</label>
                    <input
                        id="mileage"
                        type="number"
                        step="0.1"
                        {...register('mileage', {
                            required: 'Mileage is required',
                            min: { value: 0, message: 'Mileage must be positive' }
                        })}
                        className={errors.mileage ? 'error' : ''}
                    />
                    {errors.mileage && <span className="error-message">{errors.mileage.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="serviceProvider">Service Provider</label>
                    <input
                        id="serviceProvider"
                        type="text"
                        {...register('serviceProvider')}
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
                {isSubmitting ? 'Adding Maintenance Record...' : 'Add Maintenance Record'}
            </button>
        </form>
    );
};

export default MaintenanceForm;
