
import React, { useState } from 'react';
import { Check, Star, Crown, X, ShieldCheck, Zap, Lock, Trash2, Clock, AlertTriangle, CreditCard, Loader2, Smartphone, FileText, Settings, Eye } from 'lucide-react';
import { startSubscription } from '../services/storageService';
import { AppView } from '../types';

// ==========================================
// 🔴 ZONE DE CONFIGURATION PAIEMENT STRIPE 🔴
// Collez vos liens de paiement Stripe ici entre les guillemets quand vous les aurez.
// Tant qu'ils sont vides (""), l'application utilisera le MODE SIMULATION (Test).
// ==========================================
const STRIPE_LINKS = {
    monthly: "", // Ex: "https://buy.stripe.com/..."
    annual: "",  // Ex: "https://buy.stripe.com/..."
    lifetime: "" // Ex: "https://buy.stripe.com/..."
};

interface SubscriptionProps {
  onClose: () => void;
  isTrialExpired?: boolean;
  setView?: (view: AppView) => void;
  largeText?: boolean;
  toggleLargeText?: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ onClose, isTrialExpired = false, setView, largeText = false, toggleLargeText }) => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [processing, setProcessing] = useState(false);

  // Form states for visual simulation
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Features for Monthly Plan (Liberté)
  const featuresMonthly = [
    "Recettes illimitées",
    "Scan Frigo Anti-Gaspillage",
    "Sommelier IA (Mode Pro B2B inclus)",
    "Export Drive & Liste Partagée",
    "Sans Publicité"
  ];

  // Features for Annual/Lifetime (Premium)
  const featuresFull = [
    "Chef IA Expert (Créativité Illimitée)",
    "Photos de plats Ultra HD (MiamSaveurs™)",
    "Vidéos immersives des étapes",
    "Analyse Nutritionnelle Clinique & Nutri-Score",
    "Sommelier IA & Batch Cooking",
    "Scan Frigo Anti-Gaspillage Illimité",
    "Export Drive & Liste Partagée",
    "Mode Cuisine Immersive Vocal",
    "Support Prioritaire"
  ];

  const plans = {
      monthly: { name: 'Liberté', price: '4,99 €', billing: 'mensuel' },
      annual: { name: 'Annuel', price: '39,99 €', billing: 'annuel' },
      lifetime: { name: 'À Vie', price: '149,99 €', billing: 'unique' }
  };

  const initiatePayment = (tier: 'monthly' | 'annual' | 'lifetime') => {
      setSelectedPlan(tier);
      setShowPayment(true);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPlan) return;

      setProcessing(true);

      // 1. CHECK FOR REAL STRIPE LINK
      const stripeLink = STRIPE_LINKS[selectedPlan];
      if (stripeLink && stripeLink.length > 5) {
          // Redirect to Real Payment
          setTimeout(() => {
              window.location.href = stripeLink;
          }, 1500);
          return;
      }

      // 2. FALLBACK: SIMULATION (For Testing / Demo)
      setTimeout(() => {
          setProcessing(false);
          startSubscription(selectedPlan);
          alert(`MODE SIMULATION : Paiement accepté ! Bienvenue dans le club MiamChef Premium. Votre abonnement ${plans[selectedPlan].name} est actif.`);
          window.location.reload();
      }, 2500);
  };

  // Format credit card with spaces
  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let matches = v.match(/\d{4,16}/g);
      let match = matches && matches[0] || '';
      let parts = [];
      for (let i=0, len=match.length; i<len; i+=4) {
          parts.push(match.substring(i, i+4));
      }
      if (parts.length) {
          setCardNumber(parts.join(' '));
      } else {
          setCardNumber(v);
      }
  };

  // Payment Modal Component
  const PaymentModal = () => (
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <Lock size={16} className="text-green-600" />
                      <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">Paiement Sécurisé SSL</span>
                  </div>
                  <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <X size={20} className="text-gray-500" />
                  </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto">
                  {/* Order Summary */}
                  <div className="flex justify-between items-end mb-8 pb-6 border-b border-gray-100">
                      <div>
                          <p className="text-sm text-gray-500 mb-1">Abonnement choisi</p>
                          <h3 className="font-display text-2xl text-chef-dark">MiamChef {selectedPlan && plans[selectedPlan].name}</h3>
                      </div>
                      <div className="text-right">
                          <div className="text-2xl font-bold text-chef-green">{selectedPlan && plans[selectedPlan].price}</div>
                          <p className="text-xs text-gray-400">{selectedPlan && plans[selectedPlan].billing}</p>
                      </div>
                  </div>

                  {/* Payment Methods Tabs */}
                  <div className="flex gap-4 mb-6">
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${paymentMethod === 'card' ? 'border-chef-green bg-green-50 text-chef-green' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                      >
                          <CreditCard size={20} /> Carte Bancaire
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('paypal')}
                        className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${paymentMethod === 'paypal' ? 'border-[#0070BA] bg-blue-50 text-[#0070BA]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                      >
                          <span className="italic font-serif font-black">Pay</span><span className="italic font-serif font-bold">Pal</span>
                      </button>
                  </div>

                  {paymentMethod === 'card' ? (
                      <form onSubmit={handleProcessPayment} className="space-y-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Numéro de carte</label>
                              <div className="relative">
                                  <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000" 
                                    maxLength={19}
                                    value={cardNumber}
                                    onChange={handleCardInput}
                                    required={!STRIPE_LINKS[selectedPlan!]} // Not required if redirecting
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chef-green focus:bg-white outline-none font-mono text-lg transition-all" 
                                  />
                                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-100">
                                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-5 w-auto" alt="Stripe"/>
                                  </div>
                              </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Expiration</label>
                                  <input 
                                    type="text" 
                                    placeholder="MM / AA" 
                                    maxLength={5}
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    required={!STRIPE_LINKS[selectedPlan!]}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chef-green focus:bg-white outline-none font-mono text-lg text-center" 
                                  />
                              </div>
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">CVC</label>
                                  <div className="relative">
                                    <input 
                                        type="password" 
                                        placeholder="123" 
                                        maxLength={3}
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                        required={!STRIPE_LINKS[selectedPlan!]}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chef-green focus:bg-white outline-none font-mono text-lg text-center" 
                                    />
                                    <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                  </div>
                              </div>
                          </div>

                          <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full mt-6 bg-chef-green text-white font-display text-xl py-4 rounded-xl shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
                          >
                              {processing ? (
                                  <><Loader2 className="animate-spin" /> Connexion bancaire...</>
                              ) : (
                                  <>Payer {selectedPlan && plans[selectedPlan].price}</>
                              )}
                          </button>
                      </form>
                  ) : (
                      <div className="text-center py-8">
                          <p className="text-gray-500 mb-6">Vous allez être redirigé vers PayPal pour finaliser votre paiement sécurisé.</p>
                          <button 
                            onClick={handleProcessPayment}
                            disabled={processing}
                            className="w-full bg-[#0070BA] text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-[#005ea6] transition-colors flex items-center justify-center gap-2"
                          >
                              {processing ? <Loader2 className="animate-spin" /> : 'Payer avec PayPal'}
                          </button>
                      </div>
                  )}

                  <div className="mt-6 flex justify-center items-center gap-4 opacity-100 transition-all">
                      {/* Trust Indicators */}
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold border border-gray-200 px-2 py-1 rounded">
                          <Lock size={10} /> 256-BIT ENCRYPTION
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold border border-gray-200 px-2 py-1 rounded">
                          <ShieldCheck size={10} /> STRIPE SECURE
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative animate-fade-in pb-10">
      
      {/* Payment Modal */}
      {showPayment && <PaymentModal />}

      {/* Close Button - HIDDEN if expired */}
      {!isTrialExpired && (
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
        >
            <X size={24} className="text-gray-500" />
        </button>
      )}

      {/* Header */}
      <div className={`bg-chef-dark text-white pt-16 pb-24 px-6 rounded-b-[3rem] relative overflow-hidden shadow-xl ${isTrialExpired ? 'bg-red-900' : ''}`}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
            {isTrialExpired ? (
                <>
                    <div className="inline-flex items-center gap-2 bg-white text-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <AlertTriangle size={14} /> Période d'essai terminée
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display mb-4 leading-tight">
                        Ne perdez pas vos <br/> <span className="text-yellow-400">Super-Pouvoirs</span>
                    </h1>
                    <p className="text-red-100 font-body text-lg">
                        Votre essai de 7 jours est fini. Abonnez-vous maintenant pour débloquer immédiatement l'application.
                    </p>
                </>
            ) : (
                <>
                    <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-yellow-400/30">
                        <Crown size={14} fill="currentColor" /> MiamChef IA Premium
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display mb-4 leading-tight">
                        Cuisinez comme un <span className="text-chef-green">Chef Étoilé</span>
                    </h1>
                    <p className="text-gray-300 font-body text-lg">
                        Débloquez toute la puissance de l'IA : Photos 4K, Vidéos, Nutrition de précision et créativité sans limite.
                    </p>
                </>
            )}
        </div>
      </div>

      {/* ACCESSIBILITY & SETTINGS SECTION */}
      {toggleLargeText && (
          <div className="-mt-16 px-4 max-w-6xl mx-auto w-full z-20 mb-8">
              <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                          <Eye size={24} />
                      </div>
                      <div>
                          <h3 className="font-display text-lg text-chef-dark">Accessibilité & Confort</h3>
                          <p className="text-xs text-gray-500">Agrandir la taille des textes pour une meilleure lisibilité.</p>
                      </div>
                  </div>
                  <button 
                    onClick={toggleLargeText}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${largeText ? 'bg-chef-green' : 'bg-gray-200'}`}
                  >
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center text-[10px] font-bold text-gray-600 ${largeText ? 'translate-x-6' : 'translate-x-0'}`}>
                          {largeText ? 'ON' : 'OFF'}
                      </div>
                  </button>
              </div>
          </div>
      )}

      {/* Pricing Cards - CORRECTED GRID ALIGNMENT */}
      <div className="px-4 max-w-6xl mx-auto w-full z-10 grid md:grid-cols-3 gap-6 items-start">
        
        {/* MONTHLY (LIBERTE) */}
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-card border border-gray-100 flex flex-col min-h-[450px] relative hover:-translate-y-2 transition-transform duration-300 opacity-90 hover:opacity-100">
            <h3 className="font-display text-2xl text-chef-dark mb-2">Liberté</h3>
            <div className="text-3xl font-display text-gray-700 mb-1">4,99 € <span className="text-sm text-gray-400 font-body">/ mois</span></div>
            <p className="text-xs text-gray-400 mb-6">Facturé mensuellement. Sans engagement.</p>
            
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Fonctionnalités :</p>
            <ul className="space-y-3 mb-8 flex-1">
                {featuresMonthly.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-medium">
                        <div className="bg-green-100 p-0.5 rounded-full shrink-0"><Check size={12} className="text-chef-green" /></div> {f}
                    </li>
                ))}
                <li className="flex items-start gap-2 text-sm text-gray-400 italic mt-4 border-t border-gray-100 pt-2">
                     <X size={16} className="text-red-400 mt-0.5 shrink-0" /> Pas de Photos 4K
                </li>
            </ul>

            <button onClick={() => initiatePayment('monthly')} className="w-full py-3 rounded-xl bg-chef-green text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-100 mt-auto">
                Choisir l'offre Mensuelle
            </button>
        </div>

        {/* ANNUAL (BEST SELLER - FULL ACCESS) */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-chef-green flex flex-col min-h-[550px] relative transform z-20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-chef-green text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                Le choix des Chefs
            </div>
            
            <h3 className="font-display text-3xl text-chef-dark mb-2">Annuel <span className="text-sm font-body text-chef-green">(Premium)</span></h3>
            <div className="flex items-end gap-2 mb-1">
                <div className="text-4xl font-display text-chef-green">3,33 € <span className="text-sm text-gray-400 font-body">/ mois</span></div>
            </div>
            <p className="text-xs text-gray-500 mb-6 font-bold">Facturé 39,99 € / an <span className="text-green-600 bg-green-100 px-1 rounded">-33%</span></p>
            
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">TOUT INCLUS :</p>
            <ul className="space-y-3 mb-8 flex-1 overflow-y-auto custom-scrollbar">
                {featuresFull.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                        <div className="bg-green-100 p-0.5 rounded-full shrink-0"><Check size={12} className="text-chef-green" /></div> {f}
                    </li>
                ))}
            </ul>

            <button onClick={() => initiatePayment('annual')} className="w-full py-4 rounded-xl bg-gradient-to-r from-chef-green to-green-600 text-white font-bold shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-auto">
                <Star size={18} fill="white" /> {isTrialExpired ? 'Débloquer l\'application' : 'Commencer l\'essai gratuit'}
            </button>
            <p className="text-sm text-center text-chef-green mt-4 font-black uppercase tracking-wide border-t border-gray-100 pt-3">
                {isTrialExpired ? 'Accès immédiat.' : '7 jours gratuits, puis 39,99€/an'}
            </p>
        </div>

        {/* LIFETIME */}
        <div className="mt-8 bg-gray-900 rounded-3xl p-6 shadow-card border border-gray-800 flex flex-col min-h-[450px] relative text-white hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute top-4 right-4 text-yellow-400">
                <Crown size={24} />
            </div>
            <h3 className="font-display text-2xl text-white mb-2">À Vie</h3>
            <div className="text-3xl font-display text-yellow-400 mb-1">149,99 €</div>
            <p className="text-xs text-gray-400 mb-6">Paiement unique. Accès à vie.</p>
            
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Expérience Ultime :</p>
            <ul className="space-y-3 mb-8 flex-1 overflow-y-auto custom-scrollbar">
                {featuresFull.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check size={16} className="text-yellow-400 mt-0.5 shrink-0" /> {f}
                    </li>
                ))}
            </ul>

            <button onClick={() => initiatePayment('lifetime')} className="w-full py-3 rounded-xl bg-chef-green text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-900/50 mt-auto">
                Obtenir l'accès à vie
            </button>
        </div>

      </div>

      {/* Payment Methods Visual Strip - Stripe Logo (APPLE PAY REMOVED) */}
      <div className="mt-12 flex justify-center gap-4 items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8 object-contain" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 object-contain" />
      </div>

      {/* Trust Badges */}
      <div className="mt-8 max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2 text-gray-500">
              <ShieldCheck size={24} className="text-chef-green" />
              <span className="text-xs font-bold">Paiement Sécurisé</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-gray-500">
              <Zap size={24} className="text-chef-green" />
              <span className="text-xs font-bold">Activation Immédiate</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-gray-500">
              <Star size={24} className="text-chef-green" />
              <span className="text-xs font-bold">Satisfait ou Remboursé</span>
          </div>
      </div>

        {/* Footer Links & GDPR */}
      <div className="mt-12 text-center pb-8 flex flex-col items-center gap-3">
          <button 
            onClick={() => setShowPrivacy(true)}
            className="text-xs text-gray-400 hover:text-chef-green underline flex items-center justify-center gap-1"
          >
              <Lock size={12} /> Politique de Confidentialité & RGPD
          </button>
          
          {/* NEW LEGAL DOCUMENTS LINK */}
          {setView && (
              <button 
                onClick={() => setView(AppView.LEGAL)}
                className="text-xs text-gray-400 hover:text-chef-green underline flex items-center justify-center gap-1"
              >
                  <FileText size={12} /> Mentions Légales & CGV
              </button>
          )}

          <div className="mt-2 text-[10px] text-gray-300">
              Version 1.0.0
          </div>
      </div>

      {/* Privacy Modal */}
      {showPrivacy && (
          <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 max-h-[80vh] overflow-y-auto shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="font-display text-2xl text-chef-dark flex items-center gap-2">
                          <ShieldCheck className="text-chef-green" /> Confidentialité & RGPD
                      </h2>
                      <button onClick={() => setShowPrivacy(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                  </div>
                  
                  <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-body">
                      <p className="font-bold text-gray-800">1. Stockage des Données</p>
                      <p>MiamChef IA applique une politique de <span className="font-bold">minimisation des données</span>. Vos recettes et votre carnet sont stockés <span className="font-bold">localement sur votre appareil</span> (IndexedDB). Aucune donnée personnelle n'est envoyée sur des serveurs propriétaires MiamChef IA.</p>
                      
                      <p className="font-bold text-gray-800 mt-4">2. Photos & Analyse IA</p>
                      <p>Lorsque vous utilisez le Scan Frigo ou le Styliste, vos photos sont transmises de manière sécurisée et éphémère à l'API Google Gemini pour analyse. Elles ne sont <span className="font-bold">jamais conservées</span> ni réutilisées par MiamChef IA après l'analyse.</p>
                      
                      <p className="font-bold text-gray-800 mt-4">3. Avis de Non-Responsabilité Médicale (Disclaimer)</p>
                      <p>MiamChef IA fournit des informations nutritionnelles à titre indicatif, basées sur des algorithmes standards. Ces données ne remplacent en aucun cas un avis médical professionnel, un diagnostic ou un traitement.</p>

                      <p className="font-bold text-gray-800 mt-4">4. Droit à l'oubli (Article 17 RGPD)</p>
                      <p>Vous disposez d'un contrôle total sur vos données. Vous pouvez à tout moment effacer l'intégralité du contenu stocké par l'application sur cet appareil.</p>
                  
                      <div className="mt-8 pt-6 border-t border-gray-100">
                          <button 
                            onClick={handleClearData}
                            className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                          >
                              <Trash2 size={18} /> Supprimer toutes mes données locales
                          </button>
                          <p className="text-[10px] text-red-400 text-center mt-2">Action irréversible : efface votre carnet de recettes.</p>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
  
  function handleClearData() {
    if (confirm("Attention : Cette action est irréversible. Elle supprimera toutes vos recettes sauvegardées sur cet appareil conformément à votre droit à l'oubli.")) {
        try {
            const req = indexedDB.deleteDatabase('MiamChefDB');
            req.onsuccess = () => {
                alert("Toutes vos données locales ont été supprimées avec succès.");
                window.location.reload();
            };
            req.onerror = () => alert("Erreur lors de la suppression.");
        } catch (e) {
            console.error(e);
        }
    }
  }
};

export default Subscription;
