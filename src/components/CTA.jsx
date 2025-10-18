import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CTA = () => (
  <section id="section-cta" className="bg-primary-yellow py-24">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-white text-3xl sm:text-4xl">Ready to Start Shopping?</h2>
      <p className="mt-4 text-white/90 text-lg sm:text-xl max-w-2xl mx-auto">
        Join thousands of satisfied customers who trust StockEase for quality products and fast delivery.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/products" className="text-white font-semibold text-base hover:text-primary-yellow transition-colors">          Browse Products
</Link>
        

        <Link
          to="/authentifier"
          className="border border-white text-white font-semibold text-base px-7 py-3 rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto"
        >
          Sign Up Now
        </Link>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-white/80 w-5 h-5" />
          <span className="text-white/80 text-base">Free shipping over $50</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-white/80 w-5 h-5" />
          <span className="text-white/80 text-base">30-day returns</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-white/80 w-5 h-5" />
          <span className="text-white/80 text-base">24/7 customer support</span>
        </div>
      </div>
    </div>
  </section>
);

export default CTA;
