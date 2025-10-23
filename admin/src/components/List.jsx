// File: admin/src/components/List.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
// ✅ FIX: 'styles' को हटाकर मौजूद एक्सपोर्ट्स (layoutClasses और tableClasses) को इंपोर्ट किया गया
import { layoutClasses, tableClasses } from '../assets/dummyadmin'; 
import { API_ENDPOINTS, getAuthHeaders } from '../config/api'; // API config का उपयोग करें

// API URL को .env से लें
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const List = () => {
  const [items, setItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchItems = async () => {
    try {
      // API_ENDPOINTS का उपयोग करें, या सीधे URL को ठीक करें
      const { data } = await axios.get(`${API_BASE_URL}/api/items`);
      
      // इमेज URL को ठीक करें ताकि वे एडमिन पैनल में दिखें
      const formattedItems = data.map(item => ({
        ...item,
        // सुनिश्चित करें कि इमेज URL में बेस URL ठीक से जोड़ा गया है
        imageUrl: item.imageUrl.startsWith('http') ? item.imageUrl : `${API_BASE_URL}${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`,
      }));
      setItems(formattedItems);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/items/${id}`, {
        headers: getAuthHeaders(), // Admin ऑथराइजेशन हेडर जोड़ें
      });
      setItems(items.filter((item) => item._id !== id));
      setSuccessMessage('Item deleted successfully');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const renderStars = (rating) => {
    // 0 से 5 तक रेटिंग के लिए
    const fullStars = '⭐'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return (
        <>
            <span className="text-yellow-400">{fullStars}</span>
            <span className="text-gray-500">{emptyStars}</span>
        </>
    );
  };

  return (
    // ✅ FIX: styles.pageWrapper को layoutClasses.page से बदला गया
    <div className={layoutClasses.page}> 
      <div className="max-w-7xl mx-auto">
        {/* ✅ FIX: styles.cardContainer को layoutClasses.card से बदला गया */}
        <div className={layoutClasses.card}> 
          {/* ✅ FIX: styles.title को layoutClasses.heading से बदला गया */}
          <h2 className={layoutClasses.heading}>Manage Menu Items</h2> 

          {successMessage && (
            <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded mb-4 text-center border border-green-700/50">
              {successMessage}
            </div>
          )}

          {/* ✅ FIX: styles.tableWrapper को tableClasses.wrapper से बदला गया */}
          <div className={tableClasses.wrapper}>
            {/* ✅ FIX: styles.table को tableClasses.table से बदला गया */}
            <table className={tableClasses.table}> 
              {/* ✅ FIX: styles.thead को tableClasses.headerRow को कंटेन करने के लिए बदला गया */}
              <thead>
                <tr className={tableClasses.headerRow}>
                  {/* ✅ FIX: styles.th को tableClasses.headerCell से बदला गया */}
                  <th className={tableClasses.headerCell}>Image</th>
                  <th className={tableClasses.headerCell}>Name</th>
                  <th className={tableClasses.headerCell}>Category</th>
                  <th className={tableClasses.headerCell}>Price (₹)</th>
                  <th className={tableClasses.headerCell}>Rating</th>
                  <th className={tableClasses.headerCell}>Hearts</th>
                  <th className={tableClasses.headerCell}>Delete</th> 
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  // ✅ FIX: styles.tr को tableClasses.row से बदला गया
                  <tr key={item._id} className={tableClasses.row}> 
                    {/* ✅ FIX: styles.imgCell को tableClasses.cellBase से बदला गया */}
                    <td className={tableClasses.cellBase}> 
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        // सीधे Tailwind क्लास का उपयोग करें या CSS को dummyadmin में परिभाषित करें
                        className="w-16 h-16 object-cover rounded-md shadow" 
                        onError={(e) => { e.target.onerror = null; e.target.src = '/fallback-image.png'; }}
                      />
                    </td>
                    {/* ✅ FIX: styles.nameCell को tableClasses.cellBase से बदला गया */}
                    <td className={tableClasses.cellBase}> 
                      <div className="space-y-1 max-w-sm">
                        <p className="font-medium text-amber-100">{item.name}</p> 
                        <p className="text-xs text-amber-400/60 line-clamp-2">{item.description}</p>
                      </div>
                    </td>
                    {/* ✅ FIX: styles.categoryCell को tableClasses.cellBase से बदला गया */}
                    <td className={tableClasses.cellBase}>{item.category}</td> 
                    {/* ✅ FIX: styles.priceCell को tableClasses.cellBase से बदला गया */}
                    <td className={tableClasses.cellBase}>₹{Number(item.price).toFixed(2)}</td> 
                    {/* ✅ FIX: styles.ratingCell को tableClasses.cellBase से बदला गया */}
                    <td className={tableClasses.cellBase}>
                      <div className="flex gap-1">{renderStars(item.rating || 0)}</div>
                    </td>
                    {/* ✅ FIX: styles.heartsCell को tableClasses.cellBase से बदला गया */}
                    <td className={tableClasses.cellBase}> 
                      <div className="flex items-center gap-2 text-red-400">
                        <FiHeart className="text-xl" />
                        <span>{item.hearts || 0}</span>
                      </div>
                    </td>
                    <td className={`${tableClasses.cellBase} text-center`}>
                      <button
                        onClick={() => handleDelete(item._id)}
                        // सीधे Tailwind क्लास का उपयोग करें
                        className="p-2 rounded-full bg-red-900/30 text-red-400 hover:bg-red-800/50 transition duration-150" 
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              // ✅ FIX: styles.emptyState को एक कस्टम क्लास से बदला गया
              <div className="text-center py-12 text-amber-100/60 text-xl">
                  No items found in the menu
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;