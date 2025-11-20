import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { cartAPI, ordersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import pc from "../assets/pc.jpeg";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Payment form state
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [address, setAddress] = useState('');
  const [formErrors, setFormErrors] = useState({});

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
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      const data = await cartAPI.getCart(userId);
      setCartItems(data);
      setError('');
    } catch (err) {
      setError('Failed to load cart items.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateCardNumber = (number) => {
    // Remove spaces and check if it's 16 digits
    const cleaned = number.replace(/\s/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiryDate = (date) => {
    // Format: MM/YY
    if (!/^\d{2}\/\d{2}$/.test(date)) {
      return false;
    }
    
    const [monthStr, yearStr] = date.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    
    // Month must be between 01 and 12
    if (month < 1 || month > 12) {
      return false;
    }
    
    // Year must be 25 or higher (2025 or later)
    if (year < 25) {
      return false;
    }
    
    // Check if date is expired based on current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits (e.g., 25 for 2025)
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so +1 for 1-12
    
    // If year is less than current year, expired
    if (year < currentYear) {
      return false;
    }
    
    // If year equals current year, month must be greater than current month
    // If year is 25 and month is 12, check if we're past December 2025
    if (year === currentYear) {
      if (month <= currentMonth) {
        return false; // Expired
      }
    }
    
    // Special case: Reject 12/25 or any date in 2025 that's already passed
    if (year === 25) {
      const fullCurrentYear = currentDate.getFullYear();
      if (fullCurrentYear > 2025) {
        return false; // We're past 2025, so 25 is expired
      }
      if (fullCurrentYear === 2025) {
        // We're in 2025, check if the month has passed
        if (month <= currentMonth) {
          return false; // This month or earlier has passed
        }
      }
    }
    
    return true;
  };

  const validateCVC = (cvc) => {
    // 3 or 4 digits
    return /^\d{3,4}$/.test(cvc);
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Add space every 4 digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Limit to 4 digits max
    const limited = cleaned.substring(0, 4);
    
    // Add slash after 2 digits
    if (limited.length >= 2) {
      const month = limited.substring(0, 2);
      const year = limited.substring(2, 4);
      
      // Validate month as user types (prevent > 12)
      const monthNum = parseInt(month, 10);
      if (month.length === 2 && (monthNum < 1 || monthNum > 12)) {
        // If month is invalid, only return the first digit
        return limited.substring(0, 1);
      }
      
      return month + '/' + year;
    }
    return limited;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (formatted.replace(/\s/g, '').length > 0 && !validateCardNumber(formatted)) {
      setFormErrors({ ...formErrors, cardNumber: 'Card number must be 16 digits' });
    } else {
      const { cardNumber, ...rest } = formErrors;
      setFormErrors(rest);
    }
  };

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    
    if (formatted.length === 5) {
      // Only validate when complete (MM/YY format)
      if (!validateExpiryDate(formatted)) {
        const [monthStr, yearStr] = formatted.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        
        if (month < 1 || month > 12) {
          setFormErrors({ ...formErrors, expiryDate: 'Month must be between 01 and 12' });
        } else if (year < 25) {
          setFormErrors({ ...formErrors, expiryDate: 'Year must be 25 or higher' });
        } else {
          setFormErrors({ ...formErrors, expiryDate: 'This card has expired' });
        }
      } else {
        const { expiryDate, ...rest } = formErrors;
        setFormErrors(rest);
      }
    } else if (formatted.length > 0) {
      // Clear error if user is still typing
      const { expiryDate, ...rest } = formErrors;
      setFormErrors(rest);
    }
  };

  const handleCVCChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvc(value);
    if (value.length > 0 && !validateCVC(value)) {
      setFormErrors({ ...formErrors, cvc: 'CVC must be 3-4 digits' });
    } else {
      const { cvc, ...rest } = formErrors;
      setFormErrors(rest);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    if (!cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';
    if (!validateCardNumber(cardNumber)) errors.cardNumber = 'Card number must be 16 digits';
    
    // Enhanced expiry date validation
    if (!expiryDate || expiryDate.length !== 5) {
      errors.expiryDate = 'Expiry date is required (MM/YY)';
    } else if (!validateExpiryDate(expiryDate)) {
      const [monthStr, yearStr] = expiryDate.split('/');
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      
      if (month < 1 || month > 12) {
        errors.expiryDate = 'Month must be between 01 and 12';
      } else if (year < 25) {
        errors.expiryDate = 'Year must be 25 or higher';
      } else {
        errors.expiryDate = 'This card has expired. Please use a valid expiry date';
      }
    }
    
    if (!validateCVC(cvc)) errors.cvc = 'CVC must be 3-4 digits';
    if (!address.trim()) errors.address = 'Delivery address is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    try {
      setProcessing(true);
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      
      // Get delivery option from location state or default to standard
      const deliveryOption = location.state?.deliveryOption || "standard";
      
      // Create order
      const order = await ordersAPI.create({
        userId,
        address: address.trim(),
        deliveryOption: deliveryOption
      });

      // Navigate to confirmation page with order ID
      navigate(`/confirmation/${order.orderNumber}`);
    } catch (err) {
      // Better error handling
      let errorMessage = 'Failed to process payment. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error creating order:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.product?.price) || 0;
    const quantity = item.quantity || 0;
    return acc + (price * quantity);
  }, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
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

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading cart items...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="bg-white border rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
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
                const itemTotal = price * (item.quantity || 0);
                
                return (
                  <div
                    key={item.id}
                    className="bg-white border rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={product.imageUrl || pc}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary-blue">{product.name || 'Product'}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
                    </div>
                    <span className="text-lg font-semibold text-gray-800">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}

            <div className="bg-white border rounded-lg p-6 shadow-sm space-y-3">
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-medium">Free</span>
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

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => {
                    setCardholderName(e.target.value);
                    const { cardholderName, ...rest } = formErrors;
                    setFormErrors(rest);
                  }}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.cardholderName ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.cardholderName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.cardholderName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.cardNumber ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Expiration Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength={5}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                      formErrors.expiryDate ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.expiryDate && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={handleCVCChange}
                    maxLength={4}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                      formErrors.cvc ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.cvc && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.cvc}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Delivery Address</label>
                <textarea
                  placeholder="123 Main St, City, State, ZIP"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    const { address, ...rest } = formErrors;
                    setFormErrors(rest);
                  }}
                  rows={3}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                    formErrors.address ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={processing || cartItems.length === 0}
                className="block w-full bg-primary-blue text-white font-semibold py-3 rounded-lg text-center hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PaymentPage;
