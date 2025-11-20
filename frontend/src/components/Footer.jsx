import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { categoriesAPI } from '../services/api';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data.slice(0, 5)); // Show first 5 categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer id="section-footer" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12">
          {/* Brand Column */}
          <div className="pr-8">
            <Link to="/">
              <img src={logo} alt="StockEase" className="h-10" />
            </Link>
            <p className="mt-4 text-text-muted text-base leading-relaxed">
              Your one-stop shop for quality products at unbeatable prices. Fast delivery and excellent customer service guaranteed.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
          
          {/* Shop Column */}
          <div>
            <h3 className="text-primary-blue font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  Categories
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/products?category=${category.id}`}
                    className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Service Column */}
          <div>
            <h3 className="text-primary-blue font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/delivery" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company Column */}
          <div>
            <h3 className="text-primary-blue font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  About StockEase
                </Link>
              </li>
              <li>
                <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">
                  Affiliate Program
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-base">© 2024 StockEase. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-2">
            <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">Terms of Service</a>
            <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">Privacy Policy</a>
            <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
