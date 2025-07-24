import React, { useState } from 'react';
import { FaRupeeSign } from 'react-icons/fa';
import { FiStar, FiHeart } from 'react-icons/fi';
import axios from 'axios';

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rating: 0,
    hearts: 0,
    total: 0,
    image: null,
    preview: '',
  });

  const [hoverRating, setHoverRating] = useState(0);

  const [categories] = useState([
    'Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Desserts', 'Drinks'
  ]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRating = (star) => {
    setFormData({ ...formData, rating: star });
  };

  const handleHearts = () => {
    setFormData({ ...formData, hearts: formData.hearts + 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key !== 'preview' && val !== null) {
          payload.append(key, val);
        }
      });

      await axios.post('http://localhost:4000/api/items', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        rating: 0,
        hearts: 0,
        total: 0,
        image: null,
        preview: '',
      });
      setHoverRating(0);
      alert('Item added successfully!');
    } catch (err) {
      console.error('Error uploading item:', err.response?.data || err.message);
      alert('Error uploading item!');
    }
  };

  return (
    <div className="min-h-screen bg-[#2a1f18] text-yellow-500 p-6">
      <div className="max-w-4xl mx-auto bg-[#3a2a20] rounded-xl shadow-lg p-10">
        <h2 className="text-2xl font-bold text-center mb-10">Add New Menu Item</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <label className="w-64 h-64 border-2 border-dashed border-yellow-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#4a3a30] transition">
              {formData.preview ? (
                <img
                  src={formData.preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8 text-yellow-500 mb-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 10l-4-4m0 0L8 10m4-4v12"
                    />
                  </svg>
                  <p className="text-sm text-yellow-500">Click to upload product image</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                required
              />
            </label>
          </div>

          <div>
            <label className="block mb-2 text-base sm:text-lg text-amber-400">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 rounded inputField border border-yellow-500 focus:outline-none focus:border-yellow-700"
              placeholder="Enter Product Name"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-base sm:text-lg text-amber-400">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 rounded resize-none border border-yellow-500 focus:outline-none focus:border-yellow-700"
              placeholder="Enter product description"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-base sm:text-lg text-amber-400">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 rounded border border-yellow-500 focus:outline-none focus:border-yellow-700"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#3a2b2b]">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-base sm:text-lg text-amber-400">Price (₹)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaRupeeSign className="text-yellow-500" />
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full pl-10 p-2 rounded border border-yellow-500 focus:outline-none focus:border-yellow-700"
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-base sm:text-lg text-amber-400">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl sm:text-3xl transition-transform hover:scale-110"
                >
                  <FiStar
                    className={
                      star <= (hoverRating || formData.rating)
                        ? 'text-amber-400 fill-current'
                        : 'text-amber-100/30'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-base sm:text-lg text-amber-400">Popularity</label>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleHearts}
                className="text-2xl sm:text-3xl text-amber-400 hover:text-amber-300 transition-colors animate-pulse"
              >
                <FiHeart />
              </button>
              <input
                type="number"
                name="hearts"
                value={formData.hearts}
                onChange={handleInputChange}
                className="w-full p-2 rounded border border-yellow-500 focus:outline-none focus:border-yellow-700"
                placeholder="Enter Likes"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="bg-yellow-500 text-black py-2 px-6 rounded hover:bg-yellow-600 transition"
            >
              Add to Menu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItems;
