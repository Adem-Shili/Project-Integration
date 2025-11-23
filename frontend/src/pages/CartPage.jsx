import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaTruck, FaClock, FaDollarSign } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { cartAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import pc from "../assets/pc.jpeg";

const deliveryOptions = [
  { id: "standard", title: "Standard Delivery", eta: "5-7 business days", price: 5.99, icon: <FaTruck /> },
  { id: "express", title: "Express Delivery", eta: "2-3 business days", price: 12.99, icon: <FaClock /> },
  { id: "free", title: "Free Delivery", eta: "8-12 business days", price: 0, icon: <FaDollarSign /> },
];

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState("standard");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/authentifier');
      return;
    }
    fetchCartItems();
  }, [isAuthenticated, user, navigate]);

  const fetchCartItems = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError('');
      // Ensure userId is a number
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      const data = await cartAPI.getCart(userId);
      if (Array.isArray(data)) {
        setCartItems(data);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load cart items. Please try again.');
      setCartItems([]);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    if (!user?.id) return;

    // Optimistically update the UI
    const previousItems = [...cartItems];
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      setUpdating({ ...updating, [cartItemId]: true });
      // Ensure userId is a number
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      await cartAPI.updateItem(userId, cartItemId, newQuantity);
      // Notify header to refresh cart count
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      // Revert on error
      setCartItems(previousItems);
      setError('Failed to update quantity.');
      console.error('Error updating quantity:', err);
    } finally {
      setUpdating({ ...updating, [cartItemId]: false });
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (!user?.id) return;

    // Optimistically remove the item from UI
    const previousItems = [...cartItems];
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));

    try {
      setUpdating({ ...updating, [cartItemId]: true });
      // Ensure userId is a number
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      await cartAPI.removeItem(userId, cartItemId);
      // Notify header to refresh cart count
      window.dispatchEvent(new Event('cartUpdated'));
      setError(''); // Clear any previous errors
    } catch (err) {
      // Revert on error
      setCartItems(previousItems);
      setError('Failed to remove item.');
      console.error('Error removing item:', err);
    } finally {
      setUpdating({ ...updating, [cartItemId]: false });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.product?.price) || 0;
    const quantity = item.quantity || 0;
    return acc + (price * quantity);
  }, 0);
  const tax = subtotal * 0.08; // 8% tax
  const selectedOption = deliveryOptions.find(opt => opt.id === selectedDeliveryOption);
  const deliveryFee = selectedOption ? selectedOption.price : 0;
  const total = subtotal + tax + deliveryFee;

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
                Shopping Cart ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
              </h2>
              <p className="text-gray-600">
                Review your items and proceed to checkout
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-text-muted">Loading cart...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="bg-white border rounded-lg p-12 text-center">
                <p className="text-text-muted text-lg mb-4">Your cart is empty</p>
                <Link
                  to="/products"
                  className="inline-block bg-primary-blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              cartItems.map((item) => {
                const product = item.product || {};
                const price = parseFloat(product.price) || 0;
                const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
                const itemTotal = price * (item.quantity || 0);

                return (
                  <article
                    key={item.id}
                    className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={product.imageUrl || pc}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary-blue">{product.name || 'Product'}</h3>
                      <p className="text-sm text-gray-500">
                        {product.category?.name || 'Uncategorized'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.description || 'No description available'}
                      </p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-semibold text-primary-blue">
                          ${price.toFixed(2)}
                        </span>
                        {originalPrice && originalPrice > price && (
                          <span className="text-sm text-gray-400 line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-2 border rounded-md px-3 py-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                          disabled={updating[item.id] || (item.quantity || 1) <= 1}
                          className="text-primary-blue hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center">{item.quantity || 1}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                          disabled={updating[item.id]}
                          className="text-primary-blue hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-base font-semibold text-gray-800">
                        ${itemTotal.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updating[item.id]}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Résumé de commande */}
          <aside className="bg-white border rounded-lg p-6 shadow-sm h-fit">
            <h3 className="text-lg font-semibold text-primary-blue mb-4">
              Order Summary
            </h3>
            <ul className="space-y-2 mb-4">
              {cartItems.map((item) => {
                const product = item.product || {};
                const price = parseFloat(product.price) || 0;
                const quantity = item.quantity || 0;
                return (
                  <li key={item.id} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {product.name || 'Product'} × {quantity}
                    </span>
                    <span>${(price * quantity).toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>

            <div className="border-t pt-3 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${deliveryFee.toFixed(2)}`}</span>
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
            {cartItems.length > 0 ? (
              <Link
                to="/payment"
                state={{ deliveryOption: selectedDeliveryOption }}
                className="block w-full mt-6 bg-primary-blue text-white font-semibold py-3 rounded-lg text-center hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <button
                disabled
                className="block w-full mt-6 bg-gray-300 text-gray-500 font-semibold py-3 rounded-lg text-center cursor-not-allowed"
              >
                Cart is Empty
              </button>
            )}

          </aside>
        </div>

        {/* Delivery Options Section */}
        {cartItems.length > 0 && (
          <div className="max-w-7xl mx-auto mt-10">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-primary-blue mb-2">Delivery Options</h3>
              <p className="text-sm text-gray-500 mb-6">Choose the delivery option that works best for you</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {deliveryOptions.map((opt) => {
                  const active = selectedDeliveryOption === opt.id;
                  return (
                    <div
                      key={opt.id}
                      role="button"
                      onClick={() => setSelectedDeliveryOption(opt.id)}
                      className={`cursor-pointer rounded-xl border p-6 shadow-sm hover:shadow-md transition flex flex-col items-start gap-4 ${
                        active ? "border-primary-blue bg-blue-50" : "border-slate-100 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          active ? "bg-primary-blue text-white" : "bg-blue-100 text-primary-blue"
                        }`}>
                          {opt.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-800">{opt.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{opt.eta}</p>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between w-full">
                        <div className="text-sm text-slate-700 font-medium">{opt.price === 0 ? "Free" : `$${opt.price.toFixed(2)}`}</div>
                        {active ? <div className="text-xs text-primary-blue font-semibold">Selected</div> : <div className="text-xs text-slate-400">Choose</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default CartPage;
