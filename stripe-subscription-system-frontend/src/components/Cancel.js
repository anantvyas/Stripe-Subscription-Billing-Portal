function Cancel() {
  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-6">❌ Payment Cancelled</h1>
      <p className="text-lg mb-4">You have not been charged.</p>
      <a
        href="/dashboard"
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Back to Dashboard
      </a>
    </div>
  );
}

export default Cancel;