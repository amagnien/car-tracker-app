// src/App.js
import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import './styles/global.css';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Expenses = React.lazy(() => import('./pages/Expenses'));
const Maintenance = React.lazy(() => import('./pages/Maintenance'));
const Fuel = React.lazy(() => import('./pages/Fuel'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const CarManagement = React.lazy(() => import('./pages/CarManagement'));

function Layout() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner size="large" />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Toast />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/expenses", element: <Expenses /> },
      { path: "/maintenance", element: <Maintenance /> },
      { path: "/fuel", element: <Fuel /> },
      { path: "/analytics", element: <Analytics /> },
      { path: "/settings", element: <Settings /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/cars", element: <CarManagement /> }
    ]
  }
], {
  future: {
    v7_startTransition: true
  }
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
