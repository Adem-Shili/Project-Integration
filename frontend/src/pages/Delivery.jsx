import React, { useState } from "react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrackingInfo from '../components/Trackinginfo';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import deliveryImg from '../assets/delivery1.jpg';
import { deliveryAPI, ordersAPI } from '../services/api';


const DeliveryPage = () => {
    const [orderId, setOrderId] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) {
            setError('Please enter an Order ID');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            // First get the order to get user info
            const order = await ordersAPI.getByNumber(orderId.trim());
            if (!order) {
                throw new Error('Order not found');
            }
            setOrderData(order);

            // Then get delivery info
            const delivery = await deliveryAPI.getByOrderNumber(orderId.trim());
            if (!delivery) {
                throw new Error('Delivery information not found');
            }
            setTrackingData(delivery);
        } catch (err) {
            setError(err.message || 'Failed to track order. Please check your Order ID.');
            setTrackingData(null);
            setOrderData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <section id="breadcrumbs" className="bg-primary-blue py-8">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-white">
    
    {/* Back to Home */}
    <Link
      to="/"
      className="flex items-center gap-2 text-white font-normal text-base hover:opacity-80 transition mb-4"
    >
      <FaArrowLeft className="w-5 h-5" />
      <span>Back to Home</span>
    </Link>

    {/* Page Title */}
    <div className="text-left">
      <h1 className="text-3xl font-bold">Delivery Tracker</h1>
      <h3 className="text-lg mt-2 opacity-90">Discover where the products have reached.</h3>
    </div>
  </div>
</section>
            <div className="min-h-screen bg-blue-600 text-white flex flex-col">
                <div className="container mx-auto px-6 py-12 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Left column - texte */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-3 mt-3">
                                <span className="bg-orange-300 text-orange-900 text-sm font-semibold px-3 py-1 rounded-full">Fast & Reliable Delivery</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mt-6">
                                Track Your
                                <span className="text-yellow-300 block">Delivery</span>
                            </h1>

                            <p className="text-lg text-white/90 max-w-xl">
                                Stay updated on your order status in real time with our advanced tracking system.
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                <button 
                                    onClick={() => {
                                        const trackingSection = document.getElementById('tracking-input');
                                        if (trackingSection) {
                                            trackingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                    className="bg-white text-blue-600 font-semibold px-5 py-3 rounded-lg shadow hover:shadow-lg transition"
                                >
                                    Track Package
                                </button>

                                <Link 
                                    to="/about"
                                    className="border border-white/30 text-white/95 px-4 py-3 rounded-lg hover:bg-white/10 transition inline-block"
                                >
                                    Learn More
                                </Link>
                            </div>

                            <div className="mt-6 flex gap-4 items-center text-sm text-white/90">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Real-time Updates</span>
                                </div>

                                <div className="flex items-center gap-2 opacity-90">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2l4 4-4 4-4-4 4-4zM6 10v8a2 2 0 002 2h8a2 2 0 002-2v-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Secure Delivery</span>
                                </div>
                            </div>
                        </div>

                        {/* Right column - image card */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="w-full max-w-md lg:max-w-lg bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-6 shadow-2xl">
                                {/* Image container */}
                                <div className="relative rounded-xl overflow-hidden">
                                    <img
                                        src={deliveryImg}
                                        alt="delivery truck"
                                        className="w-full h-56 object-cover"
                                    />

                                    {/* Floating badge top-left */}
                                    <div className="absolute left-4 top-4 bg-white text-blue-700 px-3 py-2 rounded-lg flex items-center gap-2 shadow">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="text-sm font-semibold">24/7</div>
                                        <div className="text-xs text-slate-700">Delivery Service</div>
                                    </div>

                                    {/* Floating badge bottom-right */}
                                    <div className="absolute right-4 bottom-4 bg-white text-blue-700 px-3 py-2 rounded-lg flex items-center gap-2 shadow">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="text-sm font-semibold">99.9%</div>
                                        <div className="text-xs text-slate-700">Success Rate</div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative circles */}
                            <div className="hidden lg:block absolute -left-12 top-20 w-6 h-6 bg-white/20 rounded-full" />
                            <div className="hidden lg:block absolute -right-8 bottom-8 w-4 h-4 bg-yellow-300 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom white panel with form */}
            <section className="bg-white rounded-t-3xl mt-8 text-slate-800 flex-grow">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-600 mx-auto">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 12l2-2 4 4 8-8 4 4v6a2 2 0 01-2 2H5a2 2 0 01-2-2V12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold mt-4">Enter Your Tracking Details</h2>
                        <p className="text-slate-500 mt-2">Enter your Order ID to track your package</p>
                    </div>

                    <form id="tracking-input" className="max-w-2xl mx-auto" onSubmit={handleTrackOrder}>
                        <div className="flex gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Enter Order ID"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Tracking...' : 'Track Order'}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <p className="text-sm text-slate-500 text-center mt-4">We will send real-time updates to your email or phone.</p>
                    </form>
                </div>
            </section>
             {/* === ICI : insertion de TrackingInfo === */}
            {trackingData && orderData && (
                <TrackingInfo delivery={trackingData} order={orderData} />
            )}
            {/* === fin insertion === */}
            <hr className="h-[2px] bg-yellow-500 border-0" />
            <Footer />
        </div>
    );
};

export default DeliveryPage;
