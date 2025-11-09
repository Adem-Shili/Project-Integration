import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import pc from "../assets/pc.jpeg"
import montre from "../assets/montre.jpg"
import casque from "../assets/audio.jpeg"
import fitness from "../assets/fitness.jpg"
import home from "../assets/home.jpeg"
import furniture from "../assets/furniture.png"


// data inline
const featuredCategories = [
  { id: 1, name: 'Electronics', products: 245, description: 'Latest gadgets, computers, phones, and tech accessories', img: pc },
  { id: 2, name: 'Audio', products: 89, description: 'Headphones, speakers, and sound equipment', img: casque },
  { id: 3, name: 'Accessories', products: 93, description: 'Watches, bags, jewelry, and personal accessories', img: montre },
];

const allCategories = [
  { id: 1, name: 'Electronics', products: 245, description: 'Latest gadgets, computers, phones, and tech accessories', img: pc  },
  { id: 2, name: 'Furniture', products: 128, description: 'Quality furniture for home and office spaces', img:furniture },
  { id: 3, name: 'Audio', products: 89, description: 'Headphones, speakers, and sound equipment', img: casque },
  { id: 4, name: 'Home & Living', products: 167, description: 'Decor, kitchenware, and lifestyle products', img: home },
  { id: 5, name: 'Accessories', products: 93, description: 'Watches, bags, jewelry, and personal accessories', img: montre},
  { id: 6, name: 'Sports & Fitness', products: 76, description: 'Equipment for active lifestyle and fitness', img: fitness },
];

export default function Categories() {
  return (
    <div className="bg-gray-50 text-gray-900">
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

      {/* Featured Categories */}
      <main className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-primary-blue mb-10">Featured Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCategories.map(cat => (
              <div
                key={cat.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300"
              >
                <div className="relative">
                  <img src={cat.img} alt={cat.name} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-primary-yellow text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Featured
                  </div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-semibold">{cat.name}</h3>
                    <p className="text-sm opacity-90 mt-1">{cat.products} products</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col">
                  <p className="text-text-muted flex-grow">{cat.description}</p>
                  <a
                    href="#"
                    className="mt-6 bg-primary-blue text-white text-center py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                  >
                    Browse {cat.name}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* All Categories */}
          <section className="mt-20 bg-gray-50 p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-semibold text-primary-blue mb-8">All Categories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allCategories.map(cat => (
                <a
                  key={cat.id}
                  href="#"
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary-blue/40 transition-all group"
                >
                  <img src={cat.img} alt={cat.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-primary-blue group-hover:underline">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-text-muted mt-1">{cat.description}</p>
                    <p className="text-sm text-primary-yellow mt-2 font-semibold">
                      {cat.products} products available
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Category Overview */}
          <section className="mt-20 bg-primary-blue text-white p-12 rounded-2xl text-center">
            <h2 className="text-2xl font-semibold mb-10">Category Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <div>
                <p className="text-4xl font-bold text-primary-yellow">6</p>
                <p className="text-white/80 mt-1">Categories</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-yellow">798</p>
                <p className="text-white/80 mt-1">Total Products</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-yellow">50+</p>
                <p className="text-white/80 mt-1">Brands</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-yellow">24/7</p>
                <p className="text-white/80 mt-1">Support</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
