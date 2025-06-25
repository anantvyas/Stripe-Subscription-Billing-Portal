import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import  BASE_URL  from '../xcos'; // Adjust the import path as necessary
const BASIC_PRICE_ID = process.env.REACT_APP_BASIC_PRICE_ID;
const PRO_PRICE_ID = process.env.REACT_APP_PRO_PRICE_ID;

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceCount, setInvoiceCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUser(parsedUser.id);
      fetchInvoiceCount(parsedUser.email);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchUser(userId) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me/${userId}`);
      const data = await res.json();

      if (res.ok) {
        const updatedUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          subscriptionStatus: data.subscriptionStatus,
          subscriptionStartDate: data.subscriptionStartDate, // if your API returns it
          createdAt: data.createdAt, // if your API returns it
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        console.error('Failed to fetch user:', data.message);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchInvoiceCount(email) {
    try {
      const res = await fetch(`${BASE_URL}/api/billing-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setInvoiceCount(data.invoices.length);
      } else {
        console.error('Failed to fetch invoice count');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  }

  if (loading || !user) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        {/* <p className="text-gray-500 text-lg">Loading user...</p> */}
        <Spinner />

      </div>
    );
  }

  const subscriptionStart = new Date(user.subscriptionStartDate || Date.now());
  const daysSinceSubscription = Math.floor(
    (Date.now() - subscriptionStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        👋 Welcome, {user.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Subscription Plan */}
        <div className="border border-gray-300 rounded-xl p-6 shadow hover:shadow-lg transition bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Subscription Plan
          </h2>
          <p
            className={`px-3 py-2 rounded text-white text-lg font-bold inline-block ${
              user.subscriptionStatus === 'pro'
                ? 'bg-green-600'
                : user.subscriptionStatus === 'basic'
                ? 'bg-yellow-500'
                : 'bg-gray-500'
            }`}
          >
            {user.subscriptionStatus.toUpperCase()}
          </p>
        </div>

        {/* Days Since Subscription */}
        <div className="border border-gray-300 rounded-xl p-6 shadow hover:shadow-lg transition bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Days Since Subscription
          </h2>
          <p className="text-2xl text-green-600 font-bold">{daysSinceSubscription} days</p>
        </div>

        {/* Total Invoices */}
        <div className="border border-gray-300 rounded-xl p-6 shadow hover:shadow-lg transition bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Total Invoices Paid
          </h2>
          <p className="text-2xl text-purple-600 font-bold">{invoiceCount}</p>
        </div>
      </div>

      <div className="space-y-3 max-w-xl mx-auto">
        {user.subscriptionStatus === 'free' && (
          <>
            <button
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition"
              onClick={() => handleCheckout(BASIC_PRICE_ID)}
            >
               Upgrade to Basic
            </button>
            <button
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
              onClick={() => handleCheckout(PRO_PRICE_ID)}
            >
               Upgrade to Pro
            </button>
          </>
        )}

        {user.subscriptionStatus === 'basic' && (
          <button
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
            onClick={() => handleCheckout(PRO_PRICE_ID)}
          >
             Upgrade to Pro
          </button>
        )}

        {user.subscriptionStatus === 'pro' && (
          <div className="text-green-600 text-xl font-bold text-center">
            🎉 You are on the <span className="underline">Pro</span> plan!
          </div>
        )}
      </div>
    </div>
  );

  async function handleCheckout(priceId) {
    console.log('sending priceId:', priceId);
    try {
      const response = await fetch(`${BASE_URL}/api/checkout/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          priceId,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Error creating checkout session:', data.error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }
}

export default Dashboard;