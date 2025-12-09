import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './src/contexts/AuthContext';
import { useIdleTimeout } from './src/hooks/useIdleTimeout';
import ProtectedRoute from './src/components/ProtectedRoute';

// Landing page
import Landing from './src/pages/Landing';

// Auth pages
import Login from './src/pages/auth/Login';
import Signup from './src/pages/auth/Signup';
import ForgotPassword from './src/pages/auth/ForgotPassword';
import EmailVerification from './src/pages/auth/EmailVerification';

// Dashboard pages
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import ComplianceChecklist from './pages/ComplianceChecklist';
import DocumentVault from './pages/DocumentVault';
import AIChat from './pages/AIChat';
import Notifications from './pages/Notifications';
import Analytics from './src/pages/Analytics';
import Subscription from './src/pages/Subscription';

// Admin pages
import AdminDashboard from './src/pages/admin/AdminDashboard';
import UserManagement from './src/pages/admin/UserManagement';
import ComplianceMonitoring from './src/pages/admin/ComplianceMonitoring';
import DocumentReview from './src/pages/admin/DocumentReview';
import RegulationsManagement from './src/pages/admin/RegulationsManagement';
import BroadcastAlerts from './src/pages/admin/BroadcastAlerts';

// Component to handle idle timeout inside AuthProvider
const AppContent: React.FC = () => {
  // Enable auto-logout after 10 minutes of inactivity
  useIdleTimeout();

  return (
    <HashRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/landing" element={<Landing />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setup"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compliance"
          element={
            <ProtectedRoute>
              <ComplianceChecklist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentVault />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin', 'Agent']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/compliance"
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin', 'Agent']}>
              <ComplianceMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/documents"
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin', 'Agent']}>
              <DocumentReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/regulations"
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}>
              <RegulationsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alerts"
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'Admin']}>
              <BroadcastAlerts />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;