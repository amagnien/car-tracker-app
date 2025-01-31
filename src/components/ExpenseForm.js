// src/components/ExpenseForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { addExpense } from '../services/expenseService';
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
    const { user } = useAuth();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await addExpense({
                ...data,
                carId,
                userId: user.uid,
                amount: parseFloat(data.amount),
                date: new Date(data.date).toISOString(),
                createdAt: new Date().toISOString()
            });
            reset();
            onSuccess?.();
        } catch (error) {
            console.error('Error adding expense:', error);
            throw error;
        }
    };

    return (
        <form className="expense-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        id="description"
                        type="text"
                        {...register('description', { required: 'Description is required' })}
                        className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-message">{errors.description.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        {...register('category', { required: 'Category is required' })}
                        className={errors.category ? 'error' : ''}
                    >
                        <option value="">Select category</option>
                        {EXPENSE_CATEGORIES.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {errors.category && <span className="error-message">{errors.category.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Amount ($)</label>
                    <input
                        id="amount"
                        type="number"
                        step="0.01"
                        {...register('amount', {
                            required: 'Amount is required',
                            min: { value: 0.01, message: 'Amount must be greater than 0' }
                        })}
                        className={errors.amount ? 'error' : ''}
                    />
                    {errors.amount && <span className="error-message">{errors.amount.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="date"
                        {...register('date', { required: 'Date is required' })}
                        className={errors.date ? 'error' : ''}
                    />
                    {errors.date && <span className="error-message">{errors.date.message}</span>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    {...register('notes')}
                    rows="3"
                />
            </div>

            <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Adding Expense...' : 'Add Expense'}
            </button>
        </form>
    );
};

export default ExpenseForm;
