import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getCars, getRecentFuel, getRecentMaintenance, getRecentExpenses } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [cars, setCars] = useState([]);
    const [recentFuel, setRecentFuel] = useState([]);
    const [recentMaintenance, setRecentMaintenance] = useState([]);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userId) return;

            try {
                // Fetch cars and their recent data
                const unsubscribeCars = getCars(userId, (carsList) => {
                    setCars(carsList);
                    setLoading(false);
                });

                return () => {
                    unsubscribeCars();
                };
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [userId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
                <Link to="/cars" className="button button-primary">
                    Add New Car
                </Link>
            </header>

            <div className="dashboard-stats grid grid-cols-4">
                <div className="stat-card">
                    <h3>Total Cars</h3>
                    <p className="stat-value">{cars.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Expenses</h3>
                    <p className="stat-value">
                        ${recentExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                    </p>
                </div>
                <div className="stat-card">
                    <h3>Fuel Efficiency</h3>
                    <p className="stat-value">
                        {calculateAverageFuelEfficiency(recentFuel)} L/100km
                    </p>
                </div>
                <div className="stat-card">
                    <h3>Next Service</h3>
                    <p className="stat-value">In {calculateNextService(cars)} km</p>
                </div>
            </div>

            <div className="dashboard-content grid grid-cols-2 gap-lg">
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>My Cars</h2>
                        <Link to="/cars" className="button button-secondary">View All</Link>
                    </div>
                    <div className="cars-grid">
                        {cars.map(car => (
                            <div key={car.id} className="car-card">
                                <div className="car-image">
                                    {car.imageUrl ? (
                                        <img src={car.imageUrl} alt={`${car.make} ${car.model}`} />
                                    ) : (
                                        <div className="placeholder-image">🚗</div>
                                    )}
                                </div>
                                <div className="car-info">
                                    <h3>{car.year} {car.make} {car.model}</h3>
                                    <p className="license-plate">{car.licensePlate}</p>
                                    <p className="mileage">{car.currentMileage} km</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Activity</h2>
                    </div>
                    <div className="activity-list">
                        {[...recentMaintenance, ...recentFuel, ...recentExpenses]
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 5)
                            .map((activity, index) => (
                                <div key={index} className="activity-card">
                                    <div className="activity-icon">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="activity-details">
                                        <h4>{activity.description || activity.serviceType}</h4>
                                        <p className="activity-date">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="activity-amount">
                                        ${activity.amount || activity.cost}
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

// Helper functions
const calculateAverageFuelEfficiency = (fuelRecords) => {
    if (fuelRecords.length === 0) return "N/A";
    const efficiency = fuelRecords.reduce((sum, record) => sum + record.liters / (record.mileage / 100), 0) / fuelRecords.length;
    return efficiency.toFixed(1);
};

const calculateNextService = (cars) => {
    if (cars.length === 0) return "N/A";
    // Simple example - return the lowest remaining distance to next service
    return Math.min(...cars.map(car => 5000 - (car.currentMileage % 5000)));
};

const getActivityIcon = (type) => {
    switch (type) {
        case 'fuel': return '⛽';
        case 'maintenance': return '🔧';
        case 'expense': return '💰';
        default: return '📝';
    }
};

export default Dashboard; 