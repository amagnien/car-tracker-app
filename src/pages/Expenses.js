// src/pages/Expenses.js
import React, { useEffect, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import {getExpenses, deleteExpense} from "../services/dataService";
import { useAuth } from '../hooks/useAuth';


const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
    const { userId } = useAuth();
    useEffect(() => {
      if(userId) {
        const unsubscribe = getExpenses(userId, (expenses) => {
          setExpenses(expenses);
        });

        return () => unsubscribe()
      }

    }, [userId]);

  const handleDeleteExpense = async (expenseId) => {
    if (userId) {
      await deleteExpense(userId, expenseId)
    }
  };


  return (
    <div>
      <h2>Expenses</h2>
      <ExpenseForm />
        <ul>
          {expenses.map((expense) => (
              <li key={expense.id}>
                {expense.description} - ${expense.amount} - {expense.date}
                <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
              </li>
          ))}
        </ul>
    </div>
  );
};

export default ExpensesPage;
