import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import DefaultLayout from 'renderer/components/layout/DefaultLayout';
import { useAuth } from 'renderer/providers/auth';

interface ProtectedRouteProps {
  element: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return <>{isAuthenticated() ? <DefaultLayout>{element}</DefaultLayout> : <Navigate to="/login" />}</>;
};

export default ProtectedRoute;
