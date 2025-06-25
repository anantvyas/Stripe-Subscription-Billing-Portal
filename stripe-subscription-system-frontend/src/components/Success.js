import React, { useEffect, useState } from 'react';

function Success() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id || parsedUser._id;  // ⭐ FIX HERE ⭐

      // Wait 2 sec for webhook, then fetch latest user
      setTimeout(() => {
        fetchUser(userId);
      }, 2000);
    }
  }, []);

  async function fetchUser(userId) {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/me/${userId}`);
      const data = await res.json();

      if (res.ok) {
        const updatedUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          subscriptionStatus: data.subscriptionStatus,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('✅ Refreshed user:', updatedUser);
      } else {
        console.error('Failed to fetch user:', data.message);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching user:', err);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">✅ Payment Successful!</h1>
        <p className="text-lg mb-4">Updating subscription...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-6">✅ Payment Successful!</h1>
      <p className="text-lg mb-4">Your subscription is now active.</p>
      <a
        href="/dashboard"
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Go to Dashboard
      </a>
    </div>
  );
}

export default Success;