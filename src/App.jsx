import React from 'react'
import { Routes, Route } from 'react-router-dom'  
import Home from './pages/Home'
import Products from './pages/Products'
import Categories from './pages/Categories'
<<<<<<< HEAD
import AuthCard from './pages/AuthCard'
import Delivery from './pages/Delivery'
import CartPage from "./pages/CartPage"
import PaymentPage from "./pages/PaymentPage"
import AboutPage from "./pages/AboutPage"
import AdminDashboard from './pages/DashboardAdmin' 
import FournisseurDashboard from './pages/DashboardFournisseur';
import PricingPage from './pages/Abonnement'
import Paiementabonne from './pages/PaiementAbonnement'
=======
import AuthCard from './components/AuthCard'
>>>>>>> e777cea7a42e948f468d82570f600a74f6a41968

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
<<<<<<< HEAD
        <Route path="/authentifier" element={<AuthCard />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/connectedAdmin" element={<AdminDashboard />} />
        <Route path="/abonnement" element={<PricingPage />} />
        <Route path="/paiementAbonne" element={<Paiementabonne />} />
        <Route path="/dashboardFournisseur" element={<FournisseurDashboard />} />
=======
          <Route path="/authentifier" element={<AuthCard />} />
>>>>>>> e777cea7a42e948f468d82570f600a74f6a41968
      </Routes>
    </div>
  )
}
<<<<<<< HEAD

=======
>>>>>>> e777cea7a42e948f468d82570f600a74f6a41968
export default App
