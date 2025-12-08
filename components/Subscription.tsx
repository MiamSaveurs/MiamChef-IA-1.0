
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

                          {/* ANNUAL PLAN */}
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
                                      <div className="text-xs font-medium opacity-90 text-white font-bold bg-white/10 px-2 py-1 rounded inline-block">7 jours gratuits, puis 39,99€/an.</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'annual' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                          </div>

                          {/* LIFETIME PLAN */}
                          <div 
                            onClick={() => setSelectedPlan('lifetime')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'lifetime' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              <div className="flex justify-between items-center">
                                  <div>
                                      <div className="text-2xl font-display mb-1 text-[#d4af37]">149,99 € <span className="text-sm font-sans font-normal opacity-80 text-white">À Vie</span></div>
                                      <div className="text-xs font-medium opacity-90">Paiement unique. Accès illimité pour toujours.</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'lifetime' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                          </div>

                      </div>
                  </div>

                  {/* STEP 2: CREATE ACCOUNT (PAYMENT) */}
                  <div>
                      <h2 className="text-xl font-serif italic mb-4 opacity-90 text-center md:text-left">2. Créez un compte & Payez</h2>
                      
                      <div className="space-y-3">
                          {/* STRIPE BUTTON (White background for original logo color) */}
                          <button 
                            onClick={() => handleProcessPayment(selectedPlan)}
                            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-full transition-transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg"
                          >
                              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-8" alt="Stripe" />
                              <span className="opacity-80">Payer par Carte</span>
                          </button>

                          {/* PAYPAL BUTTON (Original Colors) */}
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
