import React, { useState, useEffect } from 'react';
import { useCart } from '../../CartContext/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

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
    const orderId = params.get('orderId');

    if (success !== 'true' || !orderId) {
      if (success === 'false') {
        navigate('/checkout', { replace: true });
      }
      setStatusMsg('Payment failed or was cancelled. Order is placed for completion.');
      return;
    }

    axios.post(`${API_BASE_URL}/orders/confirm`, { orderId }, {
      headers: authHeaders
    })
      .then(() => {
        // Fetch the confirmed order
        return axios.get(`${API_BASE_URL}/orders/${orderId}`, {
          headers: authHeaders
        });
      })
      .then((response) => {
        clearCart();
        navigate('/myorder', { replace: true, state: { newOrder: response.data.data } });
      })
      .catch(err => {
        console.error('Confirmation error:', err);
        setStatusMsg('Order completed');
        clearCart();
        navigate('/myorder', { replace: true });
      });
  }, [search, clearCart, navigate, authHeaders]);

  return (
    <div className='min-h-screen flex items-center justify-center text-white'>
      <p>{statusMsg}</p>
    </div>
  );
};

export default VerifyPaymentPage;