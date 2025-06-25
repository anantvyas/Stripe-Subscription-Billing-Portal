import React from 'react';
import { Navigate } from 'react-router-dom';
function PrivateRoute({ children }) {
  const user = localStorage.getItem('user');
  if(!user){
    // User is not logged in, redirect to login page
    return <Navigate to="/login"/>;  
  }
  return children;
  
}
export default PrivateRoute;