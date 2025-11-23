import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { shopsAPI, productsAPI, categoriesAPI, subscriptionPlansAPI } from '../services/api';
import { FaChartLine, FaShoppingBag, FaDollarSign, FaBox, FaPlus, FaEdit, FaTrash, FaStore, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showShopForm, setShowShopForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    imageUrl: '',
    categoryId: '',
    shopId: ''
  });
  const [shopForm, setShopForm] = useState({
    shopName: '',
    description: '',
    subscriptionPlanId: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/authentifier');
      return;
    }
    if (user?.role !== 'SELLER' && user?.role !== 'supplier') {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shopsData, cats, plans] = await Promise.all([
        shopsAPI.getMyShops().catch(() => []),
        categoriesAPI.getAll(),
        subscriptionPlansAPI.getAll()
      ]);

      setShops(shopsData || []);
      setCategories(cats);
      setSubscriptionPlans(plans);

      if (shopsData && shopsData.length > 0) {
        const firstShop = shopsData[0];
        setSelectedShop(firstShop);
        await loadShopData(firstShop.id);
      } else {
        navigate('/seller/setup');
        return;
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadShopData = async (shopId) => {
    try {
      const [stats, shopProducts] = await Promise.all([
        shopsAPI.getShopStatistics(shopId).catch(() => null),
        productsAPI.getByShop(shopId) // Get all products for this shop (including inactive for sellers)
      ]);

      setStatistics(stats);
      setProducts(shopProducts || []);
    } catch (err) {
      console.error('Error loading shop data:', err);
    }
  };

  const handleShopSelect = async (shop) => {
    setSelectedShop(shop);
    await loadShopData(shop.id);
  };

  const handleShopSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const result = await shopsAPI.create({
        shopName: shopForm.shopName.trim(),
        description: shopForm.description.trim(),
        subscriptionPlanId: parseInt(shopForm.subscriptionPlanId)
      });
      
      if (result && result.id) {
        setShowShopForm(false);
        setShopForm({ shopName: '', description: '', subscriptionPlanId: '' });
        fetchData();
      } else {
        setError('Failed to create shop');
      }
    } catch (err) {
      setError(err.message || 'Failed to create shop');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShop && !productForm.shopId) {
      setError('Please select a shop');
      return;
    }
    
    try {
      setError('');
      const shopId = selectedShop ? selectedShop.id : parseInt(productForm.shopId);
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : null,
        stock: parseInt(productForm.stock),
        category: { id: parseInt(productForm.categoryId) },
        shop: { id: shopId },
        isActive: editingProduct ? editingProduct.isActive : true // New products are active by default
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
      } else {
        await productsAPI.create(productData);
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: '',
        imageUrl: '',
        categoryId: '',
        shopId: selectedShop ? selectedShop.id.toString() : ''
      });
      if (selectedShop) {
        await loadShopData(selectedShop.id);
      }
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id?.toString() || '',
      shopId: product.shop?.id?.toString() || (selectedShop ? selectedShop.id.toString() : ''),
      isActive: product.isActive !== undefined ? product.isActive : true
    });
    setShowProductForm(true);
  };
  const handleToggleProductActive = async (product) => {
    try {
      setError('');
      const updatedProduct = {
        ...product,
        isActive: !product.isActive
      };
      await productsAPI.update(product.id, updatedProduct);
      if (selectedShop) {
        await loadShopData(selectedShop.id);
      }
    } catch (err) {
      setError(err.message || 'Failed to update product status');
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
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Seller Dashboard</h1>
            <p style={{ color: '#666', fontSize: '18px' }}>Manage your shops and products</p>
          </div>

          {error && (
            <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#fee', color: '#c33', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {/* Shops Section */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaStore /> My Shops
              </h2>
              <button
                onClick={() => {
                  setShowShopForm(true);
                  setShopForm({ shopName: '', description: '', subscriptionPlanId: '' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  backgroundColor: '#4a90e2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                <FaPlus /> Add Shop
              </button>
            </div>

            {showShopForm && (
              <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0 }}>Create New Shop</h3>
                <form onSubmit={handleShopSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Shop Name *</label>
                      <input
                        type="text"
                        value={shopForm.shopName}
                        onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Subscription Plan *</label>
                      <select
                        value={shopForm.subscriptionPlanId}
                        onChange={(e) => setShopForm({ ...shopForm, subscriptionPlanId: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                      >
                        <option value="">Select plan</option>
                        {subscriptionPlans.map(plan => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} - ${plan.monthlyPrice}/mo
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                    <textarea
                      value={shopForm.description}
                      onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                      rows="3"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#4a90e2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Create Shop
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowShopForm(false)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#ccc',
                        color: '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {shops.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No shops yet. Create your first shop!</p>
            ) : (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {shops.map(shop => (
                  <button
                    key={shop.id}
                    onClick={() => handleShopSelect(shop)}
                    style={{
                      padding: '16px 20px',
                      border: selectedShop?.id === shop.id ? '2px solid #4a90e2' : '2px solid #ddd',
                      borderRadius: '8px',
                      backgroundColor: selectedShop?.id === shop.id ? '#f0f7ff' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      minWidth: '200px'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{shop.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Plan: {shop.subscriptionPlan?.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Status: {shop.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedShop && (
            <>
              {statistics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                  <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <FaDollarSign style={{ fontSize: '24px', color: '#4a90e2' }} />
                      <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Revenue</h3>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                      ${parseFloat(statistics.totalRevenue || 0).toFixed(2)}
                    </div>
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
                      <FaBox style={{ fontSize: '24px', color: '#4a90e2' }} />
                      <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total Products</h3>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{statistics.totalProducts || 0}</div>
                  </div>

                  <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <FaChartLine style={{ fontSize: '24px', color: '#4a90e2' }} />
                      <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>Monthly Revenue</h3>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                      ${parseFloat(statistics.monthlyRevenue || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ margin: 0, fontSize: '24px' }}>Products - {selectedShop.name}</h2>
                  <button
                    onClick={() => {
                      setShowProductForm(true);
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        description: '',
                        price: '',
                        originalPrice: '',
                        stock: '',
                        imageUrl: '',
                        categoryId: '',
                        shopId: selectedShop.id.toString()
                      });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      backgroundColor: '#4a90e2',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    <FaPlus /> Add Product
                  </button>
                </div>

                {showProductForm && (
                  <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleProductSubmit}>
                      {shops.length > 1 && (
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Shop *</label>
                          <select
                            value={productForm.shopId}
                            onChange={(e) => setProductForm({ ...productForm, shopId: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                          >
                            <option value="">Select shop</option>
                            {shops.map(shop => (
                              <option key={shop.id} value={shop.id}>{shop.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name *</label>
                          <input
                            type="text"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category *</label>
                          <select
                            value={productForm.categoryId}
                            onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                          >
                            <option value="">Select category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          rows="3"
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Price *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Original Price</label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.originalPrice}
                            onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Stock *</label>
                          <input
                            type="number"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Image URL</label>
                          <input
                            type="url"
                            value={productForm.imageUrl}
                            onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          type="submit"
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#4a90e2',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          {editingProduct ? 'Update' : 'Create'} Product
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                          }}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#ccc',
                            color: '#333',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {products.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No products yet. Add your first product!</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {products.map(product => (
                      <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
                        {product.imageUrl && (
                          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '12px' }} />
                        )}
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{product.name}</h3>
                        <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>{product.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#4a90e2' }}>
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                          <span style={{ color: '#666' }}>Stock: {product.stock}</span>
                        </div>
                        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '12px', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            backgroundColor: product.isActive ? '#d4edda' : '#f8d7da',
                            color: product.isActive ? '#155724' : '#721c24'
                          }}>
                            {product.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditProduct(product)}
                            style={{
                              flex: 1,
                              padding: '8px',
                              backgroundColor: '#4a90e2',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleToggleProductActive(product)}
                            style={{
                              flex: 1,
                              padding: '8px',
                              backgroundColor: product.isActive ? '#ffc107' : '#28a745',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            {product.isActive ? <><FaEyeSlash /> Hide</> : <><FaEye /> Show</>}
                          </button>
                          
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
