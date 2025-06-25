import React, { useState } from 'react';
import { BASE_URL } from '../xcos'; // Adjust the import path as necessary
function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('✅ Thank you for contacting us!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus(`❌ ${data.message || 'Something went wrong'}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Error sending message');
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-2xl shadow-xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Contact Us</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
          className="w-full border p-3 rounded-xl"
          disabled={loading}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          required
          className="w-full border p-3 rounded-xl"
          disabled={loading}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your Message"
          rows="5"
          required
          className="w-full border p-3 rounded-xl"
          disabled={loading}
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold rounded-xl transition`}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {status && (
        <p
          className={`mt-4 text-center text-lg ${
            status.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default Contact;