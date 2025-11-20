import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartAPI } from '../services/api';
import logo from '../assets/logo_complet.png'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartCount = async () => {
    if (!user?.id) return;
    try {
      // Ensure userId is a number
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      const items = await cartAPI.getCart(userId);
      const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartItemCount(count);
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchCartCount();
    } else {
      setCartItemCount(0);
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      if (isAuthenticated && user?.id) {
        fetchCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setCartItemCount(0);
  };

  return (
    <header id="section-header" className="bg-primary-blue sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="StockEase" className="h-20" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-10">
            <Link to="/" className="text-white font-semibold text-base hover:text-primary-yellow transition-colors">Home</Link>
            <Link to="/products" className="text-white font-semibold text-base hover:text-primary-yellow transition-colors">Products</Link>
            <Link to="/categories" className="text-white font-semibold text-base hover:text-primary-yellow transition-colors">Categories</Link>
            <Link to="/about" className="text-white font-semibold text-base hover:text-primary-yellow transition-colors">About Us</Link>
            <Link to="/delivery" className="text-white font-semibold text-base hover:text-primary-yellow transition-colors">Delivery</Link>
            {isAuthenticated && (
              <Link to="/cart" className="text-white font-semibold text-base hover:text-primary-yellow transition-colors relative">
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-yellow text-primary-blue text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {isAuthenticated ? (
              <>
                {user && (
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity"
                  >
                    <span className="text-sm font-normal">
                      Welcome, <span className="font-semibold">{user.name || user.email}</span>
                    </span>
                    <div className="w-10 h-10 rounded-full bg-primary-yellow flex items-center justify-center text-primary-blue font-semibold text-sm border-2 border-white">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-block bg-red-600 text-white font-normal text-base px-6 py-2.5 rounded-full hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/authentifier" 
                className="inline-block bg-primary-yellow text-white font-normal text-base px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
            )}
          </div>


          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user && (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-yellow flex items-center justify-center text-primary-blue font-semibold text-xs border-2 border-white">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white text-sm font-normal px-4 py-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/authentifier" 
                className="text-white text-sm font-normal px-4 py-2 bg-primary-yellow rounded-full hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
            )}
            <button type="button" className="text-white hover:text-primary-yellow focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
