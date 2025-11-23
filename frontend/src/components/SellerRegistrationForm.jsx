import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionPlansAPI, shopsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../Styles/Authentifier.css';

export default function SellerRegistrationForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setError('');
      const data = await subscriptionPlansAPI.getAll();
      if (data && Array.isArray(data)) {
        setPlans(data);
      } else {
        setPlans([]);
      }
      setLoadingPlans(false);
    } catch (err) {
      setError(err.message || 'Failed to load subscription plans. Please refresh the page.');
      setLoadingPlans(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedPlan) {
      setError('Please select a subscription plan');
      return;
    }

    if (!shopName.trim()) {
      setError('Please enter a shop name');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await shopsAPI.create({
        shopName: shopName.trim(),
        description: description.trim(),
        subscriptionPlanId: selectedPlan.id
      });
      if (result && result.id) {
        // Shop created successfully, redirect to dashboard
        navigate('/seller/dashboard');
      } else {
        setError('Failed to create shop. Please try again.');
      }
    } catch (err) {
      const errorMsg = typeof err.message === 'string' ? err.message : 'Failed to create shop. Please make sure you are logged in and try again.';
      setError(errorMsg);
      console.error('Shop creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPlans) {
    return (
      <div className="app-bg">
        <div className="center-wrap">
          <div className="card">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div>Loading subscription plans...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg">
      <div className="top-bar">
        <button onClick={() => navigate('/')} className="back-link">Back to Home</button>
      </div>

      <main className="center-wrap">
        <h1 className="welcome-title">Create Your Shop</h1>
        <p className="subtitle">Choose a subscription plan and set up your shop</p>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Shop Setup</div>
            <div className="card-sub">Complete your seller registration</div>
          </div>

          {error && (
            <div className="message error" style={{
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '8px',
              backgroundColor: '#fee',
              color: '#c33',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label className="field-label" style={{ marginBottom: '12px', display: 'block' }}>
                Shop Name *
              </label>
              <input
                className="input"
                type="text"
                placeholder="Enter your shop name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="field-label" style={{ marginBottom: '12px', display: 'block' }}>
                Description
              </label>
              <textarea
                className="input"
                placeholder="Describe your shop (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="or-line" style={{ margin: '24px 0 16px' }}>
              <hr />
              <span>Choose Subscription Plan *</span>
            </div>

            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  style={{
                    border: selectedPlan?.id === plan.id ? '2px solid #4a90e2' : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    cursor: 'pointer',
                    backgroundColor: selectedPlan?.id === plan.id ? '#f0f7ff' : '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{plan.name}</h3>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4a90e2' }}>
                      ${plan.monthlyPrice}/mo
                    </div>
                  </div>
                  <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>{plan.description}</p>
                  <div style={{ marginTop: '12px', fontSize: '13px', color: '#888' }}>
                    <div>Duration: {plan.durationMonths} month(s)</div>
                    {plan.maxProducts > 0 && <div>Max Products: {plan.maxProducts}</div>}
                    {plan.maxOrdersPerMonth > 0 && <div>Max Orders/Month: {plan.maxOrdersPerMonth}</div>}
                    {plan.analyticsEnabled && <div>✓ Analytics Enabled</div>}
                    {plan.customDomainEnabled && <div>✓ Custom Domain</div>}
                    {plan.prioritySupport && <div>✓ Priority Support</div>}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading || !selectedPlan || !shopName.trim()}
            >
              {loading ? 'Creating Shop...' : 'Create Shop'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

