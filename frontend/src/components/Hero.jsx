import React from 'react';
import back from "../assets/back.avif"
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="section-hero" className="bg-primary-blue py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative shadow-2xl rounded-3xl overflow-hidden">
          
           <img src={back} alt="StockEase" className="absolute inset-0 w-full h-full object-cove" />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          <div className="relative z-10 flex flex-col justify-center h-full px-8 py-20 md:px-16 lg:px-24" style={{minHeight: '600px'}}>
            <div className="max-w-md">
              <h1 className="text-white font-normal text-5xl md:text-6xl leading-tight">Shop Smart with StockEase</h1>
              <p className="mt-6 text-white/90 text-lg">Everything you need for comfortable living</p>
            <Link to="/products" className="mt-8 inline-block bg-primary-yellow text-white font-normal text-base px-8 py-3 rounded-full hover:opacity-90 transition-opacity">Shop Now</Link>
            </div>
          </div>
          <div className="absolute bottom-8 left-8 flex space-x-2 z-10">
            <button className="h-3 w-3 rounded-full bg-white/50"></button>
            <button className="h-3 w-3 rounded-full bg-primary-yellow"></button>
            <button className="h-3 w-3 rounded-full bg-white/50"></button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
