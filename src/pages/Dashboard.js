import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserCars, getRecentFuel, getRecentMaintenance, getRecentExpenses, getExpenses, getCars } from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardStats from '../components/DashboardStats';
import DashboardCharts from '../components/DashboardCharts';
import '../styles/Dashboard.css';
import { ToastContext } from '../contexts/ToastContext';

const Dashboard = () => {
    const [cars, setCars] = useState([]);
    const [recentFuel, setRecentFuel] = useState([]);
    const [recentMaintenance, setRecentMaintenance] = useState([]);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalExpenses: 0,
        expensesTrend: 0,
        avgFuelEfficiency: 0,
        fuelEfficiencyTrend: 0,
        nextService: 5000,
        nextServiceCar: 'No cars registered'
    });

    useEffect(() => {
        if (!user?.uid) return;

        const fetchCars = async () => {
            try {
                const cars = await getCars(user.uid);
                setCars(cars || []);
            } catch (error) {
                console.error('Error fetching cars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [user]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.uid) return;

            try {
                // Fetch cars and their recent data
                const unsubscribeCars = getUserCars(user.uid, (carsList) => {
                    setCars(carsList);
                    setLoading(false);
                });

                // Fetch expenses and calculate stats
                const unsubscribeExpenses = getExpenses(user.uid, null, (expenses) => {
                    if (expenses) {
                        // Calculate stats from expenses
                        const total = expenses.reduce((acc, exp) => acc + exp.amount, 0);
                        
                        setStats(prev => ({
                            ...prev,
                            totalExpenses: total,
                            // Add other calculations as needed
                        }));
                    }
                });

                return () => {
                    unsubscribeCars();
                    unsubscribeExpenses();
                };
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

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

            <DashboardStats stats={stats} />
            <DashboardCharts />

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