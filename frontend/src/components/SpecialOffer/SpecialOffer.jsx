import React, { useState } from "react";
import { cardData, additionalData } from "../../assets/dummydata";
import { useCart } from "../../CartContext/CartContext";
import { FaPlus } from "react-icons/fa";

const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const initialData = [...cardData, ...additionalData];
  const { addToCart, updateQuantity, removeFromCart, cartItems } = useCart();

  const getNumericPrice = (price) => {
    if (typeof price === "string") return parseFloat(price.replace(/[^\d.]/g, "")) || 0;
    return Number(price || 0);
  };

  const handleAdd = (item) => {
    const normalized = {
      ...item,
      id: item.id,
      name: item.title,
      price: getNumericPrice(item.price),
      image: item.image, // ✅ consistent
    };
    addToCart(normalized, 1);
  };

  const handleIncrement = (id, quantity) => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrement = (id, quantity) => {
    if (quantity > 1) updateQuantity(id, quantity - 1);
    else removeFromCart(id);
  };

  const displayList = showAll ? initialData : initialData.slice(0, 4);

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
          {displayList.map((item) => {
            const price = getNumericPrice(item.price);
            const cartEntry = cartItems.find((ci) => ci.id === item.id);
            const quantity = cartEntry?.quantity || 0;

            return (
              <div
                key={item.id}
                className="relative group bg-[#4b3b3b] rounded-3xl overflow-hidden shadow-2xl p-4"
              >
                <div className="relative h-56 overflow-hidden rounded-xl mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover brightness-90"
                  />
                </div>

                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-sm text-gray-300 mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-400">₹{price}</span>

                  {quantity > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrement(item.id, quantity)}
                        className="bg-red-600 px-2 py-1 rounded-full text-white"
                      >
                        −
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => handleIncrement(item.id, quantity)}
                        className="bg-green-600 px-2 py-1 rounded-full text-white"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item)}
                      className="relative z-10 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-all"
                    >
                      <FaPlus className="inline-block mr-1" />
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button onClick={() => setShowAll(!showAll)}>
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-700 to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg uppercase tracking-wider hover:gap-4 hover:scale-105 transition-all">
              <span>{showAll ? "Show Less" : "Show More"}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
