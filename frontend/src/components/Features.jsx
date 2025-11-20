import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../services/api';

const Features = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        // Show first 6 categories
        setCategories(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section id="section-features" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-primary-blue font-bold text-3xl sm:text-4xl">Shop by Category</h2>
          <p className="mt-4 text-text-muted text-lg sm:text-xl max-w-3xl mx-auto">Browse our wide selection of products organized by category</p>
        </div>
        {loading ? (
          <div className="mt-16 text-center">
            <p className="text-text-muted">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-text-muted">No categories available</p>
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow group"
              >
                <div className="bg-primary-blue rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary-yellow transition-colors">
                  <span className="text-white text-2xl font-bold">{category.name.charAt(0)}</span>
                </div>
                <h3 className="text-primary-blue font-normal text-xl mb-2 group-hover:text-primary-yellow transition-colors">
                  {category.name}
                </h3>
                <p className="text-text-muted text-base leading-relaxed">
                  {category.description || 'Explore our collection'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Features;
