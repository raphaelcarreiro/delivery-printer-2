import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import DefaultLayout from 'renderer/components/layout/DefaultLayout';

interface ProtectedRouteProps {
  element: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const authenticated = true;

  return <>{authenticated ? <DefaultLayout>{element}</DefaultLayout> : <Navigate to="/login" />}</>;
};

export default ProtectedRoute;
