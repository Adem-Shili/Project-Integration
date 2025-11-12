import React from "react";
import { FaStar, FaHeart, FaArrowLeft } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import pc from "../assets/pc.jpeg"
const ProductsPage = () => {
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
                />
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
                  >
                    <option>All Categories</option>
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
            <p className="text-base text-text-muted">Showing 6 of 6 products</p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Example Product Card */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col group transition-shadow hover:shadow-lg">
              <div className="relative">
               
                <img src={pc} alt="StockEase" className="w-full h-48 object-cover" />
                <div className="absolute top-3 left-3 bg-primary-yellow text-white text-xs font-normal px-3 py-1 rounded-full">
                  Best Seller
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <span className="bg-yellow-100 text-primary-yellow text-xs px-2 py-0.5 rounded self-start">
                  Electronics
                </span>
                <h3 className="text-lg font-normal text-primary-blue mt-2">
                  Premium Laptop
                </h3>
                <p className="text-sm text-text-muted mt-1 h-10">
                  High-performance laptop for work and gaming
                </p>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-lg font-normal text-primary-blue">
                    $1,299
                  </span>
                  <span className="text-sm text-text-muted line-through">
                    $1,499
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <FaStar className="text-yellow-400 w-4 h-4" />
                  <span className="text-sm text-text-muted">4.8</span>
                </div>
                <div className="mt-auto pt-4 flex gap-2">
                  <button className="bg-primary-blue text-white font-semibold text-sm py-2 rounded-lg flex-grow text-center hover:bg-blue-700 transition">
                    Add to Cart
                  </button>
                  <button className="border border-primary-yellow p-2 rounded-lg hover:bg-yellow-50 transition">
                    <FaHeart className="w-4 h-4 text-primary-yellow" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="border border-primary-blue text-primary-blue font-semibold py-2 px-6 rounded-lg hover:bg-primary-blue hover:text-white transition-colors">
              Load More Products
            </button>
          </div>
        </div>
      </main>
<<<<<<< HEAD
=======

>>>>>>> e777cea7a42e948f468d82570f600a74f6a41968
      <Footer />
    </>
  );
};

export default ProductsPage;
