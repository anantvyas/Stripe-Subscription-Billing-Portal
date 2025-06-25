import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isCalled = false;

    const verify = async () => {
      if (isCalled) return; // prevent second call

      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (res.ok) {
          if (data.message === 'Email already verified') {
            setStatus('already');
            setMessage('⚠ Email already verified. You can log in.');
          } else {
            setStatus('success');
            setMessage('✅ Email verified successfully! You can now log in.');
            setTimeout(() => {
              window.location.href = '/login'; // redirect to login after 3 seconds
            }, 2000);
          }

        } else {
          setStatus('error');
          setMessage(data.message || '❌ Invalid or expired token');
        }

        isCalled = true;
      } catch (err) {
        setStatus('error');
        setMessage('❌ Something went wrong');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="p-10 max-w-md mx-auto text-center">
      {status === 'verifying' && <p className="text-lg">Verifying your email...</p>}
      {status !== 'verifying' && (
        <p className={`text-xl font-semibold ${
          status === 'success' ? 'text-green-600' :
          status === 'already' ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default VerifyEmail;