import React from 'react';
import pc from "../assets/pc.jpeg"
import montre from "../assets/montre.jpg"
import casque from "../assets/audio.jpeg"
import fitness from "../assets/fitness.jpg"
import home from "../assets/home.jpeg"
import furniture from "../assets/furniture.avif"

const products = [
  { title: "Premium Laptop", desc: "High-performance laptop for work and gaming", img:pc  },
  { title: "Smart Phone", desc: "Latest model with advanced camera features", img: casque, tag: "Electronics" },
  { title: "Office Chair", desc: "Ergonomic design for maximum comfort", img: furniture, tag: "Furniture" },
  { title: "Wireless Headphones", desc: "Premium sound quality with noise cancellation", img:fitness , tag: "Audio" },
  { title: "Home Decor Set", desc: "Beautiful accessories for modern living", img:home, tag: "Home & Living" },
  { title: "Smart Watch", desc: "Track fitness and stay connected", img: montre, tag: "Accessories" }
];

const BestSellers = () => (
  <section id="section-bestsellers" className="bg-primary-blue py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-white  text-3xl sm:text-4xl">Best Sellers</h2>
        <p className="mt-4 text-white/80 text-lg sm:text-xl max-w-3xl mx-auto">Discover our most popular products loved by thousands of customers worldwide.</p>
      </div>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p, idx) => (
          <div key={idx} className="bg-white rounded-2xl overflow-hidden flex flex-col group">
            <div className="relative">
              <img src={p.img} alt={p.title} className="w-full h-64 object-cover" />
              <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 shadow-md">
                <span className="text-primary-yellow text-sm font-normal">{p.tag}</span>
              </div>
            </div>
            <div className="p-6 text-center flex-grow">
              <h3 className="text-primary-blue font-normal text-xl">{p.title}</h3>
              <p className="mt-2 text-text-muted text-sm">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <a href="#" className="inline-block bg-white text-primary-blue font-normal text-base px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">View All Products</a>
      </div>
    </div>
  </section>
);

export default BestSellers;
