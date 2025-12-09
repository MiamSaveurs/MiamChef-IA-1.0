
import React, { useState } from 'react';
import { Check, X, ShieldCheck, Lock, Eye, Circle, Star, Zap } from 'lucide-react';
import { startSubscription } from '../services/storageService';
import { AppView } from '../types';

// ==========================================
// CONFIGURATION DES LIENS DE PAIEMENT
// ==========================================

// 1. Collez vos liens PayPal ici (depuis l'onglet "E-mail" lors de la création du bouton sur PayPal)
const PAYPAL_LINKS = {
    monthly: "", // Ex: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=...
    annual: "", 
    lifetime: "" 
};

// 2. Collez vos liens Stripe ici (si utilisé)
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

  const handleProcessPayment = (plan: 'annual' | 'monthly' | 'lifetime', provider: 'stripe' | 'paypal') => {
      setProcessing(true);
      
      let paymentLink = "";

      if (provider === 'paypal') {
          paymentLink = PAYPAL_LINKS[plan];
      } else {
          paymentLink = STRIPE_LINKS[plan];
      }

      // Redirection vers le lien de paiement s'il existe
      if (paymentLink && paymentLink.length > 5) {
          setTimeout(() => { 
              window.location.href = paymentLink; 
          }, 500);
          return;
      }

      // Mode simulation (si aucun lien n'est configuré)
      setTimeout(() => {
          setProcessing(false);
          startSubscription(plan);
          alert(`Abonnement ${plan} activé (Mode Test). Ajoutez vos liens dans le code pour activer le paiement réel.`);
          window.location.reload();
      }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black font-sans text-white overflow-y-auto">
      
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470753937643-efeb931202a9?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover filter brightness-[0.35] blur-sm scale-105"
            alt="Nature Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>

      {/* CLOSE BUTTON */}
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
          
          <div className="w-full max-w-lg bg-[#1a1c1a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in">
              
              {/* HEADER */}
              <div className="pt-10 pb-6 px-8 text-center">
                  <h1 className="font-display text-4xl md:text-5xl mb-4 text-white drop-shadow-sm font-normal">
                      MiamChef <span className="text-[#509f2a] italic">Premium</span>
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm mx-auto">
                      Débloquez tout le potentiel de votre assistant culinaire. Création illimitée, Sommelier IA et bien plus.
                  </p>
              </div>

              <div className="px-6 pb-10 space-y-8">
                  
                  {/* STEP 1: CHOOSE PLAN */}
                  <div>
                      <h2 className="text-xl font-serif italic mb-4 opacity-90 text-center md:text-left">1. Choisissez votre offre</h2>
                      
                      <div className="space-y-4">
                          
                          {/* MONTHLY PLAN */}
                          <div 
                            onClick={() => setSelectedPlan('monthly')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'monthly' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg ring-1 ring-[#4a7c45]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <div className="text-2xl font-display mb-1">4,99 € <span className="text-sm font-sans font-normal opacity-80">/ mois</span></div>
                                      <div className="text-xs font-medium opacity-90">Sans engagement. Annulable à tout moment.</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'monthly' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              <div className={`text-xs space-y-1.5 pt-3 border-t ${selectedPlan === 'monthly' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Accès illimité Chef & Sommelier</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Scan Frigo Anti-Gaspi</div>
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
                                    Meilleure Offre
                                </div>
                              )}
                              
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <div className="text-2xl font-display mb-1">39,99 € <span className="text-sm font-sans font-normal opacity-80">/ an</span></div>
                                      <div className="text-[10px] opacity-60 uppercase tracking-wider mb-2">Soit 2 mois offerts</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'annual' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              <div className={`text-xs space-y-1.5 pt-3 border-t ${selectedPlan === 'annual' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2 font-bold"><Star size={12} fill="currentColor" className="text-yellow-400"/> Tout l'abonnement Mensuel</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> Fonctions exclusives (Batch Cooking)</div>
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
                          </div>

                      </div>
                  </div>

                  {/* STEP 2: PAYMENT BUTTONS */}
                  <div>
                      <h2 className="text-xl font-serif italic mb-4 opacity-90 text-center md:text-left">2. Règlement sécurisé</h2>
                      
                      <div className="space-y-3">
                          {/* PAYPAL BUTTON */}
                          <button 
                            onClick={() => handleProcessPayment(selectedPlan, 'paypal')}
                            className="w-full bg-[#ffc439] hover:bg-[#f4bb33] text-[#2c2e2f] font-bold py-3 rounded-full transition-transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg"
                          >
                              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="PayPal" />
                              <span className="opacity-90">Payer avec PayPal</span>
                          </button>

                          {/* STRIPE BUTTON */}
                          <button 
                            onClick={() => handleProcessPayment(selectedPlan, 'stripe')}
                            className="w-full bg-[#635bff] hover:bg-[#5851e3] text-white font-bold py-3 rounded-full transition-transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg"
                          >
                              <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                                className="h-8 w-auto brightness-0 invert" 
                                alt="Stripe" 
                              />
                              <span className="opacity-80 font-normal text-sm border-l border-white/20 pl-3">Payer par Carte</span>
                          </button>
                      </div>
                      
                      <div className="flex justify-center gap-4 mt-4 text-[10px] text-gray-400">
                          <div className="flex items-center gap-1"><Lock size={10}/> Paiement chiffré SSL</div>
                          <div className="flex items-center gap-1"><ShieldCheck size={10}/> Garantie Satisfait ou Remboursé</div>
                      </div>
                  </div>

                  {/* FOOTER */}
                  <p className="text-[10px] text-center text-gray-400 leading-relaxed px-4">
                      En vous abonnant, vous acceptez nos <button onClick={() => setView && setView(AppView.LEGAL)} className="underline hover:text-white">CGV</button>.
                  </p>

              </div>
          </div>
      </div>
    </div>
  );
};

export default Subscription;
