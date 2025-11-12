import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar-placeholder.jpg'; // crée/ajoute un avatar de remplacement

const Header = () => {
  return (
    <header className="bg-primary-blue sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-20 flex items-center">
          {/* Logo - left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              {/* ✅ Logo agrandi */}
              <img src={logo} alt="StockEase" className="h-14 w-auto" />
            </Link>
          </div>

          {/* Centered nav */}
          <nav className="hidden md:flex absolute left-0 right-0 mx-auto justify-center pointer-events-auto">
            <ul className="flex items-center space-x-8">
              <li>
                <Link to="/products" className="text-white font-medium text-sm hover:text-primary-yellow transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-white font-medium text-sm hover:text-primary-yellow transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white font-medium text-sm hover:text-primary-yellow transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-white font-medium text-sm hover:text-primary-yellow transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right controls: avatar + text + Log button */}
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 bg-primary-blue">
              <img src={avatar} alt="Admin" className="h-9 w-9 rounded-full border border-white/20" />
              <div className="text-right">
                <div className="text-white text-sm font-medium leading-tight">Admin User</div>
                <div className="text-white text-[11px] opacity-80">Administrator</div>
              </div>
            </div>

            <Link
                to="/authentifier"
                className="bg-primary-yellow text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                aria-label="Log out"
                >
                Log Out
            </Link>


            <div className="md:hidden">
              <button type="button" className="text-white hover:text-primary-yellow focus:outline-none ml-2">
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;