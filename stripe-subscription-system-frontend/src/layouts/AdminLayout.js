import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;