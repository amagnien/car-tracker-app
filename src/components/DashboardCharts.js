import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatDate } from '../utils/formatters';
import './styles/DashboardCharts.css';

const DashboardCharts = ({ expensesData, fuelData }) => {
    return (
        <div className="dashboard-charts">
            <div className="chart-container">
                <h3>Monthly Expenses</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={expensesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => formatDate(date, 'MMM')}
                        />
                        <YAxis 
                            tickFormatter={(value) => formatCurrency(value, 'USD', 0)}
                        />
                        <Tooltip 
                            formatter={(value) => formatCurrency(value)}
                            labelFormatter={(date) => formatDate(date)}
                        />
                        <Legend />
                        <Bar 
                            dataKey="amount" 
                            name="Expenses" 
                            fill="var(--primary-color)" 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-container">
                <h3>Fuel Efficiency Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={fuelData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => formatDate(date, 'MMM DD')}
                        />
                        <YAxis 
                            tickFormatter={(value) => `${value}L/100km`}
                        />
                        <Tooltip 
                            formatter={(value) => `${value}L/100km`}
                            labelFormatter={(date) => formatDate(date)}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="efficiency" 
                            name="Fuel Efficiency" 
                            stroke="var(--primary-color)" 
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardCharts; 