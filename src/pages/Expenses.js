// src/pages/Expenses.js
import React, { useEffect, useState, useContext } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { getExpenses, deleteExpense } from "../services/dataService";
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../App';
import CarSelector from '../components/CarSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Expenses.css';

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        if (userId && selectedCarId) {
            const unsubscribe = getExpenses(
                userId,
                selectedCarId,
                (expensesList) => {
                    setExpenses(expensesList);
                    setLoading(false);
                },
                (error) => {
                    showToast(error.message, 'error');
                    setLoading(false);
                }
            );
            return () => unsubscribe();
        }
    }, [userId, selectedCarId, showToast]);

    const handleDeleteExpense = async (expenseId) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await deleteExpense(userId, selectedCarId, expenseId);
                showToast('Expense deleted successfully', 'success');
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    };

    if (loading && selectedCarId) {
        return <LoadingSpinner size="large" />;
    }

    return (
        <div className="expenses-page">
            <h2>Expenses</h2>
            <CarSelector
                selectedCarId={selectedCarId}
                onCarSelect={setSelectedCarId}
            />

            {selectedCarId ? (
                <>
                    <ExpenseForm carId={selectedCarId} />
                    {expenses.length === 0 ? (
                        <p className="no-expenses">No expenses recorded yet. Add your first expense above.</p>
                    ) : (
                        <div className="expenses-list">
                            {expenses.map((expense) => (
                                <div key={expense.id} className="expense-card">
                                    <div className="expense-info">
                                        <h3>{expense.description}</h3>
                                        <p className="date">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </p>
                                        <p className="amount">${expense.amount}</p>
                                        {expense.category && (
                                            <p className="category">{expense.category}</p>
                                        )}
                                        {expense.notes && (
                                            <p className="notes">{expense.notes}</p>
                                        )}
                                    </div>
                                    <div className="expense-actions">
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteExpense(expense.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <p>Please select a car to view and add expenses.</p>
            )}
        </div>
    );
};

export default ExpensesPage;
