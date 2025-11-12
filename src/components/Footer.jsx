import React from 'react';
import logo from "../assets/logo.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => (
  <footer id="section-footer" className="bg-white py-20">
<<<<<<< HEAD

=======
>>>>>>> e777cea7a42e948f468d82570f600a74f6a41968
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12">
        {/* Brand Column */}
        <div className="pr-8">
          <img src={logo} alt="StockEase" className="h-10" />
          <p className="mt-4 text-text-muted text-base leading-relaxed">
            Your one-stop shop for quality products at unbeatable prices. Fast delivery and excellent customer service guaranteed.
          </p>
          <div className="mt-6 flex space-x-4">
            <a
              href="#"
              className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
        {/* Shop Column */}
        <div>
          <h3 className="text-primary-blue font-semibold text-lg mb-4">Shop</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Electronics</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Furniture</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Home & Living</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Audio</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Accessories</a></li>
          </ul>
        </div>
        {/* Customer Service Column */}
        <div>
          <h3 className="text-primary-blue font-semibold text-lg mb-4">Customer Service</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Track Your Order</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Returns & Exchanges</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Shipping Info</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Size Guide</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Contact Us</a></li>
          </ul>
        </div>
        {/* Company Column */}
        <div>
          <h3 className="text-primary-blue font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">About StockEase</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Careers</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Press</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Sustainability</a></li>
            <li><a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Affiliate Program</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-text-muted text-base">© 2024 StockEase. All rights reserved.</p>
        <div className="flex flex-col sm:flex-row items-center gap-x-6 gap-y-2">
          <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Terms of Service</a>
          <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Privacy Policy</a>
          <a href="#" className="text-text-muted font-semibold text-base hover:text-primary-blue">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);
export default Footer;
