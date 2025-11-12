import React, { useState } from "react";
import { FaCircle, FaCheckCircle, FaTruck, FaClock, FaDollarSign } from "react-icons/fa";

/**
 * TrackingInfo.jsx
 * - Utilise Tailwind CSS
 * - Installer: npm i react-icons
 * - Remplace les données factices par ton API si besoin
 */

const trackingEvents = [
  {
    id: 1,
    title: "Order Confirmed",
    time: "2025-11-07 09:12",
    desc: "Your order has been confirmed and is being prepared.",
    status: "done",
  },
  {
    id: 2,
    title: "Package Shipped",
    time: "2025-11-08 11:30",
    desc: "Package picked up by carrier.",
    status: "done",
  },
  {
    id: 3,
    title: "In Transit",
    time: "2025-11-09 14:20",
    desc: "On the way to the destination hub.",
    status: "current",
  },
  {
    id: 4,
    title: "Out for Delivery",
    time: "—",
    desc: "Will be delivered today.",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Delivered",
    time: "—",
    desc: "Package delivered to recipient.",
    status: "upcoming",
  },
];

const deliveryOptions = [
  { id: "standard", title: "Standard Delivery", eta: "5-7 business days", price: 5.99, icon: <FaTruck /> },
  { id: "express", title: "Express Delivery", eta: "2-3 business days", price: 12.99, icon: <FaClock /> },
  { id: "free", title: "Free Delivery", eta: "8-12 business days", price: 0, icon: <FaDollarSign /> },
];

export default function TrackingInfo() {
  const [selectedOption, setSelectedOption] = useState("standard");

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
              {trackingEvents.map((ev, idx) => (
                <li key={ev.id} className="flex items-start gap-4">
                  {/* vertical line + marker */}
                  <div className="flex flex-col items-center">
                    <div className="z-10">
                      {ev.status === "done" ? (
                        <FaCheckCircle className="text-green-500 w-5 h-5" />
                      ) : ev.status === "current" ? (
                        <FaCircle className="text-blue-500 w-4 h-4" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-slate-300" />
                      )}
                    </div>
                    {idx < trackingEvents.length - 1 && <div className="w-px bg-slate-200 h-full mt-2" />}
                  </div>

                  {/* content */}
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <h3 className={`text-sm font-semibold ${ev.status === "current" ? "text-blue-600" : "text-slate-800"}`}>
                        {ev.title}
                      </h3>
                      <time className="text-xs text-slate-400">{ev.time}</time>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{ev.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Delivery details card (right) */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Delivery Details</h4>

            <dl className="text-sm text-slate-600 space-y-3">
              <div className="flex justify-between">
                <dt className="font-medium">Delivery Address</dt>
                <dd className="text-right">1234 Main St, City, Country</dd>
              </div>

              <div className="flex justify-between">
                <dt className="font-medium">Delivery Method</dt>
                <dd className="text-right">Standard</dd>
              </div>

              <div className="flex justify-between">
                <dt className="font-medium">Carrier</dt>
                <dd className="text-right">CarrierName</dd>
              </div>

              <div className="flex justify-between">
                <dt className="font-medium">Tracking No.</dt>
                <dd className="text-right">ABC123456789</dd>
              </div>
            </dl>

            <button
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
              onClick={() => alert("Ouvrir le suivi complet...")}
            >
              Voir le suivi complet
            </button>
          </div>
        </aside>
      </div>

      {/* Delivery Options */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-slate-900">Delivery Options</h3>
        <p className="text-sm text-slate-500 mt-2">Choose the delivery option that works best for you</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {deliveryOptions.map((opt) => {
            const active = selectedOption === opt.id;
            return (
              <div
                key={opt.id}
                role="button"
                onClick={() => setSelectedOption(opt.id)}
                className={`cursor-pointer rounded-xl border p-6 shadow-sm hover:shadow-md transition flex flex-col items-start gap-4 ${
                  active ? "border-blue-500 bg-blue-50" : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                    {opt.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{opt.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.eta}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between w-full">
                  <div className="text-sm text-slate-700 font-medium">{opt.price === 0 ? "Free" : `$${opt.price.toFixed(2)}`}</div>
                  {active ? <div className="text-xs text-blue-600 font-semibold">Selected</div> : <div className="text-xs text-slate-400">Choose</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}