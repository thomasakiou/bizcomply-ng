import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireVerified?: boolean;
    requiredRole?: 'User' | 'Agent' | 'SuperAdmin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireVerified = false,
    requiredRole
}) => {
    const { currentUser, userProfile, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (requireVerified && !currentUser.emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    if (requiredRole && userProfile?.role !== requiredRole) {
        if (requiredRole === 'SuperAdmin' && userProfile?.role !== 'Agent') {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
