
import React, { useState } from 'react';
import { Check, X, ShieldCheck, Lock, Eye, Circle, Star, ExternalLink, Loader2 } from 'lucide-react';
import { startSubscription } from '../services/storageService';
import { AppView } from '../types';

// ============================================================================
// CONFIGURATION STRIPE (LIENS INTEGRÉS)
// ============================================================================
const STRIPE_LINKS = {
    // 1. Lien pour l'abonnement MENSUEL (4,99€)
    monthly: "https://buy.stripe.com/cNi5kxefkaIZ2K2aRf04800", 
    
    // 2. Lien pour l'abonnement ANNUEL (49,99€)
    annual: "https://buy.stripe.com/6oU8wJfjoeZfacucZn04801",   
    
    // 3. Lien pour l'offre A VIE (149,99€)
    lifetime: "https://buy.stripe.com/3cIcMZ6MScR7ckCgbz04802"   
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

  const handleProcessPayment = () => {
      setProcessing(true);
      
      const paymentUrl = STRIPE_LINKS[selectedPlan];
      
      // Sécurité basique
      if (!paymentUrl) {
          alert("Erreur de configuration des liens.");
          setProcessing(false);
          return;
      }

      setTimeout(() => {
          window.location.href = paymentUrl;
      }, 500);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black font-sans text-white overflow-y-auto">
      
      <div className="fixed inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470753937643-efeb931202a9?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover filter brightness-[0.35] blur-sm scale-105"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>

      {!isTrialExpired && (
        <button onClick={onClose} className="fixed top-6 right-6 z-[70] text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md p-2 rounded-full">
            <X size={24} />
        </button>
      )}

      {toggleLargeText && (
          <button onClick={toggleLargeText} className="fixed top-6 left-6 z-[70] text-white/30 hover:text-white transition-colors flex gap-2 items-center text-xs uppercase tracking-widest bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">
              <Eye size={16} /> {largeText ? 'Texte Normal' : 'Texte Agrandir'}
          </button>
      )}

      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-12 px-4">
          
          <div className="w-full max-w-lg bg-[#1a1c1a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in">
              
              <div className="pt-10 pb-6 px-8 text-center">
                  <h1 className="font-display text-4xl md:text-5xl mb-4 text-white drop-shadow-sm font-normal">
                      MiamChef <span className="text-[#509f2a] italic">Premium</span>
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm mx-auto">
                      Débloquez tout le potentiel de votre assistant culinaire. Création illimitée et outils exclusifs.
                  </p>
              </div>

              <div className="px-6 pb-10 space-y-8">
                  
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
                                      <div className="text-xs font-medium opacity-90">Sans engagement.</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'monthly' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              <div className={`text-xs space-y-2 pt-3 border-t ${selectedPlan === 'monthly' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2"><Check size={12} strokeWidth={3} className={selectedPlan === 'monthly' ? "text-white" : "text-[#509f2a]"}/> <span><strong>Création Illimitée</strong> (Chef & Pâtissier)</span></div>
                                  <div className="flex items-center gap-2"><Check size={12} strokeWidth={3} className={selectedPlan === 'monthly' ? "text-white" : "text-[#509f2a]"}/> <span><strong>Scan Frigo</strong> Anti-Gaspi</span></div>
                                  <div className="flex items-center gap-2"><Check size={12} strokeWidth={3} className={selectedPlan === 'monthly' ? "text-white" : "text-[#509f2a]"}/> <span><strong>Sommelier</strong> & Accords Vins</span></div>
                                  <div className="flex items-center gap-2"><Check size={12} strokeWidth={3} className={selectedPlan === 'monthly' ? "text-white" : "text-[#509f2a]"}/> <span><strong>Semainier</strong> & Listes de courses</span></div>
                              </div>
                          </div>

                          {/* ANNUAL PLAN */}
                          <div 
                            onClick={() => setSelectedPlan('annual')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer group ${selectedPlan === 'annual' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg ring-1 ring-[#4a7c45]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              {selectedPlan === 'annual' && (
                                <div className="absolute -top-3 right-4 bg-[#509f2a] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide animate-pulse">
                                    Meilleure Offre
                                </div>
                              )}
                              
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <div className="text-2xl font-display mb-1">49,99 € <span className="text-sm font-sans font-normal opacity-80">/ an</span></div>
                                      <div className={`text-xs font-medium opacity-90 bg-white/10 px-2 py-0.5 rounded inline-block ${selectedPlan === 'annual' ? 'text-white' : 'text-[#509f2a]'}`}>Soit 4,16€ / mois</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'annual' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              <div className={`text-xs space-y-2 pt-3 border-t ${selectedPlan === 'annual' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2"><Check size={12} strokeWidth={3} className={selectedPlan === 'annual' ? "text-white" : "text-[#509f2a]"}/> <span><strong>Tout le contenu Mensuel inclus</strong></span></div>
                                  <div className="flex items-center gap-2"><Check size={12} strokeWidth={3} className={selectedPlan === 'annual' ? "text-white" : "text-[#509f2a]"}/> <span><strong>2 mois offerts</strong> (Économisez ~10€)</span></div>
                                  <div className="flex items-center gap-2"><Check size={12} strokeWidth={3} className={selectedPlan === 'annual' ? "text-white" : "text-[#509f2a]"}/> <span>Accès Prioritaire & Support</span></div>
                              </div>
                          </div>

                          {/* LIFETIME PLAN */}
                          <div 
                            onClick={() => setSelectedPlan('lifetime')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'lifetime' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg ring-1 ring-[#4a7c45]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <div className="text-2xl font-display mb-1 text-[#509f2a]"><span className={selectedPlan === 'lifetime' ? "text-white" : "text-[#509f2a]"}>149,99 €</span> <span className="text-sm font-sans font-normal opacity-80 text-white">À Vie</span></div>
                                      <div className="text-xs font-medium opacity-90">Paiement unique.</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'lifetime' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              <div className={`text-xs space-y-2 pt-3 border-t ${selectedPlan === 'lifetime' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2"><Check size={12} strokeWidth={3} className={selectedPlan === 'lifetime' ? "text-white" : "text-[#509f2a]"}/> <span><strong>Accès Premium Illimité à Vie</strong></span></div>
                                  <div className="flex items-center gap-2"><Check size={12} strokeWidth={3} className={selectedPlan === 'lifetime' ? "text-white" : "text-[#509f2a]"}/> <span>Plus aucun paiement futur</span></div>
                                  <div className="flex items-center gap-2"><Check size={12} strokeWidth={3} className={selectedPlan === 'lifetime' ? "text-white" : "text-[#509f2a]"}/> <span>Toutes les futures mises à jour (v2, v3...)</span></div>
                                  <div className="flex items-center gap-2 font-bold"><Star size={12} fill="currentColor" className={selectedPlan === 'lifetime' ? "text-yellow-300" : "text-[#509f2a]"} /> <span className={selectedPlan === 'lifetime' ? "text-white" : "text-[#509f2a]"}>Statut "Membre à vie"</span></div>
                              </div>
                          </div>

                      </div>
                  </div>

                  <div>
                      <h2 className="text-xl font-serif italic mb-4 opacity-90 text-center md:text-left">2. Règlement sécurisé</h2>
                      <div className="space-y-3">
                          <button 
                            onClick={handleProcessPayment}
                            disabled={processing}
                            className="w-full bg-[#635bff] hover:bg-[#5851e3] text-white font-bold py-3 rounded-full flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                              {processing ? <Loader2 className="animate-spin" size={24}/> : <ExternalLink size={20} />}
                              <span className="opacity-100 font-normal text-sm">{processing ? 'Ouverture de Stripe...' : 'Payer par Carte Bancaire (Sécurisé)'}</span>
                          </button>
                      </div>
                  </div>

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
