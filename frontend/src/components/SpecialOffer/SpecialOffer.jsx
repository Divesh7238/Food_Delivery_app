import React, { useState } from 'react';
import { cardData, additionalData } from '../../assets/dummydata';
import { useCart } from '../../CartContext/CartContext';
import { FaPlus } from 'react-icons/fa';

const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const initialData = [...cardData, ...additionalData];
  const { addToCart, updateQuantity, removeFromCart, cartItems } = useCart();

 
  const getNumericPrice = (price) => {
    if (typeof price === 'string') {
      return parseFloat(price.replace(/[^\d.]/g, ''));
    }
    return price;
  };

  const handleAdd = (item) => {
    addToCart({
      ...item,
      name: item.title,
      price: getNumericPrice(item.price),
    }, 1);
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

  const addButtonBase = 'relative z-10 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-semibold overflow-hidden';
  const addButtonHover = 'hover:bg-amber-600';
  const commonTransition = 'transition-all duration-300 ease-in-out';

  return (
    <div className="bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4 font-[Poppins]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4 transform transition-all bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent font-[Playfair_Display] italic">
            Today’s <span className="text-stroke-gold">Special</span> Offers
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto tracking-wide leading-relaxed">
            Savor the extraordinary with our culinary masterpieces crafted to perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {(showAll ? initialData : initialData.slice(0, 4)).map((item) => {
            const cartItem = cartItems.find(ci => ci.id === item.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            const price = getNumericPrice(item.price);

            return (
              <div
                key={item.id}
                className="relative group bg-[#4b3b3b] rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-all duration-500 hover:shadow-red-900/40 border-2 border-transparent hover:border-amber-500/20 p-4"
              >
                <div className="relative h-56 overflow-hidden rounded-xl mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-500"
                  />
                  <div className="absolute bottom-0 left-1 right-1 flex justify-between items-center text-white bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="flex items-center gap-2 text-amber-400">
                      <span className="text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">⭐</span>
                      <span className="font-bold">{item.rating}</span>
                    </span>
                    <span className="flex items-center gap-2 text-red-400">
                      <i className="fa fa-heart text-xl animate-pulse" />
                      <span className="font-bold">{item.hearts}</span>
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-sm text-gray-300 mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                
                  <span className="text-lg font-bold text-amber-400">₹{price}</span>

                  {quantity > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="bg-red-600 px-2 py-1 rounded-full text-white"
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="bg-green-600 px-2 py-1 rounded-full text-white"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item)}
                      className={`${addButtonBase} ${addButtonHover} ${commonTransition}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      <FaPlus className="text-lg transition-transform inline-block mr-1" />
                      <span className="relative z-10">Add</span>
                      <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent group-hover:border-amber-500/30 transition-all duration-500" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button onClick={() => setShowAll(!showAll)}>
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-700 to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg uppercase tracking-wider hover:gap-4 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 group border-2 border-amber-400/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span>{showAll ? 'Show Less' : 'Show More'}</span>
              <div className="h-full w-1 bg-amber-400/30 absolute right-0 top-0 group-hover:animate-border-pulse" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
