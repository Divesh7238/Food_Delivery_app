// Admin API Configuration
export const API_BASE_URL = 'https://bhukkadmebackend.onrender.com/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Items
  items: `${API_BASE_URL}/items`,
  item: (id) => `${API_BASE_URL}/items/${id}`,
  addItem: `${API_BASE_URL}/items/add`,
  updateItem: (id) => `${API_BASE_URL}/items/${id}`,
  deleteItem: (id) => `${API_BASE_URL}/items/${id}`,
  
  // Orders
  // ✅ Updated for fetching all orders
  allOrders: `${API_BASE_URL}/orders/all`, 
  // ✅ Updated for admin order status update
  updateOrderStatusAdmin: (id) => `${API_BASE_URL}/orders/admin/${id}`, 
  
  // Users
  users: `${API_BASE_URL}/user`,
  user: (id) => `${API_BASE_URL}/user/${id}`,
  
  // Admin Auth
  adminLogin: `${API_BASE_URL}/user/admin/login`
};

// Default headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};