import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import DomainSelection from './pages/DomainSelection';
import Dashboard from './pages/Dashboard';
import Competitors from './pages/Competitors';
import Updates from './pages/Updates';
import Alerts from './pages/Alerts';
import FeatureComparison from './pages/FeatureComparison';
import Reports from './pages/Reports';

function AppContent() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('aciaLoggedIn') === 'true';
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Show Navbar only when logged in and not on auth pages */}
      {isLoggedIn && !isAuthPage && <Navbar />}
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/domains"
          element={
            <ProtectedRoute requireDomain={false}>
              <DomainSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute requireDomain={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/competitors"
          element={
            <ProtectedRoute requireDomain={true}>
              <Competitors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updates"
          element={
            <ProtectedRoute requireDomain={true}>
              <Updates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute requireDomain={true}>
              <Alerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comparison"
          element={
            <ProtectedRoute requireDomain={true}>
              <FeatureComparison />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute requireDomain={true}>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
