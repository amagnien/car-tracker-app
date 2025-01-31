import React, { useState, useEffect } from 'react';
import { getExpenses, deleteExpense } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from './LoadingSpinner';
import './styles/ExpenseList.css';
import { formatCurrency, formatDate } from '../utils/formatters';

const ExpenseList = ({ carId }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        if (!user?.uid || !carId) return;

        const unsubscribe = getExpenses(
            user.uid,
            carId,
            (fetchedExpenses) => {
                setExpenses(fetchedExpenses);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching expenses:', error);
                showToast('Error loading expenses', 'error');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user, carId, showToast]);

    const handleDelete = async (expenseId) => {
        try {
            await deleteExpense(user.uid, carId, expenseId);
            showToast('Expense deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting expense:', error);
            showToast('Error deleting expense', 'error');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="expense-list">
            {expenses.length === 0 ? (
                <p className="no-expenses">No expenses recorded yet.</p>
            ) : (
                <div className="expense-grid">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="expense-card">
                            <div className="expense-header">
                                <h3>{expense.description}</h3>
                                <span className="expense-amount">
                                    {formatCurrency(expense.amount)}
                                </span>
                            </div>
                            <div className="expense-details">
                                <p className="expense-date">
                                    {formatDate(expense.date)}
                                </p>
                                <p className="expense-category">
                                    Category: {expense.category}
                                </p>
                            </div>
                            <div className="expense-actions">
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(expense.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExpenseList; 