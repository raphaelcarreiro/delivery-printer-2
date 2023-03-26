import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginScreen from 'renderer/screens/LoginScreen';
import MainScreen from 'renderer/screens/MainScreen';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute element={<LoginScreen />} />} />
      <Route path="/" element={<ProtectedRoute element={<MainScreen />} />} />
    </Routes>
  );
};

export default AppRoutes;
