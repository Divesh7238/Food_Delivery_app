import React, { useState, useEffect } from 'react';
import { useCart } from '../../CartContext/CartContext';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './OurHomeMenu.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'https://bhukkadmebackend.onrender.com';

const OurHomeMenu = () => {
  const [menuData, setMenuData] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    axios.get(`${API_BASE}/api/items`)
      .then(res => {
        const grouped = (res.data || []).reduce((acc, item) => {
          const c = item.category || 'Others';
          acc[c] = acc[c] || [];
          acc[c].push(item);
          return acc;
        }, {});
        setMenuData(grouped);
        const keys = Object.keys(grouped);
        setCategories(keys);
        setActiveCategory(keys[0] || '');
      })
      .catch(console.error);
  }, []);

  const displayItems = (menuData[activeCategory] || []).slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200">
          <span className="font-dancingscript block text-5xl md:text-7xl sm:text-6xl mb-2">
            Our Exquisite Menu
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-amber-100/80">
            A Symphony of Flavours
          </span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-6 py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm sm:text-lg tracking-widest backdrop-blur-sm
                ${activeCategory === cat
                  ? 'bg-gradient-to-r from-amber-900/80 to-amber-700/80 border-amber-800 scale-105 shadow-xl text-amber-100'
                  : 'bg-amber-900/20 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 hover:text-amber-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {displayItems.map((item, i) => {
            const id = item._id || item.id;
            const cartEntry = cartItems.find(ci => ci.id === id);
            const quantity = cartEntry?.quantity || 0;
            const cartItemId = cartEntry?.cartItemId;

            const imageUrl = (item.imageUrl && item.imageUrl.startsWith('http'))
              ? item.imageUrl
              : `${API_BASE}${item.imageUrl || ''}`;

            return (
              <div
                key={id}
                className="relative bg-amber-900/20 rounded-2xl overflow-hidden border border-amber-800/30 backdrop-blur-sm flex flex-col transition-all duration-500"
                style={{ zIndex: i }}
              >
                <div className="relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-black/10">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain transition-all duration-700"
                    onError={e => (e.currentTarget.src = '/fallback-image.png')}
                  />
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-amber-100">{item.name}</h3>
                  <p className="text-amber-100/80 text-xs sm:text-sm mb-4 font-cinzel leading-relaxed">{item.description}</p>

                  <div className="mt-auto flex items-center gap-4 justify-between">
                    <div className="bg-amber-100/10 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg">
                      <span className="text-xl font-bold text-amber-300 font-dancingscript">₹{item.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    {quantity > 0 ? (
                      <>
                        <button
                          onClick={() => quantity > 1 ? updateQuantity(cartItemId, quantity - 1) : removeFromCart(cartItemId)}
                          className="bg-amber-300 hover:bg-amber-400 text-amber-900 font-bold py-1 px-3 rounded-full shadow"
                        >
                          <FaMinus />
                        </button>
                        <span className="w-8 text-center text-amber-100">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(cartItemId, quantity + 1)}
                          className="bg-amber-300 hover:bg-amber-400 text-amber-900 font-bold py-1 px-3 rounded-full shadow"
                        >
                          <FaPlus />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => addToCart({ ...item, id, imageUrl }, 1)} // ✅ Correctly passing imageUrl
                        className="bg-amber-300 hover:bg-amber-400 text-amber-900 font-bold py-1 px-3 rounded-full shadow"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-16">
          <Link
            className="bg-amber-900/30 border-2 border-amber-800/30 text-amber-100 px-8 sm:px-10 py-3 rounded-full font-cinzel uppercase tracking-widest transition-all hover:bg-amber-800/40"
            to="/menu"
          >
            Explore Full Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurHomeMenu;