
import React, { useState } from 'react';
import { Check, X, ShieldCheck, Lock, Trash2, Eye, Circle, Disc } from 'lucide-react';
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
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center font-sans overflow-y-auto overflow-x-hidden">
      
      {/* BACKGROUND LUXURY NATURE */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470753937643-efeb931202a9?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover filter brightness-[0.35] blur-sm scale-105"
            alt="Nature Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>

      {/* CLOSE BUTTON */}
      {!isTrialExpired && (
        <button onClick={onClose} className="absolute top-6 right-6 z-50 text-white/60 hover:text-white transition-colors">
            <X size={32} />
        </button>
      )}

      {/* ACCESSIBILITY TOGGLE (Hidden corner) */}
      {toggleLargeText && (
          <button onClick={toggleLargeText} className="absolute top-6 left-6 z-50 text-white/30 hover:text-white transition-colors flex gap-2 items-center text-xs uppercase tracking-widest">
              <Eye size={16} /> {largeText ? 'Texte Normal' : 'Texte Agrandir'}
          </button>
      )}

      {/* MAIN CARD "CADRE" */}
      <div className="relative z-10 w-full max-w-lg mx-auto p-6 md:p-0">
          
          {/* GLASSMORPHISM CONTAINER */}
          <div className="bg-[#1a1c1a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden text-white animate-fade-in">
              
              {/* HEADER */}
              <div className="pt-10 pb-6 px-8 text-center">
                  <h1 className="font-display text-4xl md:text-5xl mb-4 text-white drop-shadow-sm font-normal">
                      Commencez votre <br/> <span className="italic font-serif">essai gratuit</span>
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm mx-auto">
                      Nutrition personnalisée, plus de 1600 recettes et de nouvelles créations chaque jour de la semaine.
                  </p>
              </div>

              <div className="px-6 pb-10 space-y-8">
                  
                  {/* STEP 1: CHOOSE PLAN */}
                  <div>
                      <h2 className="text-xl font-serif italic mb-4 opacity-90 text-center md:text-left">1. Choisissez votre forfait</h2>
                      
                      <div className="space-y-4">
                          
                          {/* ANNUAL PLAN (SELECTED) */}
                          <div 
                            onClick={() => setSelectedPlan('annual')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer group ${selectedPlan === 'annual' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              {selectedPlan === 'annual' && (
                                <div className="absolute -top-3 right-4 bg-[#c25e46] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide transform group-hover:scale-105 transition-transform">
                                    Économisez plus de 37 % par an !
                                </div>
                              )}
                              
                              <div className="flex justify-between items-center">
                                  <div>
                                      <div className="text-2xl font-display mb-1">39,99 € <span className="text-sm font-sans font-normal opacity-80">Annuel</span></div>
                                      <div className="text-[10px] opacity-60 uppercase tracking-wider mb-2">équivalent à 3,33 € par mois</div>
                                      <div className="text-xs font-medium opacity-90">7 jours gratuits, puis renouvellement annuel.</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'annual' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                          </div>

                          {/* MONTHLY PLAN */}
                          <div 
                            onClick={() => setSelectedPlan('monthly')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'monthly' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              <div className="flex justify-between items-center">
                                  <div>
                                      <div className="text-2xl font-display mb-1">4,99 € <span className="text-sm font-sans font-normal opacity-80">Mensuel</span></div>
                                      <div className="text-xs font-medium opacity-90">7 jours gratuits, puis abonnement mensuel.</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'monthly' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                          </div>

                      </div>
                  </div>

                  {/* LIFETIME LINK (Subtle) */}
                  <div className="text-center">
                      <button onClick={() => handleProcessPayment('lifetime')} className="text-xs text-[#d4af37] hover:text-white transition-colors underline decoration-1 underline-offset-4">
                          Ou préférez-vous un accès À VIE pour 149,99 € ? (Paiement unique)
                      </button>
                  </div>

                  {/* STEP 2: CREATE ACCOUNT (PAYMENT) */}
                  <div>
                      <h2 className="text-xl font-serif italic mb-4 opacity-90 text-center md:text-left">2. Créez un compte & Payez</h2>
                      
                      <div className="space-y-3">
                          <button 
                            onClick={() => handleProcessPayment(selectedPlan)}
                            className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-full transition-transform hover:scale-[1.02] flex items-center justify-center gap-3 border border-white/10 shadow-lg"
                          >
                              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-5 h-5" alt="Google" />
                              Continuer avec Google (Stripe)
                          </button>
                          
                          <button 
                            onClick={() => handleProcessPayment(selectedPlan)}
                            className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-full transition-transform hover:scale-[1.02] flex items-center justify-center gap-3 border border-white/10 shadow-lg"
                          >
                              <svg className="w-5 h-5 fill-current" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/></svg>
                              Continuer avec Apple (Stripe)
                          </button>

                          <button 
                            onClick={() => handleProcessPayment(selectedPlan)}
                            className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-full transition-transform hover:scale-[1.02] flex items-center justify-center gap-3 border border-white/10 shadow-lg"
                          >
                              <ShieldCheck size={20} />
                              Poursuivre par courriel (Sécurisé)
                          </button>
                      </div>
                  </div>

                  {/* FOOTER */}
                  <p className="text-[10px] text-center text-gray-400 leading-relaxed px-4">
                      En vous abonnant, vous acceptez nos <button onClick={() => setView && setView(AppView.LEGAL)} className="underline hover:text-white">conditions d'utilisation</button> et <button onClick={() => setView && setView(AppView.LEGAL)} className="underline hover:text-white">notre politique de confidentialité</button>.
                      <br/>Vous ne serez pas débité avant la fin de votre essai gratuit de 7 jours.
                  </p>

              </div>
          </div>
      </div>
    </div>
  );
};

export default Subscription;
