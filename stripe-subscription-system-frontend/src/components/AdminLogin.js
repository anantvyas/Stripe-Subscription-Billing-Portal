import React, { useState } from 'react';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminEmail', data.email);

        setStatus('✅ Admin login successful!');
        window.location.href = '/admin/dashboard'; 
      } else {
        setStatus(`❌ ${data.message || 'Login failed'}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Error logging in');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-xl mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin Email"
          required
          className="w-full border p-3 rounded-xl"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full border p-3 rounded-xl"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
        >
          Login
        </button>
      </form>
       {/* go to user Login */}
        <p className="mt-4 text-center text-sm text-gray-600">
            Not an admin? <a href="/login" className="text-blue-600 hover:underline">User Login</a> 
        </p>
      {/* Display status message */}

      {status && (
        <p className="mt-4 text-center text-lg text-red-600">{status}</p>
      )}
    </div>
  );
}

export default AdminLogin;