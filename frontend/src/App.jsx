import React from 'react'
import { Routes, Route } from 'react-router-dom'  
import Home from './pages/Home'
import Products from './pages/Products'
import Categories from './pages/Categories'
<<<<<<< HEAD
import AuthCard from './pages/AuthCard'
import Delivery from './pages/Delivery'
import About from './pages/About'

=======
import AuthCard from './components/AuthCard'
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import AboutPage from "./pages/AboutPage"
>>>>>>> f97ed5adb232df83821edcf16855247c2696e46d
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
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
export default App;
=======
          <Route path="/authentifier" element={<AuthCard />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
        <Route path="/about" element={<AboutPage />} /> 

      </Routes>
    </div>
  )
}
export default App
>>>>>>> f97ed5adb232df83821edcf16855247c2696e46d
