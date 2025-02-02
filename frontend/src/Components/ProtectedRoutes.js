// src/Components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user)

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not allowed, redirect to unauthorized
  if (roles && !roles.includes(user.role)) {
    console.log("user role:",user.role)
    return <Navigate to="/unauthorized" replace />;
  }

  // If the user is authorized, render the children
  return children;
};

export default ProtectedRoutes;