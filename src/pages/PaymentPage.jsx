import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import pc from "../assets/pc.jpeg";
import phone from "../assets/montre.jpg";

const PaymentPage = () => {
  const cartItems = [
    {
      id: 1,
      name: "Premium Laptop",
      price: 1299,
      quantity: 1,
      image: pc,
    },
    {
      id: 2,
      name: "Smart Phone",
      price: 899,
      quantity: 1,
      image: phone,
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = subtotal * 0.05; // ex. remise 5%
  const shipping = 15;
  const total = subtotal - discount + shipping;
  return (
    <>
      <Header />

      {/* Bandeau bleu haut */}
      <section className="bg-primary-blue text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/cart" className="flex items-center gap-2 text-white hover:opacity-80 transition">
            <FaArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-2xl font-normal">Checkout – Payment</h1>
        </div>
      </section>

      {/* Contenu principal */}
      <main className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Colonne gauche : résumé commande */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-primary-blue mb-1">
                Order Summary ({cartItems.length} items)
              </h2>
              <p className="text-gray-600">Please review your items before payment</p>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary-blue">{item.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="bg-white border rounded-lg p-6 shadow-sm space-y-3">
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Discount (5%)</span>
                <span className="text-green-600">−${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base font-semibold text-primary-blue">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Colonne droite : paiement */}
          <aside className="bg-white border rounded-lg p-6 shadow-sm h-fit">
            <h3 className="text-lg font-semibold text-primary-blue mb-4">Payment Details</h3>

            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Expiration Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                </div>
              </div>

              <Link
                to="/confirmation"
                className="block w-full bg-primary-blue text-white font-semibold py-3 rounded-lg text-center hover:bg-blue-700 transition"
              >
                Pay Now
              </Link>
            </form>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PaymentPage;
