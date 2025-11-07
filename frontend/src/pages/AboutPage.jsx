import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaUsers,
  FaBoxOpen,
  FaLayerGroup,
  FaServer,
  FaSmile,
  FaCheckCircle,
  FaCogs,
  FaLeaf,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <div className="bg-white">
      <Header />

      {/* --- BANDEAU SUPÉRIEUR --- */}
      <section className="bg-primary-blue text-white relative">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:opacity-80 transition"
          >
            <FaArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          {/* Titre centré */}
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-normal">
            About Us
          </h1>
        </div>
      </section>

      {/* --- OUR STORY --- */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl text-primary-blue mb-4 font-semibold">
          Our Story
        </h2>
        <p className="text-text-muted leading-7 mb-6">
          Founded in 2025, StockEase began with a simple mission: to make quality
          products accessible to everyone through an exceptional online shopping
          experience. What started as a small team with big dreams has grown into
          a trusted platform serving thousands of happy customers.
        </p>
        <p className="text-text-muted leading-7">
          We believe that shopping should be easy, enjoyable, and reliable. That’s
          why we’ve built our platform with cutting-edge technology, partnered
          with trusted suppliers, and created a customer service team that truly
          cares about your experience.
        </p>
      </section>

      {/* --- MISSION CARD --- */}
      <section className="bg-primary-yellow py-10 px-6 rounded-2xl max-w-4xl mx-auto text-center text-gray-800 mb-16">
        <h3 className="text-2xl text-primary-blue font-semibold mb-3">
          Our Mission
        </h3>
        <p>
          To provide an unparalleled online shopping experience that combines
          quality products, competitive prices, and exceptional customer service.
        </p>
      </section>

      {/* --- STATS --- */}
      <section className="bg-primary-blue text-center py-16 text-white rounded-2xl mx-6 md:mx-20 mb-16">
        <h3 className="text-2xl font-semibold mb-8">StockEase by the Numbers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"> {/* 🔹 width réduite */}
          <div className="flex flex-col items-center space-y-2">
            <FaUsers className="text-primary-yellow text-4xl mb-2" />
            <p className="text-2xl text-primary-yellow font-bold">50K+</p>
            <p className="text-white/80 text-sm">Happy Customers</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <FaBoxOpen className="text-primary-yellow text-4xl mb-2" />
            <p className="text-2xl text-primary-yellow font-bold">1M+</p>
            <p className="text-white/80 text-sm">Orders Delivered</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <FaLayerGroup className="text-primary-yellow text-4xl mb-2" />
            <p className="text-2xl text-primary-yellow font-bold">500+</p>
            <p className="text-white/80 text-sm">Product Categories</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <FaServer className="text-primary-yellow text-4xl mb-2" />
            <p className="text-2xl text-primary-yellow font-bold">99.9%</p>
            <p className="text-white/80 text-sm">Uptime</p>
          </div>
        </div>
      </section>

      {/* --- VALUES --- */}
      <section className="max-w-6xl mx-auto py-16 px-6 text-center">
        <h3 className="text-3xl text-primary-blue mb-10 font-semibold">
          Our Values
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FaSmile className="text-white text-2xl" />,
              title: "Customer First",
              desc: "Every decision we make starts with our customers' needs and satisfaction.",
            },
            {
              icon: <FaCheckCircle className="text-white text-2xl" />,
              title: "Quality Products",
              desc: "We partner with trusted brands to ensure every product meets our high standards.",
            },
            {
              icon: <FaCogs className="text-white text-2xl" />,
              title: "Innovation",
              desc: "We continuously improve our platform to provide the best shopping experience.",
            },
            {
              icon: <FaLeaf className="text-white text-2xl" />,
              title: "Sustainability",
              desc: "We’re committed to eco-friendly practices and sustainable business operations.",
            },
          ].map((val, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-text-muted bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="w-16 h-16 bg-primary-yellow rounded-full flex items-center justify-center mb-4">
                {val.icon}
              </div>
              <h4 className="text-primary-blue text-lg font-semibold mb-2">
                {val.title}
              </h4>
              <p className="text-sm">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="bg-primary-yellow text-center py-16 text-white rounded-2xl mx-6 md:mx-20 mb-16">
        <h3 className="text-2xl font-semibold mb-4">
          Ready to Experience StockEase?
        </h3>
        <p className="text-white/90 mb-8">
          Join thousands of satisfied customers who trust StockEase for their
          online shopping needs.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-primary-yellow font-semibold px-6 py-3 rounded-lg hover:bg-gray-100">
            Shop Now
          </button>
          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-primary-yellow transition">
            Contact Us
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
