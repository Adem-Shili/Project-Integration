import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { adminAPI } from '../services/api';
import { FaStore, FaUsers, FaBox, FaShoppingBag, FaDollarSign, FaChartLine } from 'react-icons/fa';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/authentifier');
      return;
    }
    if (user?.role !== 'ADMIN' && user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stats, shopsData] = await Promise.all([
        adminAPI.getStatistics(),
        adminAPI.getAllShops()
      ]);
      setStatistics(stats);
      setShops(shopsData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ minHeight: '80vh', padding: '40px 20px', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Admin Dashboard</h1>
            <p style={{ color: '#666', fontSize: '18px' }}>Platform Overview & Management</p>
          </div>

          {error && (
            <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#fee', color: '#c33', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {statistics && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <FaStore style={{ fontSize: '24px', color: '#4a90e2' }} />
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Shops</h3>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{statistics.totalShops || 0}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    {statistics.activeShops || 0} active
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <FaDollarSign style={{ fontSize: '24px', color: '#4a90e2' }} />
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Monthly Subscription Revenue</h3>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                    ${parseFloat(statistics.monthlySubscriptionRevenue || 0).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    Total: ${parseFloat(statistics.totalSubscriptionRevenue || 0).toFixed(2)}
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <FaUsers style={{ fontSize: '24px', color: '#4a90e2' }} />
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Users</h3>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{statistics.totalUsers || 0}</div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <FaBox style={{ fontSize: '24px', color: '#4a90e2' }} />
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Products</h3>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{statistics.totalProducts || 0}</div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <FaShoppingBag style={{ fontSize: '24px', color: '#4a90e2' }} />
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Orders</h3>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{statistics.totalOrders || 0}</div>
                </div>

                <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <FaChartLine style={{ fontSize: '24px', color: '#4a90e2' }} />
                    <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Sales Revenue</h3>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                    ${parseFloat(statistics.totalSalesRevenue || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '24px' }}>All Shops</h2>
                {shops.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No shops registered yet.</p>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {shops.map(shop => (
                      <div key={shop.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{shop.name}</h3>
                            {shop.description && (
                              <p style={{ margin: '0 0 12px 0', color: '#666' }}>{shop.description}</p>
                            )}
                            <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666' }}>
                              <span>Owner: {shop.owner?.name }</span>
                              <span>Plan: {shop.subscriptionPlan?.name || 'N/A'}</span>
                              <span>Status: {shop.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4a90e2' }}>
                              ${parseFloat(shop.totalRevenue || 0).toFixed(2)}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666' }}>
                              {shop.totalOrders || 0} orders
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

