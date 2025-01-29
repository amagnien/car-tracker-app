// src/components/ExpenseForm.js
import React, { useState } from 'react';
import { addExpense } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';


const ExpenseForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
    const { userId } = useAuth()


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !date ) {
      return
    }
    const expenseData = {
      description: description,
      amount: parseFloat(amount),
      date: date,
    };

    await addExpense(expenseData, userId);
    setDescription('');
    setAmount('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
