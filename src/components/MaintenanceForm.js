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
import { MAINTENANCE_PARTS } from '../utils/constants';
import CarSelector from './CarSelector';

const MaintenanceForm = () => {
    const initialFormData = {
        carId: '',
        date: new Date().toISOString().split('T')[0],
        serviceType: '',
        parts: [],
        totalCost: 0,
        mileage: '',
        serviceProvider: '',
        notes: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [newPart, setNewPart] = useState({ partId: '', cost: '' });
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
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const calculateTotalCost = (parts) => {
        return parts.reduce((sum, part) => {
            const cost = parseFloat(part.cost) || 0;
            return sum + cost;
        }, 0);
    };

    const handleAddPart = () => {
        if (!newPart.partId || !newPart.cost) return;

        const selectedPart = MAINTENANCE_PARTS.find(p => p.id === newPart.partId);
        const partCost = parseFloat(newPart.cost) || 0;

        const updatedParts = [
            ...formData.parts,
            {
                id: newPart.partId,
                name: selectedPart.name,
                cost: partCost
            }
        ];

        const totalCost = calculateTotalCost(updatedParts);

        setFormData(prev => ({
            ...prev,
            parts: updatedParts,
            totalCost
        }));

        setNewPart({ partId: '', cost: '' });
    };

    const handleRemovePart = (partId) => {
        const updatedParts = formData.parts.filter(part => part.id !== partId);
        const totalCost = calculateTotalCost(updatedParts);

        setFormData(prev => ({
            ...prev,
            parts: updatedParts,
            totalCost
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.carId) newErrors.carId = 'Please select a car';
        if (!formData.parts.length) newErrors.parts = 'At least one part is required';
        if (!formData.mileage) newErrors.mileage = 'Mileage is required';
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
                mileage: parseFloat(formData.mileage),
                totalCost: parseFloat(formData.totalCost)
            }, userId);
            
            showToast('Maintenance record added successfully', 'success');
            setFormData(prev => ({
                ...prev,
                parts: [],
                totalCost: 0,
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
                    <FormLabel>Parts and Costs</FormLabel>
                    <div className="parts-input-container">
                        <FormSelect
                            value={newPart.partId}
                            onChange={(e) => setNewPart(prev => ({ ...prev, partId: e.target.value }))}
                        >
                            <option value="">Select part</option>
                            {MAINTENANCE_PARTS.map(part => (
                                <option key={part.id} value={part.id}>
                                    {part.name}
                                </option>
                            ))}
                        </FormSelect>
                        <FormInput
                            type="number"
                            step="0.01"
                            min="0"
                            value={newPart.cost}
                            onChange={(e) => setNewPart(prev => ({ ...prev, cost: e.target.value }))}
                            placeholder="Cost"
                        />
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={handleAddPart}
                        >
                            Add Part
                        </button>
                    </div>
                    {errors.parts && <span className="form-error">{errors.parts}</span>}
                </FormGroup>

                {formData.parts.length > 0 && (
                    <div className="parts-list">
                        {formData.parts.map(part => (
                            <div key={part.id} className="part-item">
                                <span>{part.name}</span>
                                <span>${(parseFloat(part.cost) || 0).toFixed(2)}</span>
                                <button
                                    type="button"
                                    className="button button-danger button-small"
                                    onClick={() => handleRemovePart(part.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <div className="total-cost">
                            <strong>Total Cost: ${(formData.totalCost || 0).toFixed(2)}</strong>
                        </div>
                    </div>
                )}

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
                        placeholder="Additional notes about the maintenance..."
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
