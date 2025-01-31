// src/components/FuelForm.js
import React, { useState, useContext } from 'react';
import { addFuel } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import CarSelector from './CarSelector';
import './styles/FuelForm.css';

const FuelForm = () => {
    const [formData, setFormData] = useState({
        carId: '',
        date: new Date().toISOString().split('T')[0],
        liters: '',
        pricePerLiter: '',
        mileage: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.carId) {
            showToast('Please select a car', 'error');
            return false;
        }
        if (!formData.liters || !formData.pricePerLiter || !formData.mileage) {
            showToast('Please fill in all fields', 'error');
            return false;
        }
        if (formData.liters <= 0 || formData.pricePerLiter <= 0 || formData.mileage <= 0) {
            showToast('Please enter valid positive numbers', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await addFuel({
                ...formData,
                liters: parseFloat(formData.liters),
                pricePerLiter: parseFloat(formData.pricePerLiter),
                mileage: parseFloat(formData.mileage)
            }, userId);
            
            setFormData({
                carId: '',
                date: new Date().toISOString().split('T')[0],
                liters: '',
                pricePerLiter: '',
                mileage: ''
            });
            showToast('Fuel record added successfully', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="fuel-form">
            <CarSelector
                selectedCarId={formData.carId}
                onCarSelect={(carId) => setFormData(prev => ({ ...prev, carId }))}
            />
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="liters">Liters</label>
                    <input
                        type="number"
                        id="liters"
                        name="liters"
                        value={formData.liters}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                        placeholder="Enter liters"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="pricePerLiter">Price per Liter ($)</label>
                    <input
                        type="number"
                        id="pricePerLiter"
                        name="pricePerLiter"
                        value={formData.pricePerLiter}
                        onChange={handleChange}
                        step="0.001"
                        min="0"
                        required
                        placeholder="Enter price per liter"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mileage">Mileage (km)</label>
                    <input
                        type="number"
                        id="mileage"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        step="1"
                        min="0"
                        required
                        placeholder="Enter current mileage"
                    />
                </div>
            </div>
            <button 
                type="submit" 
                disabled={submitting}
                className={submitting ? 'submitting' : ''}
            >
                {submitting ? 'Adding...' : 'Add Fuel Record'}
            </button>
        </form>
    );
};

export default FuelForm;
