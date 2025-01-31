import React from 'react';
import { formatCurrency, formatNumber } from '../utils/formatters';
import './styles/DashboardStats.css';

const DashboardStats = ({ stats }) => {
    return (
        <div className="dashboard-stats">
            <div className="stat-card">
                <div className="stat-icon">🚗</div>
                <div className="stat-content">
                    <h3>Total Cars</h3>
                    <p className="stat-value">{stats.totalCars}</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                    <h3>Total Expenses</h3>
                    <p className="stat-value">{formatCurrency(stats.totalExpenses)}</p>
                    <p className="stat-trend">
                        {stats.expensesTrend >= 0 ? '+' : ''}{stats.expensesTrend}% vs last month
                    </p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">⛽</div>
                <div className="stat-content">
                    <h3>Fuel Efficiency</h3>
                    <p className="stat-value">{formatNumber(stats.avgFuelEfficiency)} L/100km</p>
                    <p className="stat-trend">
                        {stats.fuelEfficiencyTrend <= 0 ? '+' : '-'}{Math.abs(stats.fuelEfficiencyTrend)}% vs last month
                    </p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">🔧</div>
                <div className="stat-content">
                    <h3>Next Service</h3>
                    <p className="stat-value">In {formatNumber(stats.nextService)} km</p>
                    <p className="stat-subtitle">{stats.nextServiceCar}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats; 