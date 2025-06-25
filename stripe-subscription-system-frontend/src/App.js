import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectFeature from './components/ProjectFeature';
// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AdminRoute from './components/AdminRoute';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminMessages from './components/AdminMessages';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Success from './components/Success';
import Cancel from './components/Cancel';
import Profile from './components/Profile';
import BillingHistory from './components/BillingHistory';
import Settings from './components/Settings';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

<Route 
  path="/admin" 
  element={
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  }
>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="messages" element={<AdminMessages />} />
</Route>

        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="success" element={<Success />} />
          <Route path="cancel" element={<Cancel />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />

          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="billing-history"
            element={
              <PrivateRoute>
                <BillingHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="/features" element={<ProjectFeature />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;