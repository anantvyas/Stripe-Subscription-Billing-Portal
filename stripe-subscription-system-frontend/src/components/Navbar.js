import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const linkClasses = (path) =>
    `block px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-blue-500 hover:text-white'
    }`;

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex items-center justify-between h-16">
        {/* App Logo/Name */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-extrabold text-blue-400 tracking-wide">
            🚀 Billing Portal
          </span>
        </div>

        {/* Hamburger for mobile */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Nav Links (desktop) */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/features" className={linkClasses('/features')}>
            Features
          </Link>
          <Link to="/dashboard" className={linkClasses('/dashboard')}>
            Dashboard
          </Link>
          <Link to="/profile" className={linkClasses('/profile')}>
            Profile
          </Link>
          <Link to="/billing-history" className={linkClasses('/billing-history')}>
            Billing
          </Link>
          <Link to="/settings" className={linkClasses('/settings')}>
            Settings
          </Link>
          <Link to="/faq" className={linkClasses('/faq')}>
            FAQ
          </Link>
          <Link to="/contact" className={linkClasses('/contact')}>
            Contact  
          </Link>
          <Link to="/admin/login" className={linkClasses('/admin/login')}>
            Admin Login 
          </Link>

          {/* Admin Links */}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className={linkClasses('/admin/dashboard')}>
              Admin Dashboard
            </Link>
          )}

          {user?.email === process.env.REACT_APP_ADMIN_EMAIL && (
            <Link to="/admin/messages" className={linkClasses('/admin/messages')}>
              Admin Messages
            </Link>
          )}

          {/* Auth Links */}
          {!user && (
            <>
              <Link to="/login" className={linkClasses('/login')}>
                Login
              </Link>
              <Link to="/register" className={linkClasses('/register')}>
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="ml-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 space-y-1 bg-gray-900">
          <Link to="/dashboard" className={linkClasses('/dashboard')} onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/profile" className={linkClasses('/profile')} onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          <Link to="/billing-history" className={linkClasses('/billing-history')} onClick={() => setMenuOpen(false)}>
            Billing
          </Link>
          <Link to="/settings" className={linkClasses('/settings')} onClick={() => setMenuOpen(false)}>
            Settings
          </Link>
          <Link to="/faq" className={linkClasses('/faq')} onClick={() => setMenuOpen(false)}>
            FAQ
          </Link>
          <Link to="/contact" className={linkClasses('/contact')} onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          <Link to="/admin/login" className={linkClasses('/admin/login')}
           onClick={() => setMenuOpen(false)}>
            Admin Login
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className={linkClasses('/admin/dashboard')} onClick={() => setMenuOpen(false)}>
              Admin Dashboard
            </Link>
          )}

          {user?.email === process.env.REACT_APP_ADMIN_EMAIL && (
            <Link to="/admin/messages" className={linkClasses('/admin/messages')} onClick={() => setMenuOpen(false)}>
              Admin Messages
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className={linkClasses('/login')} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className={linkClasses('/register')} onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;