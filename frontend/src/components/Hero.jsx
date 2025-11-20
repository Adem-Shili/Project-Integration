import React, { useState, useEffect } from 'react';
import back from "../assets/back.avif"
import pc from "../assets/pc.jpeg"
import furniture from "../assets/furniture.avif"
import { Link } from 'react-router-dom';

const Hero = () => {
  const slides = [
    {
      image: back,
      title: "Shop Smart with StockEase",
      description: "Everything you need for comfortable living"
    },
    {
      image: pc,
      title: "Latest Electronics",
      description: "Discover cutting-edge technology and gadgets"
    },
    {
      image: furniture,
      title: "Modern Furniture",
      description: "Transform your space with quality furniture"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section id="section-hero" className="bg-primary-blue py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative shadow-2xl rounded-3xl overflow-hidden" style={{minHeight: '600px'}}>
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
              <div className="relative z-10 flex flex-col justify-center h-full px-8 py-20 md:px-16 lg:px-24" style={{minHeight: '600px'}}>
                <div className="max-w-md">
                  <h1 className="text-white font-normal text-5xl md:text-6xl leading-tight">{slide.title}</h1>
                  <p className="mt-6 text-white/90 text-lg">{slide.description}</p>
                  <Link to="/products" className="mt-8 inline-block bg-primary-yellow text-white font-normal text-base px-8 py-3 rounded-full hover:opacity-90 transition-opacity">Shop Now</Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-8 flex space-x-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-primary-yellow w-8' 
                    : 'bg-white/50 hover:bg-white/70 w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
