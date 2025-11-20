import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTruck } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/authentifier');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Generate tracking number from order number
  const trackingNumber = orderNumber ? `TRK${orderNumber}` : '';

  return (
    <>
      <Header />

      {/* Main Content */}
      <main className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message Card */}
          <div className="bg-white border rounded-lg p-12 text-center shadow-sm">
            <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            
            <h1 className="text-3xl font-semibold text-primary-blue mb-4">
              Order Confirmed!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Your order number <span className="font-semibold text-primary-blue">{orderNumber || 'N/A'}</span> has been set and is being processed.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Track Order Link */}
              {trackingNumber && (
                <Link
                  to={`/delivery?tracking=${trackingNumber}`}
                  className="inline-flex items-center gap-2 bg-primary-blue text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  <FaTruck className="w-5 h-5" />
                  <span>Track Your Order</span>
                </Link>
              )}

              {/* Get Novice Button */}
              <button
                className="border-2 border-primary-yellow text-primary-yellow font-semibold px-8 py-3 rounded-lg hover:bg-yellow-50 transition"
                onClick={() => {
                  // Empty for now as requested
                }}
              >
                Get Novice
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default OrderConfirmation;

