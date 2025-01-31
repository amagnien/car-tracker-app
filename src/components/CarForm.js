import React, { useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import { addCar } from '../services/dataService';
import './styles/CarForm.css';

const CarForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        currentMileage: '',
        imageUrl: ''
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
        if (!formData.make || !formData.model || !formData.licensePlate || !formData.currentMileage) {
            showToast('Please fill in all required fields', 'error');
            return false;
        }
        if (formData.currentMileage < 0) {
            showToast('Mileage cannot be negative', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await addCar({
                ...formData,
                currentMileage: parseFloat(formData.currentMileage),
                year: parseInt(formData.year),
                createdAt: new Date().toISOString()
            }, userId);
            
            onSuccess();
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="car-form">
            <h3>Add New Car</h3>
            
            <div className="form-group">
                <label htmlFor="make">Make *</label>
                <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Toyota"
                />
            </div>

            <div className="form-group">
                <label htmlFor="model">Model *</label>
                <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Camry"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="year">Year *</label>
                    <input
                        type="number"
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="licensePlate">License Plate *</label>
                    <input
                        type="text"
                        id="licensePlate"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleChange}
                        required
                        placeholder="e.g., ABC123"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="currentMileage">Current Mileage (km) *</label>
                <input
                    type="number"
                    id="currentMileage"
                    name="currentMileage"
                    value={formData.currentMileage}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="e.g., 50000"
                />
            </div>

            <div className="form-group">
                <label htmlFor="imageUrl">Image URL (optional)</label>
                <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/car-image.jpg"
                />
            </div>

            <button 
                type="submit" 
                disabled={submitting}
                className={submitting ? 'submitting' : ''}
            >
                {submitting ? 'Adding...' : 'Add Car'}
            </button>
        </form>
    );
};

export default CarForm; 