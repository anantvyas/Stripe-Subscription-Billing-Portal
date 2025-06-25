// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Column 1: App Info */}
        <div>
          <h2 className="text-xl font-bold text-blue-400 mb-2">Subscription Billing Portal 🚀</h2>
          <p className="text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <p className="text-sm">support@example.com</p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li><Link to="/profile" className="hover:text-white">Profile</Link></li>
            <li><Link to="/billing-history" className="hover:text-white">Billing History</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Column 3: About */}
        <div>
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p className="text-sm">
            This is a demo subscription billing app built with React, Node.js, Express, MongoDB & Stripe. For learning purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;