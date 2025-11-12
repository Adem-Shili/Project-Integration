import logoFull from '../assets/logo_complet.png'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import BestSellers from '../components/BestSellers'
import CTA from '../components/CTA'
import Footer from '../components/Footer'


export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <BestSellers />
      <CTA />
      <Footer />
    </div>
  )
}
