import React from 'react';
import Header from '../components/HeaderAdmin';
import Footer from '../components/Footer';

export default function DashboardFournisseur() {
  return (
    <div>
      <Header />
      {/* === fin insertion === */}
      <hr className="h-[2px] bg-yellow-500 border-0" />
      <Footer />
    </div>
  );
}