import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/authentifier');
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$0.99',
      description: 'Parfait pour les petits fournisseurs qui débutent.',
      buttonText: 'Get started',
      features: [
        'Jusqu\'à 10 produits en vente',
        'Tableau de bord basique',
        'Support par email',
        'Paiements sécurisés'
      ],
      mainFeatures: [
        'Gestion de base des produits',
        'Limite de 10 produits actifs',
        'Analytics simples',
        'Commission de 5% par vente'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      description: 'Idéal pour les fournisseurs en croissance.',
      buttonText: 'Get started',
      features: [
        'Jusqu\'à 100 produits en vente',
        'Tableau de dashboard avancé',
        'Support prioritaire',
        'Statistiques détaillées'
      ],
      mainFeatures: [
        'Gestion illimitée des catégories',
        'Analytics avancés',
        'Promotions et réductions',
        'Commission de 3% par vente',
        'Integration API'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'Solution complète pour les grossistes et distributeurs.',
      buttonText: 'Contact sales',
      features: [
        'Produits illimités',
        'Dashboard personnalisé',
        'Support dédié 24/7',
        'Rapports personnalisés'
      ],
      mainFeatures: [
        'Gestion multi-vendeurs',
        'API complète',
        'Solution blanche possible',
        'Commission personnalisée',
        'Formation et onboarding'
      ]
    }
  ];

  const handleGetStarted = (plan) => {
    // Stocker les infos du plan sélectionné pour la page de paiement
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    // Rediriger vers la page de paiement
    navigate('/paiementAbonne', { state: { plan } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl w-full relative">
        {/* Bouton de fermeture */}
        <button 
          className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-300 z-10"
          onClick={handleClose}
          aria-label="Fermer"
        >
          ×
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Choose your plan
          </h1>
          <p className="text-lg text-gray-600">
            Démarrez votre business en ligne avec nos forfaits fournisseurs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-blue-500 transform scale-105' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                  {plan.name}
                </h3>
                
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {plan.price}
                  </span>
                  {plan.id !== 'enterprise' && <span className="text-gray-500 text-sm">/mois</span>}
                </div>

                <p className="text-gray-600 text-center mb-4 text-sm leading-relaxed">
                  {plan.description}
                </p>

                <button
                  onClick={() => handleGetStarted(plan)}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : plan.id === 'enterprise'
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {plan.buttonText}
                </button>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700 text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;