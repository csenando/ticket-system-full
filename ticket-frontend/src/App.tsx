import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { TicketDetail } from './pages/TicketDetail';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { UserManagement } from './pages/UserManagement';
import { MainLayout } from './layouts/MainLayout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    if (user?.role !== 'Administrador') {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="ticket/:id" element={<TicketDetail />} />
                <Route path="admin/analytics" element={
                    <AdminRoute><AnalyticsDashboard /></AdminRoute>
                } />
                <Route path="admin/users" element={
                    <AdminRoute><UserManagement /></AdminRoute>
                } />
            </Route>
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;
