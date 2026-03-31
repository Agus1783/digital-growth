import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Finance from './pages/Finance';
import Products from './pages/Products';
import Transactions from './pages/Transactions';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/app" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              {/* Dashboard is for OWNER only, CASHIER redirects to POS */}
              <Route index element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="pos" element={<POS />} />
              <Route path="transactions" element={<Transactions />} />
              
              <Route path="finance" element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <Finance />
                </ProtectedRoute>
              } />
              
              <Route path="products" element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <Products />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}
