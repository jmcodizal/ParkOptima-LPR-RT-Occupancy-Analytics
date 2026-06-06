import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import OwnerDashboard from './OwnerDashboard';
import AttendantDashboard from './AttendantDashboard';
import ProfilePage from './ProfilePage';
import CheckBalanceFlow from './CheckBalanceFlow';

const ProtectedRoute = ({ children, allowedRole }) => {
  const session = JSON.parse(localStorage.getItem('parkoptima_session'));
  const location = useLocation();

  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRole && session.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/check-balance/*" element={<CheckBalanceFlow />} />
      <Route path="/register/:roleType" element={<RegisterPage />} />
      <Route path="/owner/dashboard" element={<ProtectedRoute allowedRole="owner"><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/attendant/dashboard" element={<ProtectedRoute allowedRole="attendant"><AttendantDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;