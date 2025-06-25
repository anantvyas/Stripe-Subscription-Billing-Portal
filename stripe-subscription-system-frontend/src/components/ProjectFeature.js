// src/pages/ProjectFeatures.js

import React from 'react';

const features = [
  {
    title: '🧑‍💻 User Authentication',
    description: 'Secure signup and login system using JWT with role-based access control for users and admins.'
  },
  {
    title: '📩 Contact Form + Admin View',
    description: 'Messages are stored in the database, emailed to admin, and visible on the admin dashboard.'
  },
  {
    title: '💳 Stripe Payment Integration',
    description: 'Supports recurring subscriptions via Stripe for Basic ($5) and Pro ($15) plans.'
  },
  {
    title: '📈 Admin Dashboard',
    description: 'Beautiful Recharts graphs and stat cards showing revenue, user count, subscription activity.'
  },
  {
    title: '📦 Subscription Webhooks',
    description: 'Stripe webhooks update users’ subscription status and trigger backend payment DB insertions.'
  },
  {
    title: '🛡 Route Protection',
    description: 'Frontend and backend both protect sensitive routes using admin tokens and authentication.'
  },
  {
    title: '🌐 Tech Stack',
    description: 'React, Tailwind CSS, Node.js, Express, MongoDB, Stripe, JWT, Recharts.'
  },
];

function ProjectFeatures() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">✨ Project Features</h1>
      <p className="text-center text-gray-600 mb-12">
        A SaaS-based application with payments, admin tools, and a dashboard — built from scratch using the MERN stack.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feat, idx) => (
          <div key={idx} className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{feat.title}</h2>
            <p className="text-gray-600">{feat.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500">Made with MERN Stack</p>
      </div>
    </div>
  );
}

export default ProjectFeatures;