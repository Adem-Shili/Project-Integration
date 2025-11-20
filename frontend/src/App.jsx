import React from 'react'
import { Routes, Route } from 'react-router-dom'  
import { AuthProvider } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Products from './pages/Products'
import Categories from './pages/Categories'
import AuthCard from './pages/AuthCard'
import Delivery from './pages/Delivery'
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import AboutPage from "./pages/AboutPage";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/authentifier" element={<AuthCard />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/confirmation/:orderNumber" element={<OrderConfirmation />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AuthProvider>
  )
}
export default App
