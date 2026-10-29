import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Role } from '../lib/types';
import { Button } from './Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const location = useLocation();
  const session = api.getSession();

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display font-bold text-[#B3321F] mb-2">Access Restricted</h1>
        <div className="kesari-rule mx-auto mb-4" />
        <p className="text-sm text-muted mb-6">
          You do not have permission to access this page. Please sign in with an account having the required clearance.
        </p>
        <Link to="/">
          <Button variant="secondary">Return Home</Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
