import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setName(parsedUser.name);
      fetchUser(parsedUser.id);
    }
  }, []);

  async function fetchUser(userId) {
    if (!userId) return;
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
        setUser(updatedUser);
        setName(updatedUser.name);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        console.error('Failed to fetch user:', data.message);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name,
          password: password || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Profile updated!');
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setEditing(false);
        setPassword('');
      } else {
        setMessage(`❌ ${data.message || 'Update failed'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Update failed');
    }
  };

  if (!user) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-white mb-4">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
          <p className="text-sm text-blue-600 mt-1">Plan: {user.subscriptionStatus}</p>
        </div>

        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="w-full py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition mt-4"
          >
            Edit Profile
          </button>
        )}

        {message && <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>}
      </div>
    </div>
  );
}

export default Profile;