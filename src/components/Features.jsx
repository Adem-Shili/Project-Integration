import React from 'react';
import { FaTags, FaBoxes, FaShippingFast, FaCheckCircle, FaShoppingCart, FaHeadset } from 'react-icons/fa';

const features = [
  { title: "Best Prices", desc: "Competitive pricing across all product categories with regular discounts and special offers.", icon: <FaTags size={32} className="text-white" /> },
  { title: "Wide Selection", desc: "Thousands of products across multiple categories from trusted brands and suppliers.", icon: <FaBoxes size={32} className="text-white" /> },
  { title: "Fast Delivery", desc: "Quick and reliable shipping with tracking. Same-day delivery available in select areas.", icon: <FaShippingFast size={32} className="text-white" /> },
  { title: "Quality Guarantee", desc: "All products are quality-checked before shipping with easy returns and warranty support.", icon: <FaCheckCircle size={32} className="text-white" /> },
  { title: "Easy Shopping", desc: "User-friendly interface with advanced search, filters, and personalized recommendations.", icon: <FaShoppingCart size={32} className="text-white" /> },
  { title: "24/7 Support", desc: "Round-the-clock customer service to help with orders, returns, and product inquiries.", icon: <FaHeadset size={32} className="text-white" /> },
];

const Features = () => (
  <section id="section-features" className="bg-white py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-primary-blue font-bold text-3xl sm:text-4xl">Why Choose StockEase?</h2>
        <p className="mt-4 text-text-muted text-lg sm:text-xl max-w-3xl mx-auto">We make online shopping simple, fast, and reliable with a wide selection of quality products at competitive prices.</p>
      </div>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, idx) => (
          <div key={idx} className="border border-gray-100 rounded-2xl p-8">
            <div className="bg-primary-blue rounded-xl w-16 h-16 flex items-center justify-center mb-6">
              {f.icon}
            </div>
            <h3 className="text-primary-blue font-normal text-xl mb-2">{f.title}</h3>
            <p className="text-text-muted text-base leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
