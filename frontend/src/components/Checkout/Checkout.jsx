import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../../CartContext/CartContext';
import { API_BASE_URL } from '../../config/api';

const Input = ({ label, name, type = 'text', value, onChange }) => (
  <div>
    <label className='block mb-1 text-amber-100'>{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} required className='w-full bg-[#3a2b3b]/50 rounded-xl px-4 py-2' />
  </div>
);

const PaymentSummary = ({ subtotal, tax, total }) => {
  return (
    <div className='space-y-2 text-amber-100'>
      <div className='flex justify-between'><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
      <div className='flex justify-between'><span>Tax (5%):</span><span>₹{tax.toFixed(2)}</span></div>
      <div className='flex justify-between font-bold'><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
    </div>
  );
};

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    address: '', city: '', zipCode: '', paymentMethod: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const authHeaders = token ? { token: token } : {};

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const orderId = params.get('orderId');

    if (success === 'true' && orderId) {
      axios.post(`${API_BASE_URL}/orders/confirm?session_id=${orderId}`, {}, { headers: authHeaders })
        .then(() => {
          clearCart();
          navigate('/myorder', { replace: true });
        })
        .catch((err) => {
          console.error('Payment confirmation error:', err);
          setError('Payment confirmation failed. Please contact support.');
          clearCart();
        })
        .finally(() => setLoading(false));
    } else if (success === 'false') {
      setError('Payment was cancelled. Please try again.');
      setLoading(false);
    }
  }, [location.search, navigate, clearCart, authHeaders]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (Object.keys(cartItems).length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError(null);

    const subtotal = Number(cartTotal.toFixed(2));
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));
    
    const itemsPayload = cartItems.map(item => ({
      item: {
        _id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl
      },
      quantity: item.quantity
    }));

    const payload = {
      ...formData,
      items: itemsPayload,
      subtotal,
      tax,
      total,
    };

    try {
      const { data } = await axios.post(`${API_BASE_URL}/orders`, payload, { headers: authHeaders });

      if (data.success) {
        if (formData.paymentMethod === 'online' && data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          clearCart();
          navigate('/myorder');
        }
      } else {
        setError(data.message || 'Failed to submit order');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = Number(cartTotal.toFixed(2));
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4'>
      <div className='mx-auto max-w-4xl'>
        <Link className='flex items-center gap-2 text-amber-400 mb-8' to='/cart'>
          <FaArrowLeft /> Back to Cart
        </Link>

        <h1 className='text-4xl font-bold text-center mb-8'>Checkout</h1>

        <form className='grid lg:grid-cols-2 gap-12' onSubmit={handleSubmit}>
          <div className='bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6'>
            <h2 className='text-2xl font-bold text-amber-100'>Personal Information</h2>
            <Input label='First Name' name='firstName' value={formData.firstName} onChange={handleInputChange} />
            <Input label='Last Name' name='lastName' value={formData.lastName} onChange={handleInputChange} />
            <Input label='Phone' name='phone' value={formData.phone} onChange={handleInputChange} />
            <Input label='Email' name='email' type='email' value={formData.email} onChange={handleInputChange} />
            <Input label='Address' name='address' value={formData.address} onChange={handleInputChange} />
            <Input label='City' name='city' value={formData.city} onChange={handleInputChange} />
            <Input label='Zip Code' name='zipCode' value={formData.zipCode} onChange={handleInputChange} />
          </div>

          <div className='bg-[#4b3b3b]/80 p-6 rounded-3xl space-y-6'>
            <h2 className='text-2xl font-bold text-amber-100'>Payment Details </h2>
            <label className='block mb-2 text-amber-100'>Payment Method</label>
            <select name='paymentMethod' value={formData.paymentMethod} onChange={handleInputChange} required className='w-full bg-[#3a2b3b]/50 rounded-xl px-4 py-3 text-amber-100'>
              <option value=''>Select Method</option>
              <option value='cod'>Cash on Delivery</option>
              <option value='online'>Online Payment</option>
            </select>
            <PaymentSummary subtotal={subtotal} tax={tax} total={total} />
            {error && <p className='text-red-400 mt-2'>{error}</p>}
            <button type='submit' disabled={loading} className='w-full bg-gradient-to-r from-red-600 to-amber-600 py-3 rounded-xl font-bold flex justify-center items-center'>
              <span className='mr-2'>{loading ? 'Processing...' : 'Complete Order'}</span>
            </button>
          </div>
        </form>

        <div className='space-y-4 mt-10'>
          <h3 className='text-lg font-semibold text-amber-100'>Your Order Items</h3>
          {cartItems.map((ci) => (
            <div key={ci.cartItemId} className='flex justify-between items-center bg-[#3a2b3b] p-3 rounded-lg'>
              <div className='flex-1'>
                <span className='text-amber-100'>{ci.name}</span>
              </div>
              <span className='ml-2 text-amber-500/80 text-sm'>x{ci.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkout;