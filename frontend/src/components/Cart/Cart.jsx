import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../CartContext/CartContext';
import { FaMinus, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const buildImageUrl = (path) => {
  if (!path) return '/fallback-image.png';
  if (path.startsWith('http')) return path;
  if (path.includes('uploads/')) return `${API_URL}/${path.replace(/^\/?/, '')}`;
  return new URL(`../../assets/${path}`, import.meta.url).href; // ✅ लोकल इमेज के लिए सही पाथ
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen overflow-x-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a120b] via-[#3c2a21] to-[#522b1d]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12">
          <span className="font-dancingscript block text-5xl sm:text-6xl md:text-7xl mb-2 bg-gradient-to-r from-amber-400 to-amber-400 bg-clip-text text-transparent">
            Your Cart
          </span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-amber-100/80 text-xl mb-4">Your cart is empty</p>
            <Link
              to="/menu"
              className="bg-amber-900/40 px-6 py-2 rounded-full font-cinzel text-sm uppercase transition-all duration-300 text-amber-100 inline-flex items-center gap-2 hover:bg-amber-800/50"
            >
              Browse All Items
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="group bg-amber-900/20 p-4 rounded-2xl border-4 border-dashed border-amber-500 backdrop-blur-sm flex flex-col items-center gap-4"
                >
                  <div
                    className="w-24 h-24 cursor-pointer relative overflow-hidden rounded-lg"
                    onClick={() => setSelectedImage(buildImageUrl(item.imageUrl))}
                  >
                    <img
                      src={buildImageUrl(item.imageUrl)}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={(e) => (e.currentTarget.src = '/fallback-image.png')}
                    />
                  </div>
                  <div className="w-full text-center">
                    <h3 className="text-xl font-dancingscript text-amber-100">{item.name}</h3>
                    <p className="text-amber-100/80 font-cinzel mt-1">
                      ₹{Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center"
                    >
                      <FaMinus className="w-4 h-4 text-amber-100" />
                    </button>
                    <span className="w-8 text-center text-amber-100">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center"
                    >
                      <FaPlus className="w-4 h-4 text-amber-100" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="bg-amber-900/40 px-3 py-1 rounded-full font-cinzel text-xs uppercase hover:bg-amber-800/50 flex items-center gap-1"
                    >
                      <FaTrash className="w-4 h-4 text-amber-100" />
                      <span className="text-amber-100">Remove</span>
                    </button>
                    <p className="text-sm font-dancingscript text-amber-300">
                      ₹{Number(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-amber-800/30">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                <Link
                  to="/menu"
                  className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/50 text-amber-100"
                >
                  Continue Shopping
                </Link>
                <div className="flex items-center gap-8">
                  <h2 className="text-3xl font-dancingscript text-amber-100">
                    Total: ₹{cartTotal.toFixed(2)}
                  </h2>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/50 text-amber-100"
                  >
                    Checkout Now
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/40 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-full max-h-full">
              <img
                src={selectedImage}
                alt="Full View"
                className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-1 right-1 bg-amber-900/80 rounded-full p-2"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;