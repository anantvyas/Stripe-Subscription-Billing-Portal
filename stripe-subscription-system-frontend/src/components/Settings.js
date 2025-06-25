import React from 'react';

function Settings() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/delete/${user.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Your account has been deleted.');
        localStorage.removeItem('user');
        window.location.href = '/register';
      } else {
        alert(`❌ ${data.message || 'Failed to delete account'}`);
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('❌ Error deleting account');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600">
        Settings ⚙
      </h1>

      <div className="space-y-6">
        {/* Account Settings */}
        <section className="border border-gray-300 rounded-xl p-6 shadow-sm hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Account Settings
          </h2>

          <div className="space-y-3">
            <button
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
              onClick={() => alert('Change Email feature coming soon!')}
            >
              Change Email
            </button>

            <button
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
              onClick={() => alert('Change Password feature coming soon!')}
            >
              Change Password
            </button>
          </div>
        </section>

        {/* Subscription Settings */}
        <section className="border border-gray-300 rounded-xl p-6 shadow-sm hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Subscription Settings
          </h2>

          <div className="space-y-3">
            <button
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
              onClick={() => alert('Cancel Subscription feature coming soon!')}
            >
              Cancel Subscription
            </button>
          </div>
        </section>

        {/* Notification Settings
        <section className="border border-gray-300 rounded-xl p-6 shadow-sm hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Notification Settings
          </h2>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">Email me about new features</span>
            </label>

            <label className="flex items-center space-x-3">
              <input type="checkbox" className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">Email me about promotions</span>
            </label>
          </div>
        </section> */}

        {/* Danger Zone - Delete Account */}
        <section className="border border-red-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition bg-red-50">
          <h2 className="text-2xl font-semibold mb-4 text-red-700">
            Danger Zone ⚠
          </h2>

          <button
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
            onClick={handleDeleteAccount}
          >
            Delete My Account
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;