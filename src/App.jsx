import React from 'react'
import { Routes, Route } from 'react-router-dom'  
import Home from './pages/Home'
import Products from './pages/Products'
import Categories from './pages/Categories'
import AuthCard from './components/AuthCard'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
          <Route path="/authentifier" element={<AuthCard />} />
      </Routes>
    </div>
  )
}
export default App
