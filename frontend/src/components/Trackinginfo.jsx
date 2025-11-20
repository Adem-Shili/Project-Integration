import React from "react";
import { Link } from "react-router-dom";
import { FaCircle, FaCheckCircle } from "react-icons/fa";

/**
 * TrackingInfo.jsx
 * - Shows tracking status based on delivery status
 * - Status colors: done=green, pending=blue, not reached=gray
 */

const statusOrder = [
  { key: "ORDERED", title: "Ordered", desc: "Your order has been confirmed and is being prepared." },
  { key: "IN_TRANSIT", title: "In Transit", desc: "Package is on the way to the destination hub." },
  { key: "OUT_FOR_DELIVERY", title: "Out for Delivery", desc: "Package is out for delivery." },
  { key: "DELIVERED", title: "Delivered", desc: "Package delivered to recipient." },
];

// Format delivery option
const formatDeliveryOption = (option) => {
  if (!option) return 'Standard Delivery';
  const options = {
    'standard': 'Standard Delivery',
    'express': 'Express Delivery',
    'free': 'Free Delivery'
  };
  return options[option] || option;
};

// Get status index based on delivery status
const getStatusIndex = (deliveryStatus) => {
  switch (deliveryStatus) {
    case 'PENDING':
      return 0; // Ordered
    case 'IN_TRANSIT':
      return 1; // In Transit
    case 'OUT_FOR_DELIVERY':
      return 2; // Out for Delivery
    case 'DELIVERED':
      return 3; // Delivered
    default:
      return 0; // Default to Ordered
  }
};

// Get status state: "done", "pending", or "upcoming"
const getStatusState = (currentIndex, statusIndex) => {
  if (currentIndex < statusIndex) {
    return "done"; // Completed - green
  } else if (currentIndex === statusIndex) {
    return "pending"; // Current - blue
  } else {
    return "upcoming"; // Not reached - gray
  }
};

export default function TrackingInfo({ delivery, order }) {
  if (!delivery || !order) {
    return null;
  }

  const currentStatusIndex = getStatusIndex(delivery.status);
  // Note: user info might not be available due to @JsonIgnore, handle gracefully
  const user = order.user || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-slate-900">Tracking Information</h2>
        <p className="text-sm text-slate-500 mt-2">Real-time updates for your delivery</p>
      </div>

      {/* Main content: timeline + details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Timeline (left) */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <ul className="space-y-6">
              {statusOrder.map((status, idx) => {
                const statusState = getStatusState(idx, currentStatusIndex);
                return (
                  <li key={status.key} className="flex items-start gap-4">
                    {/* vertical line + marker */}
                    <div className="flex flex-col items-center">
                      <div className="z-10">
                        {statusState === "done" ? (
                          <FaCheckCircle className="text-green-500 w-5 h-5" />
                        ) : statusState === "pending" ? (
                          <FaCircle className="text-blue-500 w-5 h-5" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-gray-300" />
                        )}
                      </div>
                      {idx < statusOrder.length - 1 && <div className="w-px bg-slate-200 h-full mt-2" />}
                    </div>

                    {/* content */}
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <h3 className={`text-sm font-semibold ${
                          statusState === "pending" ? "text-blue-600" : 
                          statusState === "done" ? "text-green-600" : 
                          "text-slate-400"
                        }`}>
                          {status.title}
                        </h3>
                        {statusState === "done" && delivery.orderDate && (
                          <time className="text-xs text-slate-400">
                            {new Date(delivery.orderDate).toLocaleDateString()}
                          </time>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${
                        statusState === "upcoming" ? "text-slate-400" : "text-slate-500"
                      }`}>
                        {status.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Delivery details card (right) */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Delivery Details</h4>

            <dl className="text-sm text-slate-600 space-y-3">
              <div>
                <dt className="font-medium mb-1">Delivery Address</dt>
                <dd className="text-slate-800">{delivery.address || 'N/A'}</dd>
              </div>

              <div>
                <dt className="font-medium mb-1">Delivery Method</dt>
                <dd className="text-slate-800">{formatDeliveryOption(order.deliveryOption)}</dd>
              </div>
            </dl>

            <Link
              to="/profile"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
            >
              Check Order History
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
