import React, { useState, useEffect } from 'react';
import { useCart } from '../../CartContext/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to import axios

const VerifyPaymentPage = () => {
  const { clearCart } = useCart();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [statusMsg, setStatusMsg] = useState('Verifying Payment...');

  const token = localStorage.getItem('authToken');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const params = new URLSearchParams(search);
    const success = params.get('success');
    const session_id = params.get('session_id');

    // MISSING OR CANCELLED
    if (success !== 'true' || !session_id) {
      if (success === 'false') {
        navigate('/checkout', { replace: true });
      }
      setStatusMsg('Payment failed but order placed for completion.');
      return;
    }

    // STRIPE SUCCESS=TRUE
    axios.get(`http://localhost:4000/api/orders/confirm?session_id=${session_id}`, {
      headers: authHeaders
    })
      .then(() => {
        clearCart();
        navigate('/myorder', { replace: true });
      })
      .catch(err => {
        console.error('Confirmation error:', err);
        setStatusMsg('There was an error confirming payment.');
        clearCart();
      });
  }, [search, clearCart, navigate, authHeaders]);

  return (
    <div className='min-h-screen flex items-center justify-center text-white'>
      <p>{statusMsg}</p>
    </div>
  );
};

export default VerifyPaymentPage;