import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_complet.png'

const Header = () => {
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
          </nav>


{/* Login Button */}
<div className="hidden md:block">
  <Link 
    to="/authentifier" 
    className="inline-block bg-primary-yellow text-white font-normal text-base px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
  >
    Login
  </Link>
</div>


          {/* Mobile Menu Button */}
          <div className="md:hidden">
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
