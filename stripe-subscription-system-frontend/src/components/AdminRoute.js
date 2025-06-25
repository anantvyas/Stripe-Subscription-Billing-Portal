import React from 'react';
import { Navigate } from 'react-router-dom';


function AdminRoute({ children }) {
  //const admin = JSON.parse(localStorage.getItem('admin'));
    const adminToken = localStorage.getItem('adminToken'); // Assuming admin info is stored in localStorage
  if (!adminToken) {
    // If admin not logged in → redirect to admin login page
    return <Navigate to="/admin/login" />;
  }

  // If logged in → show the page
  return children;
}

export default AdminRoute;