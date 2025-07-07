import React, { useState } from 'react';
import { cardData, additionalData } from '../../assets/dummydata'
import { useCart } from '../../CartContext/CartContext';

const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const initialData = [...cardData, ...additionalData];
  const { addToCart, updateQuantity, removeFromCart, cartItems } = useCart();

  const handleAdd = (item) => {
    addToCart(item, 1);
  };

  const handleIncrement = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    updateQuantity(itemId, (item?.quantity || 0) + 1);
  };

  const handleDecrement = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else {
      removeFromCart(itemId);
    }
  };

  return (
    <div className='bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4 font-[Poppins]'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-14'>
          <h1 className='text-5xl font-bold mb-4 transform transition-all bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent font-[Playfair_Display] italic'>
            Today’s <span className='text-stroke-gold'>Special</span> Offers
          </h1>
          <p className='text-lg text-gray-300 max-w-3xl mx-auto tracking-wide leading-relaxed'>
            Savor the extraordinary with our culinary masterpieces crafted to perfection.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {(showAll ? initialData : initialData.slice(0, 4)).map((item) => {
            const cartItem = cartItems.find(ci => ci.id === item.id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <div
                key={item.id}
                className='relative group bg-[#4b3b3b] rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-all duration-500 hover:shadow-red-900/40 border-2 border-transparent hover:border-amber-500/20 p-4'
              >
                <div className='relative h-56 overflow-hidden rounded-xl mb-4'>
                  <img src={item.image} alt={item.title} className='w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-500' />
                </div>
                <h2 className='text-xl font-semibold mb-2'>{item.title}</h2>
                <p className='text-sm text-gray-300 mb-4'>{item.description}</p>
                <div className='flex items-center justify-between'>
                  <span className='text-lg font-bold text-amber-400'>₹{item.price}</span>

                  {quantity > 0 ? (
                    <div className='flex items-center gap-2'>
                      <button onClick={() => handleDecrement(item.id)} className='bg-red-600 px-2 py-1 rounded-full text-white'>−</button>
                      <span>{quantity}</span>
                      <button onClick={() => handleIncrement(item.id)} className='bg-green-600 px-2 py-1 rounded-full text-white'>+</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item)}
                      className='bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm'
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className='text-center mt-10'>
          <button
            onClick={() => setShowAll(prev => !prev)}
            className='text-amber-400 hover:text-white border border-amber-400 px-6 py-2 rounded-full transition'
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
