// src/pages/Expenses.js
import React, { useState, useEffect, useContext } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { getExpenses, deleteExpense } from "../services/dataService";
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../contexts/ToastContext';
import CarSelector from '../components/CarSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Expenses.css';

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [loading, setLoading] = useState(false);
    const { userId } = useAuth();
    const { showToast } = useContext(ToastContext);

    useEffect(() => {
        let unsubscribe = () => {};

        if (userId && selectedCarId) {
            setLoading(true);
            unsubscribe = getExpenses(
                userId,
                selectedCarId,
                (expensesList) => {
                    setExpenses(expensesList);
                    setLoading(false);
                },
                (error) => {
                    console.error('Error fetching expenses:', error);
                    showToast('Error loading expenses', 'error');
                    setLoading(false);
                }
            );
        } else {
            setExpenses([]);
            setLoading(false);
        }

        return () => unsubscribe();
    }, [userId, selectedCarId, showToast]);

    const handleDeleteExpense = async (expenseId) => {
        try {
            await deleteExpense(userId, selectedCarId, expenseId);
            showToast('Expense deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting expense:', error);
            showToast('Error deleting expense', 'error');
        }
    };

    return (
        <div className="expenses-page">
            <h1>Expenses</h1>
            
            <div className="car-selector-container">
                <CarSelector
                    selectedCarId={selectedCarId}
                    onCarSelect={setSelectedCarId}
                />
            </div>

            {selectedCarId && <ExpenseForm carId={selectedCarId} />}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                    {selectedCarId ? (
                        <div className="expenses-list">
                            {expenses.length === 0 ? (
                                <p className="no-expenses">No expenses recorded yet.</p>
                            ) : (
                                expenses.map(expense => (
                                    <div key={expense.id} className="expense-card">
                                        <div className="expense-info">
                                            <h3>{expense.description}</h3>
                                            <p className="category">{expense.category}</p>
                                            <p className="amount">${expense.amount.toFixed(2)}</p>
                                            <p className="date">
                                                {new Date(expense.date).toLocaleDateString()}
                                            </p>
                                            {expense.notes && (
                                                <p className="notes">{expense.notes}</p>
                                            )}
                                        </div>
                                        <div className="expense-actions">
                                            <button
                                                className="button button-danger"
                                                onClick={() => handleDeleteExpense(expense.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <p className="select-car-message">Please select a car to view and add expenses.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ExpensesPage;
