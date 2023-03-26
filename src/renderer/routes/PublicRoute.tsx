import AuthLayout from 'renderer/components/layout/AuthLayout';
import React, { ReactNode } from 'react';

interface ProtectedRouteProps {
  element: ReactNode;
}

const PublicRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  return <AuthLayout>{element}</AuthLayout>;
};

export default PublicRoute;
