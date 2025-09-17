import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiTruck, FiCheckCircle, FiUser, FiMapPin, FiBox, FiX } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const buildImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.includes('uploads')) return `${API_BASE_URL}/${path.replace(/^\/?/, '')}`;
  return `${API_BASE_URL}/uploads/${path.replace(/^\/?uploads\//, '')}`;
};

const MyOrderPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState(null);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [deliveryPopup, setDeliveryPopup] = useState({ visible: false, orderId: null });

  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (!authToken) {
      setError('You must be logged in to view your orders.');
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.data || !response.data.success || !Array.isArray(response.data.data)) {
          throw new Error(response.data.message || 'Invalid data format from server.');
        }

        let formattedOrders = response.data.data.map(order => ({
          ...order,
          items: order.items?.map(entry => ({
            ...entry,
            item: {
              ...entry.item,
              imageUrl: buildImageUrl(entry.item.imageUrl),
            },
          })) || [],
          createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          paymentStatus: order.paymentStatus?.toLowerCase() || 'pending'
        }));

        // Check for newOrder in location.state or localStorage
        let newOrder = location.state?.newOrder;
        if (!newOrder) {
          const storedNewOrder = localStorage.getItem('newOrder');
          if (storedNewOrder) {
            try {
              newOrder = JSON.parse(storedNewOrder);
            } catch {
              localStorage.removeItem('newOrder');
            }
          }
        }

        if (newOrder) {
          // Check if newOrder already exists in fetched orders
          const exists = formattedOrders.some(o => o._id === newOrder._id);
          if (!exists) {
            formattedOrders.unshift({
              ...newOrder,
              items: newOrder.items?.map(entry => ({
                ...entry,
                item: {
                  ...entry.item,
                  imageUrl: buildImageUrl(entry.item.imageUrl),
                },
              })) || [],
              createdAt: new Date(newOrder.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              paymentStatus: newOrder.paymentStatus?.toLowerCase() || 'pending'
            });
            // Store in localStorage for persistence
            localStorage.setItem('newOrder', JSON.stringify(newOrder));
          } else {
            // If it exists in fetched orders, remove from localStorage
            localStorage.removeItem('newOrder');
          }
          // Clear the newOrder state from history to avoid duplication on reload
          window.history.replaceState({}, document.title);
        }

        setOrders(formattedOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || 'Failed to load orders. Please try again later');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authToken]);

  // Polling for order status updates
  useEffect(() => {
    if (!authToken || loading) return;

    const pollOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          const newOrders = response.data.data.map(order => ({
            ...order,
            items: order.items?.map(entry => ({
              ...entry,
              item: {
                ...entry.item,
                imageUrl: buildImageUrl(entry.item.imageUrl),
              },
            })) || [],
            createdAt: new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            paymentStatus: order.paymentStatus?.toLowerCase() || 'pending'
          }));

          // Check for status changes to 'delivered'
          const previousOrderMap = new Map(previousOrders.map(order => [order._id, order.status]));
          const newlyDeliveredOrders = newOrders.filter(order =>
            order.status === 'delivered' && previousOrderMap.get(order._id) !== 'delivered'
          );

          if (newlyDeliveredOrders.length > 0) {
            setDeliveryPopup({ visible: true, orderId: newlyDeliveredOrders[0]._id });
          }

          setPreviousOrders(newOrders);
          setOrders(newOrders);
        }
      } catch (err) {
        console.error('Error polling orders:', err);
      }
    };

    const interval = setInterval(pollOrders, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [authToken, loading, previousOrders]);

  const statusStyles = {
    processing: {
      color: 'text-amber-400',
      bg: 'bg-amber-900/20',
      icon: <FiClock className="text-lg" />,
      label: 'Processing',
    },
    outForDelivery: {
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      icon: <FiTruck className="text-lg" />,
      label: 'Out for Delivery',
    },
    delivered: {
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      icon: <FiCheckCircle className="text-lg" />,
      label: 'Delivered',
    },
    cancelled: {
      color: 'text-red-400',
      bg: 'bg-red-900/20',
      icon: <FiCheckCircle className="text-lg" />,
      label: 'Cancelled',
    },
    pending: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-900/20',
      icon: <FiClock className="text-lg" />,
      label: 'Payment Pending',
    },
    succeeded: {
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      icon: <FiCheckCircle className="text-lg" />,
      label: 'Completed',
    },
  };

  const getPaymentMethodDetails = (method) => {
    switch (method?.toLowerCase()) {
      case 'cod':
        return { label: 'COD', class: 'bg-yellow-600/30 text-yellow-300 border-yellow-500/50' };
      case 'card':
        return { label: 'Credit/Debit Card', class: 'bg-blue-600/30 text-blue-300 border-blue-500/50' };
      case 'upi':
        return { label: 'UPI Payment', class: 'bg-purple-600/30 text-purple-300 border-purple-500/50' };
      case 'online':
        return { label: 'Online Payment', class: 'bg-green-600/30 text-green-400 border-green-500/50' };
      default:
        return { label: 'Unknown', class: 'bg-gray-600/30 text-gray-300 border-gray-500/50' };
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      setCancelError('Please provide a cancellation reason.');
      return;
    }
    setCancelError(null);
    try {
      await axios.put(`${API_BASE_URL}/orders/${selectedOrderId}`, {
        status: 'cancelled',
        cancellationReason: cancelReason.trim()
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setCancelModalVisible(false);
      setCancelReason('');
      setSelectedOrderId(null);
      // Refresh orders
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setOrders(response.data.data);
    } catch (error) {
      setCancelError(error.response?.data?.message || 'Failed to cancel order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] flex items-center justify-center">
        <p className="text-xl text-amber-400">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-amber-400">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-amber-400 hover:text-amber-300">
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
            <FiArrowLeft className="text-xl" />
            <span className="font-bold">Back to Home</span>
          </Link>
          <span className="text-amber-400/70 text-sm">Welcome Back</span>
        </div>

        {/* Delivery Success Popup */}
        {deliveryPopup.visible && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#3a2b2b] p-6 rounded-lg max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-amber-400 hover:text-amber-300"
                onClick={() => setDeliveryPopup({ visible: false, orderId: null })}
              >
                <FiX className="text-xl" />
              </button>
              <div className="text-center">
                <FiCheckCircle className="text-6xl text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-amber-100">Order Delivered Successfully!</h3>
                <p className="text-amber-200 mb-4">Your order #{deliveryPopup.orderId?.slice(-8)} has been delivered.</p>
                <button
                  className="px-6 py-2 bg-green-600 rounded-md text-white hover:bg-green-700 transition"
                  onClick={() => setDeliveryPopup({ visible: false, orderId: null })}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Modal */}
        {cancelModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#3a2b2b] p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 text-amber-100">Cancel Order #{selectedOrderId?.slice(-8)}</h3>
              <textarea
                className="w-full p-2 rounded-md mb-4 text-black"
                placeholder="Enter cancellation reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-600 rounded-md text-white"
                  onClick={() => {
                    setCancelModalVisible(false);
                    setCancelReason('');
                    setSelectedOrderId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 rounded-md text-white"
                  onClick={handleConfirmCancel}
                  disabled={!cancelReason.trim()}
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#403b3b]/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-amber-500/20">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent text-center">
            Order History
          </h2>

          {cancelError && (
            <div className="mb-4 text-red-500 font-semibold text-center">{cancelError}</div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3a2b2b]/50">
                <tr>
                  <th className="p-4 text-left text-amber-400">Order ID</th>
                  <th className="p-4 text-left text-amber-400">Customer</th>
                  <th className="p-4 text-left text-amber-400">Address</th>
                  <th className="p-4 text-left text-amber-400">Items</th>
                  <th className="p-4 text-left text-amber-400">Total Price</th>
                  <th className="p-4 text-left text-amber-400">Payment</th>
                  <th className="p-4 text-left text-amber-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const totalPrice = order.total || order.items.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
                  const paymentMethod = getPaymentMethodDetails(order.paymentMethod);
                  const status = statusStyles[order.status] || statusStyles.processing;
                  const paymentStatus = statusStyles[order.paymentStatus] || statusStyles.pending;

                  const isCancellable = !['delivered', 'cancelled'].includes(order.status);

                  return (
                    <tr key={order._id} className="border-b border-amber-500/20 hover:bg-[#3a2b2b]/20 transition-colors group">
                      <td className="p-4 text-amber-100 font-mono text-sm">#{order._id.slice(-8)}</td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-amber-400" />
                          <div>
                            <p className="text-amber-100">{order.firstName} {order.lastName}</p>
                            <p className="text-sm text-amber-400/60">{order.phone}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-amber-400" />
                          <div>
                            <p className="text-amber-100/80 text-sm max-w-[200px]">
                              {order.address}, {order.city} - {order.zipCode}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={`${order._id}-${index}`} className="flex items-center gap-3 p-2 bg-[#3a2b2b]/50 rounded-lg">
                              <img src={item.item.imageUrl} alt={item.item.name} className="w-10 h-10 object-cover rounded-lg" />
                              <div className="flex-1">
                                <span className="text-amber-100/80 text-sm block">{item.item.name}</span>
                                <div className="flex items-center gap-2 text-xs text-amber-400/60">
                                  <span>₹{item.item.price}</span>
                                  <span className="mx-1">&middot;</span>
                                  <span>x{item.quantity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 text-amber-300 text-lg">₹{totalPrice.toFixed(2)}</td>

                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className={`${paymentMethod.class} px-3 py-1.5 rounded-lg border text-sm`}>
                            {paymentMethod.label}
                          </div>
                          <div className={`${paymentStatus.color} px-3 py-1.5 rounded-lg text-sm`}>
                            <span className="flex items-center gap-1">
                              {paymentStatus.icon}
                              {paymentStatus.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`${status.color} text-sm`}>{status.icon}</span>
                            <span className={`px-4 py-2 rounded-lg ${status.bg} ${status.color} border border-amber-500/20 text-sm`}>
                              {status.label}
                            </span>
                          </div>
                          {isCancellable && (
                            <button
                              className="mt-2 px-3 py-1.5 bg-red-600 rounded-lg text-white text-sm hover:bg-red-700 transition"
                              onClick={() => {
                                setSelectedOrderId(order._id);
                                setCancelModalVisible(true);
                                setCancelReason('');
                                setCancelError(null);
                              }}
                            >
                              Cancel Order
                            </button>
                          )}
                          {!isCancellable && order.status === 'cancelled' && (
                            <div className="mt-2 px-3 py-1.5 bg-gray-600 rounded-lg text-white text-sm">
                              Cancelled: {order.cancellationReason || 'No reason provided'}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12 text-amber-100/60 text-xl">
              No Orders Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
