import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const location = useLocation();

  const linkClasses = (path) =>
    `block px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium ${
      location.pathname === path
        ? 'bg-purple-600 text-white'
        : 'text-gray-300 hover:bg-purple-500 hover:text-white'
    }`;

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-extrabold text-purple-400 tracking-wide">
            🛠 Admin Panel
          </span>
        </div>

        <div className="flex space-x-6 items-center">
          <Link to="/admin/dashboard" className={linkClasses('/admin/dashboard')}>
            Dashboard
          </Link>
          {/* <Link to="/admin/users" className={linkClasses('/admin/users')}>
            Users
          </Link>
          <Link to="/admin/payments" className={linkClasses('/admin/payments')}>
            Payments
          </Link> */}
            <Link to="/admin/messages" className={linkClasses('/admin/messages')}>
                Admin Messages
            </Link>

          <button
            onClick={handleLogout}
            className="ml-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;