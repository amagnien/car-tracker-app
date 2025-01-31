// src/components/MaintenanceForm.js
import React, { useState, useContext } from 'react';
import { addMaintenance } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import './styles/MaintenanceForm.css';

const MaintenanceForm = ({ carId }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        serviceType: '',
        cost: '',
        mileage: '',
        notes: ''
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
        if (!formData.serviceType || !formData.cost || !formData.mileage) {
            showToast('Please fill in all required fields', 'error');
            return false;
        }
        if (formData.cost <= 0 || formData.mileage <= 0) {
            showToast('Cost and mileage must be positive numbers', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await addMaintenance({
                ...formData,
                carId,
                cost: parseFloat(formData.cost),
                mileage: parseFloat(formData.mileage)
            }, userId);
            
            setFormData({
                date: new Date().toISOString().split('T')[0],
                serviceType: '',
                cost: '',
                mileage: '',
                notes: ''
            });
            showToast('Maintenance record added successfully', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="maintenance-form">
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="date">Date *</label>
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
                    <label htmlFor="serviceType">Service Type *</label>
                    <input
                        type="text"
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Oil Change"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cost">Cost ($) *</label>
                    <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                        placeholder="Enter cost"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mileage">Mileage (km) *</label>
                    <input
                        type="number"
                        id="mileage"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        min="0"
                        required
                        placeholder="Current mileage"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional details about the service"
                    rows="3"
                />
            </div>

            <button 
                type="submit" 
                disabled={submitting}
                className={submitting ? 'submitting' : ''}
            >
                {submitting ? 'Adding...' : 'Add Maintenance Record'}
            </button>
        </form>
    );
};

export default MaintenanceForm;
