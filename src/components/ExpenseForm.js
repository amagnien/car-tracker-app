// src/components/ExpenseForm.js
import React, { useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import { addExpense } from '../services/dataService';
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

const EXPENSE_CATEGORIES = [
    'Insurance',
    'Registration',
    'Parking',
    'Tolls',
    'Car Wash',
    'Accessories',
    'Repairs',
    'Tires',
    'Other'
];

const ExpenseForm = () => {
    const [formData, setFormData] = useState({
        carId: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        description: '',
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
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.carId) newErrors.carId = 'Please select a car';
        if (!formData.amount) newErrors.amount = 'Amount is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await addExpense({
                ...formData,
                amount: parseFloat(formData.amount)
            }, userId);
            
            showToast('Expense added successfully', 'success');
            setFormData(prev => ({
                ...prev,
                amount: '',
                category: '',
                description: '',
                notes: ''
            }));
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormCard title="Add Expense">
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
                        <FormLabel htmlFor="amount" required>Amount ($)</FormLabel>
                        <FormInput
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="e.g., 50.00"
                            error={errors.amount}
                        />
                    </FormGroup>
                </FormRow>

                <FormRow>
                    <FormGroup>
                        <FormLabel htmlFor="category" required>Category</FormLabel>
                        <FormSelect
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            error={errors.category}
                        >
                            <option value="">Select category</option>
                            {EXPENSE_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </FormSelect>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="description" required>Description</FormLabel>
                        <FormInput
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the expense"
                            error={errors.description}
                        />
                    </FormGroup>
                </FormRow>

                <FormGroup>
                    <FormLabel htmlFor="notes">Notes</FormLabel>
                    <FormTextarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Additional details about the expense..."
                        rows="3"
                    />
                </FormGroup>

                <FormButton type="submit" loading={loading}>
                    Add Expense
                </FormButton>
            </form>
        </FormCard>
    );
};

export default ExpenseForm;
