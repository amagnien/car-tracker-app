// src/components/FuelForm.js
import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import { addFuelRecord } from '../services/dataService';
import { getUserSettings } from '../services/userService';
import {
    FormCard,
    FormGroup,
    FormRow,
    FormLabel,
    FormInput,
    FormTextarea,
    FormButton
} from './common/Form';
import CarSelector from './CarSelector';
import './styles/FuelForm.css';

const FuelForm = ({ carId }) => {
    const initialFormData = {
        carId: carId || '',
        date: new Date().toISOString().split('T')[0],
        liters: '',
        pricePerLiter: '',
        totalCost: '',
        mileage: '',
        station: '',
        notes: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        const loadLatestFuelPrice = async () => {
            try {
                const settings = await getUserSettings(userId);
                if (settings?.fuelPrices?.length > 0) {
                    // Get the most recent fuel price
                    const latestPrice = settings.fuelPrices.reduce((latest, current) => {
                        return new Date(current.date) > new Date(latest.date) ? current : latest;
                    });
                    
                    setFormData(prev => {
                        const newData = {
                            ...prev,
                            pricePerLiter: latestPrice.price.toString()
                        };
                        // Recalculate total cost if liters are already entered
                        if (prev.liters) {
                            newData.totalCost = calculateTotalCost(prev.liters, latestPrice.price);
                        }
                        return newData;
                    });
                }
            } catch (error) {
                console.error('Error loading fuel price:', error);
            }
        };

        if (userId) {
            loadLatestFuelPrice();
        }
    }, [userId]);

    const calculateTotalCost = (liters, pricePerLiter) => {
        return ((parseFloat(liters) || 0) * (parseFloat(pricePerLiter) || 0)).toFixed(2);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            
            if (name === 'liters' || name === 'pricePerLiter') {
                newData.totalCost = calculateTotalCost(newData.liters, newData.pricePerLiter);
            }
            
            return newData;
        });
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.carId) newErrors.carId = 'Please select a car';
        if (!formData.liters || parseFloat(formData.liters) <= 0) {
            newErrors.liters = 'Please enter a valid amount of liters';
        }
        if (!formData.pricePerLiter || parseFloat(formData.pricePerLiter) <= 0) {
            newErrors.pricePerLiter = 'Please enter a valid price per liter';
        }
        if (!formData.mileage || parseFloat(formData.mileage) <= 0) {
            newErrors.mileage = 'Please enter a valid mileage';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const fuelData = {
                ...formData,
                liters: parseFloat(formData.liters),
                pricePerLiter: parseFloat(formData.pricePerLiter),
                totalCost: parseFloat(formData.totalCost),
                mileage: parseFloat(formData.mileage),
                date: new Date(formData.date).toISOString()
            };

            await addFuelRecord(fuelData, userId);
            showToast('Fuel record added successfully', 'success');
            setFormData(initialFormData);
        } catch (error) {
            console.error('Error adding fuel record:', error);
            showToast(error.message || 'Failed to add fuel record', 'error');
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
                            placeholder="0.00"
                            step="0.01"
                            min="0"
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
                            placeholder="0.000"
                            step="0.001"
                            min="0"
                            error={errors.pricePerLiter}
                        />
                    </FormGroup>
                </FormRow>

                <FormGroup>
                    <FormLabel htmlFor="totalCost">Total Cost</FormLabel>
                    <FormInput
                        type="number"
                        id="totalCost"
                        value={formData.totalCost}
                        readOnly
                        disabled
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel htmlFor="station">Gas Station</FormLabel>
                    <FormInput
                        type="text"
                        id="station"
                        name="station"
                        value={formData.station}
                        onChange={handleChange}
                        placeholder="e.g., Shell, BP"
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel htmlFor="notes">Notes</FormLabel>
                    <FormTextarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Additional notes..."
                        rows="3"
                    />
                </FormGroup>

                <FormButton type="submit" loading={loading}>
                    Add Fuel Record
                </FormButton>
            </form>
        </FormCard>
    );
};

export default FuelForm;
