import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireDomain = true }) => {
  const isLoggedIn = localStorage.getItem('aciaLoggedIn') === 'true';
  const selectedDomain = localStorage.getItem('aciaSelectedDomain');

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If domain is required and not selected, redirect to domain selection
  if (requireDomain && !selectedDomain) {
    return <Navigate to="/domains" replace />;
  }

  // Allow access to the protected page
  return children;
};

export default ProtectedRoute;
