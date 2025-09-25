import React from 'react';
import { Navigate } from 'react-router-dom';
import { LOGIN, UNAUTHORIZED } from './router';

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to={LOGIN} replace />;
  }

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={UNAUTHORIZED} replace />;
    }
  }

  // Everything is good, allow access
  return children;
};

export default ProtectedRoute