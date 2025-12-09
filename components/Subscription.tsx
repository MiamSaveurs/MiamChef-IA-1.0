
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
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly' | 'lifetime'>('annual');
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
                                    MEILLEUR FORFAIT
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
                              {/* Stripe Logo SVG - White */}
                              <svg className="h-7 w-auto" viewBox="0 0 40 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5.526 15.65c-2.822 0-5.188-1.492-5.188-4.47 0-3.902 4.938-3.326 4.938-6.075 0-.74-.53-1.076-1.57-1.076-1.396 0-2.61.56-3.414 1.25L0 3.86C1.196 2.518 3.228 1.5 5.526 1.5c2.722 0 4.45 1.354 4.45 3.96 0 4.102-4.94 3.42-4.94 6.136 0 .7.59 1.058 1.63 1.058 1.482 0 2.872-.73 3.69-1.502l.33 1.48c-.96.91-2.69 1.52-5.16 1.52zM12.926 15.45c-2.22 0-3.78-1.58-3.78-3.79 0-2.22 1.56-3.8 3.78-3.8 2.22 0 3.78 1.58 3.78 3.8 0 2.21-1.56 3.79-3.78 3.79zm0-6.17c-1.43 0-2.32 1.04-2.32 2.38 0 1.33.89 2.37 2.32 2.37 1.44 0 2.32-1.04 2.32-2.37 0-1.34-.88-2.38-2.32-2.38zM19.126 15.45c-1.12 0-1.92-.38-2.45-1.1v4.75h-1.46V5.45h1.46v1.27c.56-.79 1.41-1.27 2.54-1.27 2.05 0 3.49 1.62 3.49 3.89 0 2.27-1.44 3.89-3.58 3.89v2.22zm-.25-1.42c1.33 0 2.21-1.03 2.21-2.47 0-1.44-.88-2.47-2.21-2.47-1.34 0-2.22 1.03-2.22 2.47 0 1.44.88 2.47 2.22 2.47zM25.756 15.25v-9.8h1.46v9.8h-1.46zM25.756 3.84V1.95h1.46v1.89h-1.46zM32.896 15.45c-1.1 0-1.98-.44-2.44-1.34h-.05v3.94h-1.46V5.45h1.46v1.17c.51-.77 1.37-1.17 2.42-1.17 1.99 0 3.48 1.62 3.48 3.9 0 2.28-1.5 4.1-3.41 4.1zm-.24-1.42c1.29 0 2.15-1.04 2.15-2.48 0-1.44-.87-2.47-2.15-2.47-1.32 0-2.19 1.03-2.19 2.47 0 1.44.87 2.48 2.19 2.48zM39.606 12.02h-4.66c.1 1.04.91 1.63 2.07 1.63.95 0 1.76-.35 2.41-.88l.6.98c-.83.74-2.02 1.25-3.32 1.25-2.14 0-3.23-1.49-3.23-3.8 0-2.35 1.48-3.76 3.19-3.76 1.78 0 2.94 1.46 2.94 3.73v.85zm-1.3-1.06c-.03-1.06-.69-1.63-1.63-1.63-.92 0-1.62.58-1.72 1.63h3.35z" fill="#fff"/>
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
