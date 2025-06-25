// src/components/AdminMessages.js

import React, { useEffect, useState } from 'react';

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch('http://localhost:5000/api/admin/messages/all', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setLoading(false);
    }
  }

  async function markAsRead(id) {
    try {
      await fetch(`http://localhost:5000/api/admin/messages/mark-read/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      fetchMessages();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">📩 Admin Messages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Message</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="text-center">
                <td className="border px-4 py-2">{msg.name}</td>
                <td className="border px-4 py-2">{msg.email}</td>
                <td className="border px-4 py-2">{msg.message}</td>
                <td className="border px-4 py-2">
                  {new Date(msg.createdAt).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {msg.isRead ? '✅ Read' : '🟡 Unread'}
                </td>
                <td className="border px-4 py-2">
                  {!msg.isRead && (
                    <button
                      onClick={() => markAsRead(msg._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Mark as Read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminMessages;