// src/pages/Analytics.js
import React, { useState, useEffect } from 'react';
import ChartComponent from '../components/ChartComponent';
import DataCard from '../components/DataCard';
import {getExpenses, getFuel} from "../services/dataService";
import { useAuth } from '../hooks/useAuth';

const AnalyticsPage = () => {
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [fuelEfficiency, setFuelEfficiency] = useState(0);
    const [expenseChartData, setExpenseChartData] = useState(null);
    const { userId } = useAuth();


    useEffect(() => {
      if(userId) {
          const fetchExpenses = async () => {
              const unsubscribeExpenses = getExpenses(userId, (expenses) => {
                  if(expenses){
                      const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
                      setTotalExpenses(total);

                      const chartData = {
                          labels: expenses.map(expense => expense.date),
                          datasets: [{
                              label: 'Expenses Over Time',
                              data: expenses.map(expense => expense.amount),
                              backgroundColor: 'rgba(54, 162, 235, 0.5)',
                              borderColor: 'rgba(54, 162, 235, 1)',
                              borderWidth: 1
                          }]
                      };
                      setExpenseChartData(chartData);
                  }
              });
              return () => unsubscribeExpenses()
          }

          const fetchFuel = async () => {
              const unsubscribeFuel = getFuel(userId, (fuelEntries) => {
                  if(fuelEntries && fuelEntries.length > 1){
                      let totalMileage = 0;
                      let totalFuel = 0;
                      for(let i = 1; i < fuelEntries.length; i++){
                          totalMileage += fuelEntries[i].mileage - fuelEntries[i-1].mileage
                          totalFuel += fuelEntries[i].liters
                      }

                      if(totalFuel > 0){
                          const efficiency = totalMileage/totalFuel;
                          setFuelEfficiency(efficiency);
                      } else {
                           setFuelEfficiency(0)
                      }
                  } else{
                      setFuelEfficiency(0);
                  }

              })
              return () => unsubscribeFuel()
          }
        fetchExpenses();
        fetchFuel();
      }
    }, [userId])



  return (
    <div>
      <h2>Analytics</h2>
      <div className="data-card-container">
        <DataCard title="Total Expenses" value={totalExpenses.toFixed(2)} unit="$" />
        <DataCard title="Fuel Efficiency" value={fuelEfficiency.toFixed(2)} unit="km/liter" />
      </div>
      {expenseChartData && <ChartComponent type="line" data={expenseChartData} options={{}} />}
    </div>
  );
};

export default AnalyticsPage;
