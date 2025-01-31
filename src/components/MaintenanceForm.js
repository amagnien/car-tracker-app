// src/components/MaintenanceForm.js
import React, { useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import { addMaintenance } from '../services/dataService';
import {
    FormCard,
    FormGroup,
    FormRow,
    FormLabel,
    FormInput,
    FormSelect,
    FormTextarea,
    FormButton
} from './common/Form';
import CarSelector from './CarSelector';

const MAINTENANCE_TYPES = [
    'Oil Change',
    'Tire Rotation',
    'Brake Service',
    'Air Filter',
    'Battery',
    'Transmission',
    'Coolant',
    'Spark Plugs',
    'Alignment',
    'General Service',
    'Other'
];

const MaintenanceForm = () => {
    const [formData, setFormData] = useState({
        carId: '',
        date: new Date().toISOString().split('T')[0],
        serviceType: '',
        cost: '',
        mileage: '',
        serviceProvider: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.carId) newErrors.carId = 'Please select a car';
        if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
        if (!formData.cost) newErrors.cost = 'Cost is required';
        if (!formData.mileage) newErrors.mileage = 'Mileage is required';
        if (parseFloat(formData.cost) <= 0) newErrors.cost = 'Cost must be greater than 0';
        if (parseFloat(formData.mileage) <= 0) newErrors.mileage = 'Mileage must be greater than 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await addMaintenance({
                ...formData,
                cost: parseFloat(formData.cost),
                mileage: parseFloat(formData.mileage)
            }, userId);
            
            showToast('Maintenance record added successfully', 'success');
            setFormData(prev => ({
                ...prev,
                serviceType: '',
                cost: '',
                mileage: '',
                serviceProvider: '',
                notes: ''
            }));
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormCard title="Add Maintenance Record">
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <FormLabel htmlFor="carId" required>Select Car</FormLabel>
                    <CarSelector
                        selectedCarId={formData.carId}
                        onCarSelect={(carId) => {
                            setFormData(prev => ({ ...prev, carId }));
                            if (errors.carId) {
                                setErrors(prev => ({ ...prev, carId: '' }));
                            }
                        }}
                        error={errors.carId}
                    />
                </FormGroup>

                <FormRow>
                    <FormGroup>
                        <FormLabel htmlFor="date" required>Date</FormLabel>
                        <FormInput
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="serviceType" required>Service Type</FormLabel>
                        <FormSelect
                            id="serviceType"
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            error={errors.serviceType}
                        >
                            <option value="">Select service type</option>
                            {MAINTENANCE_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </FormSelect>
                    </FormGroup>
                </FormRow>

                <FormRow>
                    <FormGroup>
                        <FormLabel htmlFor="cost" required>Cost ($)</FormLabel>
                        <FormInput
                            type="number"
                            id="cost"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="e.g., 150.00"
                            error={errors.cost}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="mileage" required>Current Mileage (km)</FormLabel>
                        <FormInput
                            type="number"
                            id="mileage"
                            name="mileage"
                            value={formData.mileage}
                            onChange={handleChange}
                            min="0"
                            placeholder="e.g., 50000"
                            error={errors.mileage}
                        />
                    </FormGroup>
                </FormRow>

                <FormGroup>
                    <FormLabel htmlFor="serviceProvider">Service Provider</FormLabel>
                    <FormInput
                        type="text"
                        id="serviceProvider"
                        name="serviceProvider"
                        value={formData.serviceProvider}
                        onChange={handleChange}
                        placeholder="e.g., AutoCare Service Center"
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel htmlFor="notes">Notes</FormLabel>
                    <FormTextarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Enter any additional notes about the service..."
                        rows="3"
                    />
                </FormGroup>

                <FormButton type="submit" loading={loading}>
                    Add Maintenance Record
                </FormButton>
            </form>
        </FormCard>
    );
};

export default MaintenanceForm;
