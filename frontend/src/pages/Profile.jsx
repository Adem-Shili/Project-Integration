import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingBag, FaTruck, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { userAPI, ordersAPI } from "../services/api";
import pc from "../assets/pc.jpeg";

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/authentifier');
      return;
    }
    fetchUserData();
  }, [isAuthenticated, authUser, navigate]);

  const fetchUserData = async () => {
    if (!authUser?.id) return;
    
    try {
      setLoading(true);
      setError('');
      const userId = typeof authUser.id === 'string' ? parseInt(authUser.id, 10) : authUser.id;
      
      // Fetch user profile
      const userData = await userAPI.getById(userId);
      if (!userData) {
        throw new Error('User data not found');
      }
      setUser(userData);
      setEditForm({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
      
      // Fetch user orders
      try {
        const ordersData = await ordersAPI.getByUser(userId);
        // Reverse to show newest first (backend already sorts, but ensure it's reversed)
        const sortedOrders = Array.isArray(ordersData) ? [...ordersData].reverse() : [];
        setOrders(sortedOrders);
      } catch (orderErr) {
        console.error('Error fetching orders:', orderErr);
        setOrders([]);
      }
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to load profile data. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
  };

  const handleSave = async () => {
    if (!authUser?.id) return;
    
    try {
      setSaving(true);
      setError('');
      const userId = typeof authUser.id === 'string' ? parseInt(authUser.id, 10) : authUser.id;
      
      const updatedUser = await userAPI.update(userId, editForm);
      if (updatedUser) {
        setUser(updatedUser);
        setEditing(false);
        
        // Update auth context if needed
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          parsedUser.name = updatedUser.name;
          parsedUser.email = updatedUser.email;
          localStorage.setItem('user', JSON.stringify(parsedUser));
          window.dispatchEvent(new Event('authStateChange'));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!authUser?.id) return;
    
    try {
      setDeleting(true);
      setError('');
      const userId = typeof authUser.id === 'string' ? parseInt(authUser.id, 10) : authUser.id;
      
      await userAPI.delete(userId);
      
      // Logout and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('authStateChange'));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete account. Please try again.');
      console.error('Error deleting account:', err);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format delivery option
  const formatDeliveryOption = (option) => {
    if (!option) return 'Standard';
    const options = {
      'standard': 'Standard Delivery',
      'express': 'Express Delivery',
      'free': 'Free Delivery'
    };
    return options[option] || option;
  };

  // Format order status - map PENDING to "Ordered" for display
  const formatOrderStatus = (status) => {
    if (!status) return 'N/A';
    if (status === 'PENDING' || status === 'ORDERED') {
      return 'Ordered';
    }
    return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
  };

  return (
    <>
      <Header />

      {/* Bandeau supérieur */}
      <section className="bg-primary-blue text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:opacity-80 transition"
          >
            <FaArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-2xl font-normal">My Profile</h1>
        </div>
      </section>

      {/* Section principale */}
      <main className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-text-muted">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Information Card */}
              <div className="lg:col-span-1">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-primary-blue flex items-center gap-2">
                      <FaUser className="w-6 h-6" />
                      Personal Information
                    </h2>
                    {!editing ? (
                      <button
                        onClick={handleEdit}
                        className="text-primary-blue hover:text-blue-700 transition"
                        title="Edit Profile"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="text-green-600 hover:text-green-700 transition disabled:opacity-50"
                          title="Save Changes"
                        >
                          <FaSave className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className="text-red-600 hover:text-red-700 transition disabled:opacity-50"
                          title="Cancel"
                        >
                          <FaTimes className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaUser className="w-5 h-5 text-primary-blue mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Full Name</p>
                        {editing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          />
                        ) : (
                          <p className="text-base font-medium text-gray-900">
                            {user?.name || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaEnvelope className="w-5 h-5 text-primary-blue mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Email</p>
                        {editing ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          />
                        ) : (
                          <p className="text-base font-medium text-gray-900">
                            {user?.email || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaPhone className="w-5 h-5 text-primary-blue mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Phone Number</p>
                        {editing ? (
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          />
                        ) : (
                          <p className="text-base font-medium text-gray-900">
                            {user?.phone || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="w-5 h-5 text-primary-blue mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Address</p>
                        {editing ? (
                          <textarea
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            rows={3}
                            className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          />
                        ) : (
                          <p className="text-base font-medium text-gray-900">
                            {user?.address || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {saving && (
                    <p className="text-sm text-gray-500 mt-4">Saving...</p>
                  )}

                  {/* Delete Account Button */}
                  <button
                    className="w-full mt-6 bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                  </button>

                  {showDeleteConfirm && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 mb-3">
                        Are you sure you want to delete your account? This action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleting}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={deleting}
                          className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order History */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Tracking Button */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <Link
                    to="/delivery"
                    className="inline-flex items-center gap-2 bg-primary-blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaTruck className="w-5 h-5" />
                    <span>Check Delivery Tracking</span>
                  </Link>
                </div>

                {/* Order History */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-primary-blue mb-4 flex items-center gap-2">
                    <FaShoppingBag className="w-6 h-6" />
                    Order History
                  </h2>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-text-muted">No orders yet</p>
                      <Link
                        to="/products"
                        className="inline-block mt-4 text-primary-blue hover:underline"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border rounded-lg p-4 hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-sm text-gray-500">Order Number</p>
                              <p className="text-lg font-semibold text-primary-blue">
                                {order.orderNumber || 'N/A'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Order Date</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(order.orderDate)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Status: <span className="font-medium">{formatOrderStatus(order.status)}</span>
                              </p>
                              {order.deliveryOption && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Delivery: <span className="font-medium">{formatDeliveryOption(order.deliveryOption)}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="border-t pt-3 mt-3">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Products:</p>
                            <div className="space-y-2">
                              {order.items && order.items.length > 0 ? (
                                order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                                  >
                                    <img
                                      src={item.product?.imageUrl || pc}
                                      alt={item.product?.name || 'Product'}
                                      className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        {item.product?.name || 'Product'}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Quantity: {item.quantity || 0} × ${parseFloat(item.price || 0).toFixed(2)}
                                      </p>
                                    </div>
                                    <p className="text-sm font-semibold text-primary-blue">
                                      ${(parseFloat(item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">No items found</p>
                              )}
                            </div>
                            <div className="mt-3 pt-3 border-t flex justify-between items-center">
                              <span className="text-sm text-gray-500">Total Amount</span>
                              <span className="text-lg font-semibold text-primary-blue">
                                ${parseFloat(order.totalAmount || 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Profile;
