// File: admin/src/components/Order.jsx (Final Code)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  layoutClasses,
  tableClasses,
  statusStyles,
  paymentMethodDetails,
} from '../assets/dummyadmin'; // Import necessary styles

// API URL को .env से लें
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Fetch all orders using the correct /all route
      const response = await axios.get(`${API_BASE_URL}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`, // Use adminToken
        },
      });

      const fetchedOrders = Array.isArray(response.data) ? response.data : [];

      const formatted = fetchedOrders.map((order) => {
        // Customer Name को user object से या checkout details से लें
        const customerName = order.user?.username || `${order.firstName || ''} ${order.lastName || ''}`.trim();
        const customerEmail = order.user?.email || order.email || 'N/A';
        const customerPhone = order.user?.phone || order.phone || 'N/A';

        // Order Total Calculations (if coming directly from DB)
        const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);
        const totalPrice = order.total || order.items.reduce((s, i) => s + (i.item.price * i.quantity), 0);

        return ({
          ...order,
          customerName,
          customerEmail,
          customerPhone,
          address: order.address || order.shippingAddress?.address || '',
          city: order.city || order.shippingAddress?.city || '',
          zipCode: order.zipCode || order.shippingAddress?.zipCode || '',
          totalItems,
          totalPrice,
          createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      });

      setOrders(formatted);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders. Check if backend is running or you are logged in as admin.');
      setOrders([]); // Clear existing orders on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for admin token before fetching
    if (!localStorage.getItem('adminToken')) {
        setError('Admin not logged in. Please refresh to login.');
        setLoading(false);
        return;
    }
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/orders/admin/${orderId}`, {
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      setOrders((orders) =>
        orders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
      fetchOrders();
    }
  };
  
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return '/fallback-image.png';
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(API_BASE_URL, '').replace(/^\/?/, '');
    return `${API_BASE_URL}${cleanPath.startsWith('/uploads') ? '' : '/uploads'}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
  };


  return (
    <div className={layoutClasses.page}>
      <div className="mx-auto max-w-7xl">
        <div className={layoutClasses.card}>
          <h2 className={layoutClasses.heading}>Order Management</h2>

          {error && <p className="text-red-400 p-4 bg-red-900/20 rounded-lg">{error}</p>}
          {loading ? (
            <p className="text-amber-100/80 text-center py-12">Loading orders...</p>
          ) : (
            <div className={tableClasses.wrapper}>
              <table className={tableClasses.table}>
                <thead>
                  <tr className={tableClasses.headerRow}>
                    {[
                      'Order ID',
                      'Customer',
                      'Address',
                      'Items',
                      'Total Items',
                      'Price (₹)',
                      'Payment',
                      'Status',
                    ].map((h) => (
                      <th
                        key={h}
                        className={
                          tableClasses.headerCell +
                          (h === 'Total Items' ? ' text-center' : '')
                        }
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    
                    const payMethod =
                      paymentMethodDetails[
                        order.paymentMethod?.toLowerCase?.()
                      ] || paymentMethodDetails.default;

                    const payStatusStyle =
                      statusStyles[order.paymentStatus] ||
                      statusStyles.pending;
                    const statusStyle =
                      statusStyles[order.status] || statusStyles.processing;

                    return (
                      <tr key={order._id} className={tableClasses.row}>
                        <td className={tableClasses.cellBase}>
                          <span className="font-mono text-sm text-amber-100">
                            #{order._id.slice(-8)}
                          </span>
                        </td>

                        <td className={tableClasses.cellBase}>
                          <div className="flex items-center gap-2">
                            <div className="text-amber-400">👤</div>
                            <div>
                              <p className="text-amber-100">
                                {order.customerName}
                              </p>
                              <p className="text-sm text-amber-400/60">
                                {order.customerPhone}
                              </p>
                              <p className="text-sm text-amber-400/60">
                                {order.customerEmail}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className={tableClasses.cellBase}>
                          <p className="text-amber-100/80 text-sm max-w-[200px]">
                            {order.address}, {order.city} - {order.zipCode}
                          </p>
                        </td>

                        <td className={tableClasses.cellBase}>
                          <div className="space-y-1 max-h-52 overflow-auto">
                            {order.items.map((itm, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-2 rounded-lg bg-[#3a2b2b]/50"
                              >
                                <img
                                  src={buildImageUrl(itm.item.imageUrl)}
                                  alt={itm.item.name}
                                  className="w-10 h-10 object-cover rounded-lg"
                                  onError={(e) => (e.currentTarget.src = '/fallback-image.png')}
                                />
                                <div className="flex-1">
                                  <span className="text-amber-100/80 text-sm block truncate">
                                    {itm.item.name}
                                  </span>
                                  <div className="flex items-center gap-2 text-xs text-amber-400/60">
                                    <span>₹{Number(itm.item.price).toFixed(2)}</span>
                                    <span>&dot;</span>
                                    <span>x{itm.quantity}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="text-center">
                          <span className="text-amber-300 text-lg">
                            {order.totalItems}
                          </span>
                        </td>

                        <td className={tableClasses.cellBase}>
                          ₹{order.totalPrice.toFixed(2)}
                        </td>

                        <td className={tableClasses.cellBase}>
                          <div className="flex flex-col gap-2">
                            <div
                              className={`${payMethod.class} px-3 py-1.5 rounded-lg border text-sm`}
                            >
                              {payMethod.label}
                            </div>
                            <div className={`${payStatusStyle.color} flex items-center gap-2 text-sm`}>
                              {payStatusStyle.icon}
                              <span>{payStatusStyle.label}</span>
                            </div>
                          </div>
                        </td>

                        <td className={tableClasses.cellBase}>
                          <div className="flex items-center gap-2">
                            <span className={`${statusStyle.color} text-xl`}>
                               {statusStyle.icon}
                            </span>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              className={`px-4 py-2 rounded-lg ${statusStyle.bg} ${statusStyle.color} border-amber-500/20 text-sm cursor-pointer`}
                            >
                              {['processing', 'outForDelivery', 'delivered', 'cancelled'].map((key) => {
                                  const sty = statusStyles[key];
                                  if (!sty) return null;
                                  return (
                                    <option
                                      key={key}
                                      value={key}
                                      className={`${sty.bg} ${sty.color}`}
                                    >
                                      {sty.label}
                                    </option>
                                  );
                              })}
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {orders.length === 0 && !loading && !error && (
                <div className="text-center py-12 text-amber-100/60 text-xl">
                  No orders found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;