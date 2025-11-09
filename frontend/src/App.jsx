import React from 'react'
import { Routes, Route } from 'react-router-dom'  
import Home from './pages/Home'
import Products from './pages/Products'
import Categories from './pages/Categories'
import AuthCard from './pages/AuthCard'
import Delivery from './pages/Delivery'
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import AboutPage from "./pages/AboutPage"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/authentifier" element={<AuthCard />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  )
}
export default App
