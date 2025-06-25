// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [paymentsData, setPaymentsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/dashboard-data')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching dashboard data:', err));
  }, []);

  if (!stats) return <p className="text-center p-10">Loading dashboard...
    <Spinner />
  </p>;

  const COLORS = ['#4ade80', '#60a5fa', '#f472b6'];

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Welcome back, Admin!</h1>
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Here's the quick overview of your platform:</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-lg text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-lg text-gray-500">Total Payments</h2>
          <p className="text-3xl font-bold text-green-600">{stats.totalPayments}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h2 className="text-lg text-gray-500">Total Revenue</h2>
          <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">📈 Payments Per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Array.isArray(stats.paymentsPerMonth) ? stats.paymentsPerMonth : []}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">📊 Revenue Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.revenueByPlan}
                dataKey="amount"
                nameKey="plan"
                outerRadius={100}
                label
              >
                {Array.isArray(stats.revenueByPlan) &&
  stats.revenueByPlan.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;