// src/components/MaintenanceForm.js
import React, { useState } from 'react';
import { addMaintenance } from '../services/dataService';
import { useAuth } from '../hooks/useAuth';

const MaintenanceForm = () => {
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
    const { userId } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task || !date || !cost) {
      return
    }
      const maintenanceData = {
          task: task,
          date: date,
          cost: parseFloat(cost),
          notes: notes
      };

    await addMaintenance(maintenanceData, userId);
    setTask('');
    setDate('');
    setCost('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      <input
        type="number"
        placeholder="Cost"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />
        <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
        />
      <button type="submit">Add Maintenance</button>
    </form>
  );
};

export default MaintenanceForm;
