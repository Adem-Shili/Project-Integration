import React, { useState, useEffect } from "react";
import { FaStar, FaHeart, FaArrowLeft } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import pc from "../assets/pc.jpeg"

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addingToCart, setAddingToCart] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [productQuantities, setProductQuantities] = useState({});

  useEffect(() => {
    const initializeData = async () => {
      await fetchCategories();
      // Check if category is in URL params
      const categoryParam = searchParams.get('category');
      if (categoryParam) {
        setSelectedCategory(categoryParam);
        await handleCategoryFilter(categoryParam);
      } else {
        await fetchProducts();
      }
    };
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchProducts();
      return;
    }
    
    try {
      setLoading(true);
      const data = await productsAPI.search(searchKeyword);
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (categoryId) => {
    setSelectedCategory(categoryId);
    if (!categoryId) {
      await fetchProducts();
      return;
    }
    
    try {
      setLoading(true);
      const data = await productsAPI.getByCategory(categoryId);
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Failed to filter by category.');
      console.error('Error filtering products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate('/authentifier');
      return;
    }

    if (!user?.id) {
      setError('User information not available. Please log in again.');
      return;
    }

    const quantity = productQuantities[productId] || 1;

    try {
      setAddingToCart({ ...addingToCart, [productId]: true });
      // Ensure userId is a number
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId;
      
      await cartAPI.addItem(userId, productIdNum, quantity);
      setSuccessMessage('Product added to cart!');
      setTimeout(() => setSuccessMessage(''), 3000);
      // Reset quantity after adding
      setProductQuantities({ ...productQuantities, [productId]: 1 });
      // Notify header to refresh cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setError(err.message || 'Failed to add product to cart.');
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart({ ...addingToCart, [productId]: false });
    }
  };

  const handleQuantityChange = (productId, delta) => {
    const currentQuantity = productQuantities[productId] || 1;
    const newQuantity = Math.max(1, currentQuantity + delta);
    setProductQuantities({ ...productQuantities, [productId]: newQuantity });
  };
  return (
    <>
      <Header />

   
      {/* Breadcrumbs Section */}
      <section id="breadcrumbs" className="bg-primary-blue">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-center items-center relative">
          {/* Back to Home */}
          <Link
            to="/"
            className="absolute left-4 sm:left-6 lg:left-8 flex items-center gap-2 text-white font-normal text-base hover:opacity-80 transition"
          >
            <FaArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          {/* Page Title */}
          <h1 className="text-white text-2xl font-normal">Shop by Category</h1>
        </div>
      </section>
      {/* Main Content */}
      <main className="bg-white">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="search"
                  className="block text-sm font-normal text-text-muted mb-2"
                >
                  Search Products
                </label>
                <input
                  type="text"
                  id="search"
                  className="w-full bg-gray-100 rounded-lg border-transparent focus:border-primary-blue focus:ring-primary-blue px-4 py-2 text-sm text-gray-900 placeholder-gray-500"
                  placeholder="Search by name or description..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="mt-2 bg-primary-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-normal text-text-muted mb-2"
                >
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    className="w-full bg-gray-100 rounded-lg border-transparent focus:border-primary-blue focus:ring-primary-blue px-4 py-2 text-sm text-gray-900 appearance-none"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">&#9662;</span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="sort"
                  className="block text-sm font-normal text-text-muted mb-2"
                >
                  Sort By
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    className="w-full bg-gray-100 rounded-lg border-transparent focus:border-primary-blue focus:ring-primary-blue px-4 py-2 text-sm text-gray-900 appearance-none"
                  >
                    <option>Name</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">&#9662;</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Count */}
          <div className="mb-8">
            <p className="text-base text-text-muted">
              {loading ? 'Loading...' : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMessage}
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-text-muted">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col group transition-shadow hover:shadow-lg">
                  <div className="relative">
                    <img 
                      src={product.imageUrl || pc} 
                      alt={product.name} 
                      className="w-full h-48 object-cover" 
                    />
                    {product.bestseller && (
                      <div className="absolute top-3 left-3 bg-primary-yellow text-white text-xs font-normal px-3 py-1 rounded-full">
                        Best Seller
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    {product.category && (
                      <span className="bg-yellow-100 text-primary-yellow text-xs px-2 py-0.5 rounded self-start">
                        {product.category.name || 'Uncategorized'}
                      </span>
                    )}
                    <h3 className="text-lg font-normal text-primary-blue mt-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-text-muted mt-1 h-10 line-clamp-2">
                      {product.description || 'No description available'}
                    </p>
                    <div className="flex items-baseline gap-2 mt-4">
                      <span className="text-lg font-normal text-primary-blue">
                        ${product.price?.toFixed(2) || '0.00'}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-text-muted line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <FaStar className="text-yellow-400 w-4 h-4" />
                        <span className="text-sm text-text-muted">{product.rating}</span>
                      </div>
                    )}
                    <div className="mt-auto pt-4 flex flex-col gap-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => handleQuantityChange(product.id, -1)}
                          disabled={addingToCart[product.id] || (productQuantities[product.id] || 1) <= 1}
                          className="text-primary-blue hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed border border-primary-blue rounded-md px-3 py-1 text-sm font-semibold"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold text-gray-700">
                          {productQuantities[product.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(product.id, 1)}
                          disabled={addingToCart[product.id]}
                          className="text-primary-blue hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed border border-primary-blue rounded-md px-3 py-1 text-sm font-semibold"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={addingToCart[product.id]}
                          className="bg-primary-blue text-white font-semibold text-sm py-2 rounded-lg flex-grow text-center hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button className="border border-primary-yellow p-2 rounded-lg hover:bg-yellow-50 transition">
                          <FaHeart className="w-4 h-4 text-primary-yellow" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="border border-primary-blue text-primary-blue font-semibold py-2 px-6 rounded-lg hover:bg-primary-blue hover:text-white transition-colors">
              Load More Products
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductsPage;
