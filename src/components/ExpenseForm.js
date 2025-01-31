// src/components/ExpenseForm.js
import React, { useState, useContext } from 'react';
import { addExpense } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import './styles/ExpenseForm.css';

const EXPENSE_CATEGORIES = [
    'Fuel',
    'Maintenance',
    'Insurance',
    'Registration',
    'Parking',
    'Tolls',
    'Accessories',
    'Other'
];

const ExpenseForm = ({ carId }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        category: '',
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
        if (!formData.description || !formData.amount) {
            showToast('Please fill in all required fields', 'error');
            return false;
        }
        if (formData.amount <= 0) {
            showToast('Amount must be greater than zero', 'error');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await addExpense({
                ...formData,
                carId,
                amount: parseFloat(formData.amount)
            }, userId);
            
            setFormData({
                date: new Date().toISOString().split('T')[0],
                amount: '',
                description: '',
                category: '',
                notes: ''
            });
            showToast('Expense added successfully', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
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
                    <label htmlFor="amount">Amount ($) *</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        required
                        placeholder="Enter amount"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter description"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select category</option>
                        {EXPENSE_CATEGORIES.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes about the expense"
                    rows="3"
                />
            </div>

            <button 
                type="submit" 
                disabled={submitting}
                className={submitting ? 'submitting' : ''}
            >
                {submitting ? 'Adding...' : 'Add Expense'}
            </button>
        </form>
    );
};

export default ExpenseForm;
