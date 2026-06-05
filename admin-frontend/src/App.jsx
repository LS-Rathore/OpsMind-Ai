import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import MonitoringPage from './pages/MonitoringPage.jsx';
import AuditLogsPage from './pages/AuditLogsPage.jsx';
import SystemHealthPage from './pages/SystemHealthPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import './styles/index.css';

const loadingStyle = {
  backgroundColor: '#0c0c0b',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw',
  color: '#7d8187',
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  fontSize: '18px',
  letterSpacing: '-0.025em',
};

const ProtectedRoute = ({ children }) => {
  const { user, isLoading, isAdmin, logout } = useAuth();

  if (isLoading) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ ...loadingStyle, flexDirection: 'column', gap: '12px' }}>
        <div>Access Denied</div>
        <div style={{ fontSize: '14px', marginBottom: '16px' }}>Admin privileges required</div>
        <button 
          onClick={logout}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: '14px'
          }}
        >
          Sign Out and Try Again
        </button>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
};

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route path="/" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/monitoring" element={<ProtectedRoute><MonitoringPage /></ProtectedRoute>} />
        <Route path="/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
        <Route path="/system-health" element={<ProtectedRoute><SystemHealthPage /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
