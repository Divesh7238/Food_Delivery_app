// API Configuration
export const API_BASE_URL = 'http://localhost:4000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Items
  items: `${API_BASE_URL}/items`,
  item: (id) => `${API_BASE_URL}/items/${id}`,
  
  // Users
  login: `${API_BASE_URL}/user/login`,
  register: `${API_BASE_URL}/user/register`,
  profile: `${API_BASE_URL}/user/profile`,
  
  // Cart
  cart: `${API_BASE_URL}/cart`,
  cartItems: (userId) => `${API_BASE_URL}/cart/${userId}`,
  
  // Orders
  orders: `${API_BASE_URL}/orders`,
  userOrders: (userId) => `${API_BASE_URL}/orders/user/${userId}`,
  
  // Contact
  contact: `${API_BASE_URL}/contact`
};

// Default headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
