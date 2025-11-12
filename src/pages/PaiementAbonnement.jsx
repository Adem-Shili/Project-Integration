import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const plan = location.state?.plan || JSON.parse(localStorage.getItem('selectedPlan'));
    if (plan) {
      setSelectedPlan(plan);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const handleClose = () => {
    navigate('/abonnement');
  };

  const [formData, setFormData] = useState({
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    fullName: '',
    addressLine1: ''
  });

  // Fonctions de validation
  const validateCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!cleaned) return 'Le numéro de carte est requis';
    if (!/^\d+$/.test(cleaned)) return 'Le numéro de carte doit contenir uniquement des chiffres';
    if (cleaned.length < 13 || cleaned.length > 19) return 'Le numéro de carte doit contenir entre 13 et 19 chiffres';
    
    // Algorithme de Luhn pour vérifier la validité
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    if (sum % 10 !== 0) return 'Le numéro de carte n\'est pas valide';
    
    return '';
  };

  const validateExpirationDate = (date) => {
    if (!date) return 'La date d\'expiration est requise';
    if (!/^\d{2}\/\d{2}$/.test(date)) return 'Format invalide (MM/AA requis)';
    
    const [month, year] = date.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) return 'Mois invalide (doit être entre 01 et 12)';
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'La carte est expirée';
    }
    
    return '';
  };

  const validateSecurityCode = (code) => {
    if (!code) return 'Le code de sécurité est requis';
    if (!/^\d+$/.test(code)) return 'Le code doit contenir uniquement des chiffres';
    if (code.length < 3 || code.length > 4) return 'Le code doit contenir 3 ou 4 chiffres';
    return '';
  };

  const validateFullName = (name) => {
    if (!name.trim()) return 'Le nom complet est requis';
    if (name.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères';
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(name)) return 'Le nom contient des caractères invalides';
    return '';
  };

  const validateAddress = (address) => {
    if (!address.trim()) return 'L\'adresse est requise';
    if (address.trim().length < 5) return 'L\'adresse doit contenir au moins 5 caractères';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      cardNumber: validateCardNumber(formData.cardNumber),
      expirationDate: validateExpirationDate(formData.expirationDate),
      securityCode: validateSecurityCode(formData.securityCode),
      fullName: validateFullName(formData.fullName),
      addressLine1: validateAddress(formData.addressLine1)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatage automatique
    let formattedValue = value;
    
    switch (name) {
      case 'cardNumber':
        // Formatage du numéro de carte (groupes de 4 chiffres)
        formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
        if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
        break;
      
      case 'expirationDate':
        // Formatage date MM/AA
        formattedValue = value.replace(/\D/g, '');
        if (formattedValue.length >= 2) {
          formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
        }
        if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
        break;
      
      case 'securityCode':
        // Limiter à 4 chiffres maximum
        formattedValue = value.replace(/\D/g, '').substring(0, 4);
        break;
      
      default:
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Validation en temps réel (optionnel)
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validation lors de la perte de focus
    let error = '';
    
    switch (name) {
      case 'cardNumber':
        error = validateCardNumber(value);
        break;
      case 'expirationDate':
        error = validateExpirationDate(value);
        break;
      case 'securityCode':
        error = validateSecurityCode(value);
        break;
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'addressLine1':
        error = validateAddress(value);
        break;
      default:
        break;
    }
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedPlan?.id === 'enterprise') {
      // Logique pour le plan enterprise (contact)
      alert('Merci de nous contacter pour le forfait Enterprise');
      return;
    }

    if (!validateForm()) {
      alert('Veuillez corriger les erreurs dans le formulaire avant de soumettre');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler un traitement de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Paiement pour le plan:', selectedPlan);
      console.log('Données de paiement:', formData);
      
      alert(`Félicitations ! Vous avez souscrit au forfait ${selectedPlan.name}`);
      navigate('/dashboardFournisseur');
    } catch (error) {
      console.error('Erreur de paiement:', error);
      alert('Une erreur est survenue lors du paiement. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de votre forfait...</p>
          </div>
        </div>
      </div>
    );
  }

  const getPlanPrice = () => {
    if (selectedPlan.id === 'enterprise') {
      return 'Sur devis';
    }
    return selectedPlan.price;
  };

  const getTaxes = () => {
    if (selectedPlan.id === 'enterprise') return '0,00 $US';
    const price = parseFloat(selectedPlan.price.replace('$', ''));
    return (price * 0).toFixed(2) + ' $US';
  };

  const getTotal = () => {
    if (selectedPlan.id === 'enterprise') return 'Sur devis';
    const price = parseFloat(selectedPlan.price.replace('$', ''));
    return (price * 1).toFixed(2) + ' $US';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full relative">
        <button 
          className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-300 z-10"
          onClick={handleClose}
          aria-label="Fermer"
        >
          ×
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne gauche - Formulaire de paiement */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Configurer votre forfait
            </h1>
            <p className="text-blue-600 font-semibold mb-6">
              Forfait {selectedPlan.name} - {selectedPlan.price}
            </p>
            
            <form onSubmit={handleSubmit}>
              {/* Mode de paiement */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Mode de paiement
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de carte
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      <div className="absolute right-3 top-3">
                        <span className="text-blue-600 font-bold text-sm">VISA</span>
                      </div>
                    </div>
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="MM/AA"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.expirationDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.expirationDate && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.expirationDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code de sécurité
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="securityCode"
                          value={formData.securityCode}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="123"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.securityCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        <div className="absolute right-3 top-3">
                          <span className="text-gray-500 text-sm">CVC</span>
                        </div>
                      </div>
                      {errors.securityCode && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="mr-1">⚠</span>
                          {errors.securityCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Adresse de facturation */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Adresse de facturation
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Votre nom complet"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays ou région
                    </label>
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      <span className="text-gray-700">Tunisie</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse - Ligne 1
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Votre adresse complète"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.addressLine1 ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.addressLine1 && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Colonne droite - Détails du forfait */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Forfait {selectedPlan.name}
              </h3>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Fonctionnalités principales
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {selectedPlan.mainFeatures?.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-300 my-6"></div>

            <div className="mb-6">
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-2 text-gray-600">Abonnement Mensuel</td>
                    <td className="py-2 text-right font-semibold">{getPlanPrice()}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Taxes (0%)</td>
                    <td className="py-2 text-right">{getTaxes()}</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-3 font-semibold text-gray-800">Total dû aujourd'hui</td>
                    <td className="py-3 text-right font-bold text-lg text-blue-600">{getTotal()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 mb-4 ${
                selectedPlan.id === 'enterprise'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${!isSubmitting && 'hover:scale-105'}`}
            >
              {isSubmitting ? 'Traitement en cours...' : selectedPlan.id === 'enterprise' ? 'Contactez-nous' : 'S\'abonner maintenant'}
            </button>

            <div className="text-center space-y-2">
              <button type="button" className="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-300">
                Conditions générales
              </button>
              <div>
                <button type="button" className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-300">
                  Politique de remboursement
                </button>
              </div>
            </div>

            {/* Message de sécurité */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">🔒</span>
                <p className="text-xs text-blue-700">
                  Vos informations de paiement sont sécurisées et cryptées
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;