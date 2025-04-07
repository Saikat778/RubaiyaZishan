// src/components/AdminRoute.tsx

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase'; // Make sure to import your firebase config

interface AdminRouteProps {
  element: JSX.Element;
  adminEmail: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element, adminEmail }) => {
  const [user, loading] = useAuthState(auth); // Get loading state

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while checking auth state
  }

  // Check if user is authenticated
  if (user) {
    console.log("User: ", user); // Log the user object
    console.log("User Email: ", user.email); // Log the user email
    // Check if the user email matches the admin email
    return user.email === adminEmail ? element : <Navigate to="/" />;
  }

  return <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default AdminRoute;
