import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import pc from "../assets/pc.jpeg"; 
import phone from "../assets/montre.jpg";
import headset from "../assets/sports.png";

const CartPage = () => {
  // Données d’exemple
  const cartItems = [
    {
      id: 1,
      name: "Premium Laptop",
      category: "Electronics",
      description: "High-performance laptop for work and gaming",
      price: 1299,
      originalPrice: 1499,
      quantity: 1,
      image: pc,
    },
    {
      id: 2,
      name: "Smart Phone",
      category: "Electronics",
      description: "Latest model with advanced camera features",
      price: 899,
      originalPrice: 999,
      quantity: 2,
      image: phone,
    },
    {
      id: 3,
      name: "Wireless Headphones",
      category: "Audio",
      description: "Premium sound quality with noise cancellation",
      price: 199,
      quantity: 1,
      image: headset,
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% taxe d’exemple
  const total = subtotal + tax;

  return (
    <>
      <Header />

      {/* Bandeau supérieur */}
      <section className="bg-primary-blue text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link
            to="/products"
            className="flex items-center gap-2 text-white hover:opacity-80 transition"
          >
            <FaArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-2xl font-normal">My Cart</h1>
        </div>
      </section>

      {/* Section principale */}
      <main className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-primary-blue mb-1">
                Shopping Cart ({cartItems.length} items)
              </h2>
              <p className="text-gray-600">
                Review your items and proceed to checkout
              </p>
            </div>

            {cartItems.map((item) => (
              <article
                key={item.id}
                className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary-blue">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-semibold text-primary-blue">
                      ${item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  {/* Quantité */}
                  <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                    <button className="text-primary-blue hover:text-blue-700">−</button>
                    <span>{item.quantity}</span>
                    <button className="text-primary-blue hover:text-blue-700">+</button>
                  </div>
                  <span className="text-base font-semibold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Résumé de commande */}
          <aside className="bg-white border rounded-lg p-6 shadow-sm h-fit">
            <h3 className="text-lg font-semibold text-primary-blue mb-4">
              Order Summary
            </h3>
            <ul className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between text-sm text-gray-700">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t pt-3 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-3 flex justify-between text-base font-semibold text-primary-blue">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
<Link
  to="/payment"
  className="block w-full mt-6 bg-primary-blue text-white font-semibold py-3 rounded-lg text-center hover:bg-blue-700 transition"
>
  Proceed to Checkout
</Link>

          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CartPage;
