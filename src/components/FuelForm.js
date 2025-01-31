// src/components/FuelForm.js
import React, { useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import { addFuel } from '../services/dataService';
import {
    FormCard,
    FormGroup,
    FormRow,
    FormLabel,
    FormInput,
    FormButton
} from './common/Form';
import CarSelector from './CarSelector';
import './styles/FuelForm.css';

const FuelForm = () => {
    const [formData, setFormData] = useState({
        carId: '',
        date: new Date().toISOString().split('T')[0],
        liters: '',
        pricePerLiter: '',
        totalCost: '',
        mileage: '',
        fuelType: 'regular',
        station: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            
            // Auto-calculate total cost
            if (name === 'liters' || name === 'pricePerLiter') {
                const liters = parseFloat(newData.liters) || 0;
                const price = parseFloat(newData.pricePerLiter) || 0;
                newData.totalCost = (liters * price).toFixed(2);
            }
            
            return newData;
        });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.carId) newErrors.carId = 'Please select a car';
        if (!formData.liters) newErrors.liters = 'Liters is required';
        if (!formData.pricePerLiter) newErrors.pricePerLiter = 'Price per liter is required';
        if (!formData.mileage) newErrors.mileage = 'Mileage is required';
        if (parseFloat(formData.liters) <= 0) newErrors.liters = 'Liters must be greater than 0';
        if (parseFloat(formData.pricePerLiter) <= 0) newErrors.pricePerLiter = 'Price must be greater than 0';
        if (parseFloat(formData.mileage) <= 0) newErrors.mileage = 'Mileage must be greater than 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await addFuel({
                ...formData,
                liters: parseFloat(formData.liters),
                pricePerLiter: parseFloat(formData.pricePerLiter),
                totalCost: parseFloat(formData.totalCost),
                mileage: parseFloat(formData.mileage)
            }, userId);
            
            showToast('Fuel record added successfully', 'success');
            setFormData(prev => ({
                ...prev,
                liters: '',
                pricePerLiter: '',
                totalCost: '',
                mileage: '',
                station: ''
            }));
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormCard title="Add Fuel Record">
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

                <FormRow>
                    <FormGroup>
                        <FormLabel htmlFor="liters" required>Liters</FormLabel>
                        <FormInput
                            type="number"
                            id="liters"
                            name="liters"
                            value={formData.liters}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="e.g., 45.5"
                            error={errors.liters}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="pricePerLiter" required>Price per Liter</FormLabel>
                        <FormInput
                            type="number"
                            id="pricePerLiter"
                            name="pricePerLiter"
                            value={formData.pricePerLiter}
                            onChange={handleChange}
                            step="0.001"
                            min="0"
                            placeholder="e.g., 1.499"
                            error={errors.pricePerLiter}
                        />
                    </FormGroup>
                </FormRow>

                <FormRow>
                    <FormGroup>
                        <FormLabel htmlFor="totalCost">Total Cost</FormLabel>
                        <FormInput
                            type="number"
                            id="totalCost"
                            name="totalCost"
                            value={formData.totalCost}
                            readOnly
                            disabled
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="station">Station</FormLabel>
                        <FormInput
                            type="text"
                            id="station"
                            name="station"
                            value={formData.station}
                            onChange={handleChange}
                            placeholder="e.g., Shell"
                        />
                    </FormGroup>
                </FormRow>

                <FormButton type="submit" loading={loading}>
                    Add Fuel Record
                </FormButton>
            </form>
        </FormCard>
    );
};

export default FuelForm;
