import React, { useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import { addCar } from '../services/dataService';
import {
    FormCard,
    FormGroup,
    FormRow,
    FormLabel,
    FormInput,
    FormButton
} from './common/Form';

const CarForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        currentMileage: '',
        imageUrl: ''
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
        const currentYear = new Date().getFullYear();
        
        if (!formData.make) newErrors.make = 'Make is required';
        if (!formData.model) newErrors.model = 'Model is required';
        if (!formData.licensePlate) newErrors.licensePlate = 'License plate is required';
        if (!formData.currentMileage) newErrors.currentMileage = 'Current mileage is required';
        if (formData.currentMileage < 0) newErrors.currentMileage = 'Mileage cannot be negative';
        if (formData.year < 1900 || formData.year > currentYear + 1) {
            newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await addCar(formData, userId);
            showToast('Car added successfully', 'success');
            setFormData({
                make: '',
                model: '',
                year: new Date().getFullYear(),
                licensePlate: '',
                currentMileage: '',
                imageUrl: ''
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormCard title="Add New Car">
            <form onSubmit={handleSubmit}>
                <FormRow>
                    <FormGroup>
                        <FormLabel htmlFor="make" required>Make</FormLabel>
                        <FormInput
                            type="text"
                            id="make"
                            name="make"
                            value={formData.make}
                            onChange={handleChange}
                            placeholder="e.g., Toyota"
                            error={errors.make}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="model" required>Model</FormLabel>
                        <FormInput
                            type="text"
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="e.g., Camry"
                            error={errors.model}
                        />
                    </FormGroup>
                </FormRow>

                <FormRow>
                    <FormGroup>
                        <FormLabel htmlFor="year">Year</FormLabel>
                        <FormInput
                            type="number"
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            min="1900"
                            max={new Date().getFullYear() + 1}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="licensePlate" required>License Plate</FormLabel>
                        <FormInput
                            type="text"
                            id="licensePlate"
                            name="licensePlate"
                            value={formData.licensePlate}
                            onChange={handleChange}
                            placeholder="e.g., ABC123"
                            error={errors.licensePlate}
                        />
                    </FormGroup>
                </FormRow>

                <FormRow>
                    <FormGroup>
                        <FormLabel htmlFor="currentMileage" required>Current Mileage (km)</FormLabel>
                        <FormInput
                            type="number"
                            id="currentMileage"
                            name="currentMileage"
                            value={formData.currentMileage}
                            onChange={handleChange}
                            min="0"
                            placeholder="e.g., 50000"
                            error={errors.currentMileage}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="imageUrl">Image URL</FormLabel>
                        <FormInput
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/car-image.jpg"
                        />
                    </FormGroup>
                </FormRow>

                <FormButton type="submit" loading={loading}>
                    Add Car
                </FormButton>
            </form>
        </FormCard>
    );
};

export default CarForm; 