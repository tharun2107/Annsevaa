 
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user)

 
  if (!user) {
    return <Navigate to="/login" replace />;
  }

   
  if (roles && !roles.includes(user.role)) {
    console.log("user role:",user.role)
    return <Navigate to="/unauthorized" replace />;
  }

   
  return children;
};

export default ProtectedRoutes;