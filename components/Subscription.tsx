
import React, { useState } from 'react';
import { Check, X, ShieldCheck, Lock, Trash2, Eye, Circle, Disc, Star, Zap } from 'lucide-react';
import { startSubscription } from '../services/storageService';
import { AppView } from '../types';

// ==========================================
// 🔴 ZONE DE CONFIGURATION PAIEMENT STRIPE 🔴
// ==========================================
const STRIPE_LINKS = {
    monthly: "", 
    annual: "", 
    lifetime: ""
};

interface SubscriptionProps {
  onClose: () => void;
  isTrialExpired?: boolean;
  setView?: (view: AppView) => void;
  largeText?: boolean;
  toggleLargeText?: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ onClose, isTrialExpired = false, setView, largeText = false, toggleLargeText }) => {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly' | 'lifetime'>('monthly');
  const [processing, setProcessing] = useState(false);

  const handleProcessPayment = (plan: 'annual' | 'monthly' | 'lifetime') => {
      setProcessing(true);
      
      // 1. CHECK FOR REAL STRIPE LINK
      const stripeLink = STRIPE_LINKS[plan];
      if (stripeLink && stripeLink.length > 5) {
          setTimeout(() => { window.location.href = stripeLink; }, 1000);
          return;
      }

      // 2. FALLBACK: SIMULATION
      setTimeout(() => {
          setProcessing(false);
          startSubscription(plan);
          alert(`MODE SIMULATION : Abonnement ${plan} activé !`);
          window.location.reload();
      }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black font-sans text-white overflow-y-auto">
      
      {/* BACKGROUND LUXURY NATURE (Fixed) */}
      <div className="fixed inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470753937643-efeb931202a9?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover filter brightness-[0.35] blur-sm scale-105"
            alt="Nature Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>

      {/* CLOSE BUTTON (Fixed position relative to viewport) */}
      {!isTrialExpired && (
        <button onClick={onClose} className="fixed top-6 right-6 z-[70] text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md p-2 rounded-full">
            <X size={24} />
        </button>
      )}

      {/* ACCESSIBILITY TOGGLE */}
      {toggleLargeText && (
          <button onClick={toggleLargeText} className="fixed top-6 left-6 z-[70] text-white/30 hover:text-white transition-colors flex gap-2 items-center text-xs uppercase tracking-widest bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">
              <Eye size={16} /> {largeText ? 'Texte Normal' : 'Texte Agrandir'}
          </button>
      )}

      {/* SCROLLABLE CONTAINER */}
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-12 px-4">
          
          {/* GLASSMORPHISM CARD */}
          <div className="w-full max-w-lg bg-[#1a1c1a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in">
              
              {/* HEADER */}
              <div className="pt-10 pb-6 px-8 text-center">
                  <h1 className="font-display text-4xl md:text-5xl mb-4 text-white drop-shadow-sm font-normal">
                      Commencez votre <br/> <span className="italic font-serif">essai gratuit</span>
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm mx-auto">
                      Débloquez la puissance illimitée de l'IA. Créez, planifiez et savourez sans aucune limite.
                  </p>
              </div>

              <div className="px-6 pb-10 space-y-8">
                  
                  {/* STEP 1: CHOOSE PLAN */}
                  <div>
                      <h2 className="text-xl font-serif italic mb-4 opacity-90 text-center md:text-left">1. Choisissez votre forfait</h2>
                      
                      <div className="space-y-4">
                          
                          {/* MONTHLY PLAN */}
                          <div 
                            onClick={() => setSelectedPlan('monthly')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'monthly' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg ring-1 ring-[#4a7c45]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <div className="text-2xl font-display mb-1">4,99 € <span className="text-sm font-sans font-normal opacity-80">Mensuel</span></div>
                                      <div className="text-xs font-medium opacity-90">7 jours gratuits, puis abonnement mensuel.</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'monthly' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              {/* FEATURES LIST */}
                              <div className={`text-xs space-y-1.5 pt-3 border-t ${selectedPlan === 'monthly' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Accès illimité Chef & Nutrition</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Scan Frigo Anti-Gaspi</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Sommelier IA (Mode Pro inclus)</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Sans publicité</div>
                              </div>
                          </div>

                          {/* ANNUAL PLAN */}
                          <div 
                            onClick={() => setSelectedPlan('annual')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer group ${selectedPlan === 'annual' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg ring-1 ring-[#4a7c45]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              {selectedPlan === 'annual' && (
                                <div className="absolute -top-3 right-4 bg-[#c25e46] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide transform group-hover:scale-105 transition-transform">
                                    Meilleure Valeur
                                </div>
                              )}
                              
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <div className="text-2xl font-display mb-1">39,99 € <span className="text-sm font-sans font-normal opacity-80">Annuel</span></div>
                                      <div className="text-[10px] opacity-60 uppercase tracking-wider mb-2">équivalent à 3,33 € par mois</div>
                                      <div className="text-sm font-bold opacity-100 text-white bg-white/20 px-2 py-1 rounded inline-block">7 jours gratuits, puis 39,99€/an</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'annual' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              {/* FEATURES LIST */}
                              <div className={`text-xs space-y-1.5 pt-3 border-t ${selectedPlan === 'annual' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2 font-bold"><Star size={12} fill="currentColor" className="text-yellow-400"/> Tout l'offre Liberté</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Sommelier IA & Batch Cooking</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Export Drive & Liste Partagée</div>
                                  <div className="flex items-center gap-2 text-yellow-200"><Check size={12} className="opacity-70"/> Accès prioritaire nouveautés</div>
                              </div>
                          </div>

                          {/* LIFETIME PLAN */}
                          <div 
                            onClick={() => setSelectedPlan('lifetime')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'lifetime' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg ring-1 ring-[#4a7c45]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <div className="text-2xl font-display mb-1 text-[#d4af37]">149,99 € <span className="text-sm font-sans font-normal opacity-80 text-white">À Vie</span></div>
                                      <div className="text-xs font-medium opacity-90">Paiement unique. Accès illimité pour toujours.</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'lifetime' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              {/* FEATURES LIST */}
                              <div className={`text-xs space-y-1.5 pt-3 border-t ${selectedPlan === 'lifetime' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2 font-bold"><Zap size={12} fill="currentColor" className="text-yellow-400"/> Toutes les fonctionnalités</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Sommelier IA & Batch Cooking</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Photos HD & Vidéos immersives</div>
                                  <div className="flex items-center gap-2 text-yellow-200"><Check size={12} className="opacity-70"/> Rentabilisé en quelques mois</div>
                              </div>
                          </div>

                      </div>
                  </div>

                  {/* STEP 2: CREATE ACCOUNT (PAYMENT) */}
                  <div>
                      <h2 className="text-xl font-serif italic mb-4 opacity-90 text-center md:text-left">2. Créez un compte & Payez</h2>
                      
                      <div className="space-y-3">
                          {/* STRIPE BUTTON */}
                          <button 
                            onClick={() => handleProcessPayment(selectedPlan)}
                            className="w-full bg-[#635bff] hover:bg-[#5851e3] text-white font-bold py-3 rounded-full transition-transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg"
                          >
                              {/* Stripe Logo SVG */}
                              <svg viewBox="0 0 60 25" className="h-6 fill-white">
                                <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.94 0-5.05 2.87-8.97 6.73-8.97 4.52 0 5.69 4.39 5.47 10.89zm-5.47-2.39c0-2.05-.58-4.73-2.3-4.73-1.89 0-3.34 2.55-3.67 4.73h5.97zM28.45 6.06c0-1.77-1.02-3.23-3.5-3.23-2.9 0-4.81 1.93-4.81 1.93l-.97-3.4s-1.89-1.3-4.27-1.3c-2.3 0-4.17 1.48-4.17 1.48l-.92-3.4H3.5v12.23h4.6V18.15c0-1.27.34-3.4 2.23-3.4 1.14 0 1.93.58 1.93 1.97v9.65h4.6V18.15c0-1.27.34-3.4 2.23-3.4 1.14 0 1.93.58 1.93 1.97v9.65h4.6V14.15c0-3.68-1.55-8.09-5.17-8.09zm15.65 1.58c1.36 0 2.23.63 2.23 2.07v16.66h4.6V9.71c0-3.68-1.55-8.09-5.17-8.09-2.3 0-4.32 1.55-4.32 1.55l.24-3.1h-4.37v26.3h4.56v-16.7c0-1.27.37-3.62 2.23-3.62zM9.81 0C7.23 0 5.12 1.3 3.96 2.37L4.93 6.3C5.7 5.6 7.23 4.39 8.93 4.39c1.6 0 2.45.92 2.45 2.25 0 .53-.15 1.3-.41 1.97C9.36 8.36 4.9 9.3 4.9 13.6c0 3.32 2.7 5.3 5.92 5.3 2.65 0 4.64-1.2 4.64-1.2l-.22 3.09h4.32V10.2c0-5.83-4.13-10.2-9.74-10.2zm.3 15.6c-1.36 0-1.82-1-1.82-1.89 0-1.6 1.99-2.2 3.69-2.6.22-.05.44-.1.63-.12.02.7.02 1.43.02 2.15 0 1.58-.87 2.46-2.52 2.46z"/>
                              </svg>
                              <span className="opacity-80 font-normal text-sm border-l border-white/20 pl-3">Payer par Carte</span>
                          </button>

                          {/* PAYPAL BUTTON */}
                          <button 
                            onClick={() => handleProcessPayment(selectedPlan)}
                            className="w-full bg-[#ffc439] hover:bg-[#f4bb33] text-[#2c2e2f] font-bold py-3 rounded-full transition-transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg"
                          >
                              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="PayPal" />
                              <span className="opacity-90">Payer avec PayPal</span>
                          </button>
                      </div>
                  </div>

                  {/* FOOTER */}
                  <p className="text-[10px] text-center text-gray-400 leading-relaxed px-4">
                      En vous abonnant, vous acceptez nos <button onClick={() => setView && setView(AppView.LEGAL)} className="underline hover:text-white">conditions d'utilisation</button> et <button onClick={() => setView && setView(AppView.LEGAL)} className="underline hover:text-white">notre politique de confidentialité</button>.
                      <br/>Vous ne serez pas débité avant la fin de votre essai gratuit de 7 jours (sauf offre À Vie).
                  </p>

              </div>
          </div>
      </div>
    </div>
  );
};

export default Subscription;
