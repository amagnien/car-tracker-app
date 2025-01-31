// src/components/ExpenseForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { addExpense } from '../services/dataService';
import { useToast } from '../hooks/useToast';
import './styles/ExpenseForm.css';

const EXPENSE_CATEGORIES = [
    'Fuel',
    'Maintenance',
    'Insurance',
    'Registration',
    'Repairs',
    'Accessories',
    'Other'
];

const ExpenseForm = ({ carId, onSuccess }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { user } = useAuth();
    const { showToast } = useToast();

    const onSubmit = async (data) => {
        try {
            await addExpense(user.uid, carId, {
                ...data,
                amount: Number(data.amount),
                date: new Date(data.date).toISOString()
            });
            showToast('Expense added successfully', 'success');
            reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error adding expense:', error);
            showToast('Error adding expense', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="expense-form">
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                    id="description"
                    type="text"
                    {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <span className="error">{errors.description.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...register('amount', { 
                        required: 'Amount is required',
                        min: { value: 0.01, message: 'Amount must be greater than 0' }
                    })}
                />
                {errors.amount && <span className="error">{errors.amount.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    {...register('category', { required: 'Category is required' })}
                >
                    <option value="">Select a category</option>
                    {EXPENSE_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                {errors.category && <span className="error">{errors.category.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                    id="date"
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                />
                {errors.date && <span className="error">{errors.date.message}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                    id="notes"
                    {...register('notes')}
                />
            </div>

            <button type="submit" className="submit-button">Add Expense</button>
        </form>
    );
};

export default ExpenseForm;
