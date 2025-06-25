import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';
import { BASE_URL } from '../xcos'; // Adjust the import path as necessary
function BillingHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingHistory = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return;

      try {
        const response = await fetch(`${BASE_URL}/api/billing-history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await response.json();

        if (response.ok) {
          setInvoices(data.invoices);
        } else {
          console.error('Failed to fetch billing history');
        }
      } catch (err) {
        console.error('Error:', err);
      }

      setLoading(false);
    };

    fetchBillingHistory();
  }, []);

  if (loading) {
    return (
      // <div className="p-8 max-w-3xl mx-auto text-center text-lg">
      //   Loading billing history...
      // </div>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Billing History</h1>
        <Spinner /> 
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Billing History</h1>

      {invoices.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No invoices found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Invoice ID</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-mono text-blue-700">{invoice.id}</td>
                  <td className="p-4 font-semibold text-green-600">
                    ${(invoice.amount_paid / 100).toFixed(2)}
                  </td>
                  <td
                    className={`p-4 font-medium ${
                      invoice.status === 'paid'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {invoice.status}
                  </td>
                  <td className="p-4 text-gray-700">
                    {new Date(invoice.created * 1000).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BillingHistory;