
import React, { useState, useEffect } from 'react';
import { Check, X, ShieldCheck, Lock, Eye, Circle, Star, ExternalLink, Loader2, CreditCard, Book, Timer, Gift } from 'lucide-react';
import { startSubscription } from '../services/storageService';
import { AppView } from '../types';

// ============================================================================
// CONFIGURATION STRIPE (PRODUCTION)
// ============================================================================

const STRIPE_LINKS = {
    monthly: "https://buy.stripe.com/cNi5kxefkaIZ2K2aRf04800", 
    annual: "https://buy.stripe.com/6oU8wJfjoeZfacucZn04801",   
    lifetime: "https://buy.stripe.com/3cIcMZ6MScR7ckCgbz04802"   
};

interface SubscriptionProps {
  onClose: () => void;
  isTrialExpired?: boolean;
  setView?: (view: AppView) => void;
  largeText?: boolean;
  toggleLargeText?: () => void;
  onAccessBook?: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ onClose, isTrialExpired = false, setView, largeText = false, toggleLargeText, onAccessBook }) => {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly' | 'lifetime'>('annual');
  const [processing, setProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  
  // FOMO Timer State
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
      const timer = setInterval(() => {
          setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleProcessPayment = () => {
      setProcessing(true);
      
      const paymentUrl = STRIPE_LINKS[selectedPlan];
      
      if (!paymentUrl) {
          alert("Erreur de configuration : Lien de paiement manquant.");
          setProcessing(false);
          return;
      }

      setTimeout(() => {
          window.location.href = paymentUrl;
      }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black font-sans text-white overflow-y-auto">
      
      {/* FOMO BANNER - STICKY TOP */}
      <div className="fixed top-0 left-0 w-full z-[80] bg-gradient-to-r from-red-600 to-red-800 text-white py-2 px-4 text-center shadow-lg animate-slide-up flex items-center justify-center gap-3">
          <div className="animate-pulse bg-white text-red-600 rounded-full p-1"><Timer size={14} /></div>
          <p className="text-xs font-bold uppercase tracking-widest">
              Offre Flash -10% sur l'annuel : <span className="font-mono text-lg ml-1">{formatTime(timeLeft)}</span>
          </p>
      </div>

      <div className="fixed inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop" 
            className="w-full h-full object-cover filter brightness-[0.30] blur-sm scale-105"
            alt="Luxury Food Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#1a1a1a]/50 to-black"></div>
      </div>

      {!isTrialExpired && (
        <button onClick={onClose} className="fixed top-14 right-6 z-[70] text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10">
            <X size={24} />
        </button>
      )}

      {toggleLargeText && (
          <button onClick={toggleLargeText} className="fixed top-14 left-6 z-[70] text-white/30 hover:text-white transition-colors flex gap-2 items-center text-xs uppercase tracking-widest bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Eye size={16} /> {largeText ? 'Texte Normal' : 'Texte Agrandir'}
          </button>
      )}

      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-12 px-4">
          
          <div className="w-full max-w-lg bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in relative">
              
              {/* Decorative Shine */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="pt-10 pb-6 px-8 text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-900 shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-4 border border-green-500/30">
                      <Lock size={32} className="text-green-100" />
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl mb-3 text-white drop-shadow-sm font-normal">
                      MiamChef <span className="text-[#509f2a] italic">Premium</span>
                  </h1>
                  <p className="text-gray-400 text-sm font-light leading-relaxed max-w-xs mx-auto">
                      Cuisinez sans limites et profitez de toutes les fonctionnalités.
                  </p>
              </div>

              <div className="px-6 pb-10 space-y-6 relative z-10">
                  
                  <div className="space-y-4">
                      
                      {/* MONTHLY PLAN */}
                      <div 
                        onClick={() => setSelectedPlan('monthly')}
                        className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'monthly' ? 'bg-gradient-to-r from-[#1a4a2a] to-[#143d22] border-[#509f2a] shadow-lg shadow-green-900/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      >
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <div className="text-2xl font-display mb-1 text-white">4,99 € <span className="text-sm font-sans font-normal opacity-70">/ mois</span></div>
                                  <div className="text-xs font-medium opacity-80 text-gray-300">Sans engagement. Liberté totale.</div>
                              </div>
                              <div className="text-white">
                                  {selectedPlan === 'monthly' ? <div className="bg-white text-[#1a4a2a] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-20" />}
                              </div>
                          </div>
                          {/* Features List for Monthly */}
                          <div className={`text-xs space-y-2 pt-4 mt-2 border-t transition-colors ${selectedPlan === 'monthly' ? 'border-white/20' : 'border-white/10'}`}>
                              <div className="flex items-center gap-2"><Check size={14} className="text-[#509f2a]"/> <span>Recettes & Scan Frigo <strong>Illimités</strong></span></div>
                              <div className="flex items-center gap-2"><Check size={14} className="text-[#509f2a]"/> <span>Sommelier & Semainier inclus</span></div>
                              <div className="flex items-center gap-2"><Check size={14} className="text-[#509f2a]"/> <span>Accès à toutes les fonctions</span></div>
                          </div>
                      </div>

                      {/* ANNUAL PLAN (RECOMMENDED & FOMO) */}
                      <div 
                        onClick={() => setSelectedPlan('annual')}
                        className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer group ${selectedPlan === 'annual' ? 'bg-gradient-to-r from-[#1a4a2a] to-[#0f2e1b] border-[#509f2a] shadow-[0_0_40px_rgba(80,159,42,0.15)] scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      >
                          {/* BEST VALUE BADGE - UPDATED FOR CONVERSION */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-widest border border-yellow-200 flex items-center gap-2 z-10">
                                <Star size={10} fill="black" /> La Formule Préférée
                          </div>
                          
                          <div className="flex justify-between items-start mb-3 mt-1">
                              <div>
                                  <div className="text-3xl font-display mb-1 text-white">49,99 € <span className="text-sm font-sans font-normal opacity-70">/ an</span></div>
                                  <div className="flex gap-2 mt-1">
                                      <span className="text-xs font-bold text-[#509f2a] bg-white/10 px-2 py-0.5 rounded">2 mois offerts</span>
                                      <span className="text-xs text-gray-400 line-through decoration-red-500 decoration-2">59,88 €</span>
                                  </div>
                              </div>
                              <div className="text-white">
                                  {selectedPlan === 'annual' ? <div className="bg-white text-[#1a4a2a] rounded-full p-1"><Check size={18} strokeWidth={4} /></div> : <Circle size={24} className="opacity-20" />}
                              </div>
                          </div>
                          
                          {/* Features List for Annual */}
                          <div className={`text-xs space-y-2 pt-4 mt-2 border-t transition-colors ${selectedPlan === 'annual' ? 'border-white/20' : 'border-white/10'}`}>
                              <div className="flex items-center gap-2"><Check size={14} className="text-[#509f2a]"/> <span>Recettes & Scan Frigo <strong>Illimités</strong></span></div>
                              <div className="flex items-center gap-2"><Check size={14} className="text-[#509f2a]"/> <span>Sommelier & Semainier inclus</span></div>
                              <div className="flex items-center gap-2"><Check size={14} className="text-[#509f2a]"/> <span>Support Prioritaire 24/7</span></div>
                          </div>
                      </div>

                      {/* LIFETIME PLAN */}
                      <div 
                        onClick={() => setSelectedPlan('lifetime')}
                        className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'lifetime' ? 'bg-gradient-to-r from-amber-900/40 to-amber-950/40 border-amber-500/50 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      >
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <div className="text-2xl font-display mb-1 text-amber-400">149,99 € <span className="text-sm font-sans font-normal opacity-70 text-gray-300">À Vie</span></div>
                                  <div className="text-xs font-medium opacity-80 text-gray-300">Paiement unique. Accès éternel.</div>
                              </div>
                              <div className="text-white">
                                  {selectedPlan === 'lifetime' ? <div className="bg-amber-400 text-black rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-20" />}
                              </div>
                          </div>
                          {/* Features List for Lifetime */}
                          <div className={`text-xs space-y-2 pt-4 mt-2 border-t transition-colors ${selectedPlan === 'lifetime' ? 'border-white/20' : 'border-white/10'}`}>
                              <div className="flex items-center gap-2"><Check size={14} className={selectedPlan === 'lifetime' ? "text-amber-400" : "text-[#509f2a]"}/> <span><strong>Accès Premium Illimité à Vie</strong></span></div>
                              <div className="flex items-center gap-2"><Check size={14} className={selectedPlan === 'lifetime' ? "text-amber-400" : "text-[#509f2a]"}/> <span>Plus aucun paiement futur</span></div>
                              <div className="flex items-center gap-2"><Check size={14} className={selectedPlan === 'lifetime' ? "text-amber-400" : "text-[#509f2a]"}/> <span>Toutes les futures mises à jour</span></div>
                          </div>
                      </div>

                  </div>

                  {/* PROMO CODE FIELD */}
                  <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <Gift size={14} className="text-gray-500" />
                      </div>
                      <input 
                        type="text" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Code Promo / Parrainage (Optionnel)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:border-[#509f2a] outline-none transition-colors uppercase tracking-widest"
                      />
                  </div>

                  {/* Payment Button */}
                  <div className="pt-2">
                      <button 
                        onClick={handleProcessPayment}
                        disabled={processing}
                        className="w-full bg-[#635bff] hover:bg-[#5851e3] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                          {processing ? <Loader2 className="animate-spin" size={24}/> : <Lock size={20} />}
                          <span className="text-sm uppercase tracking-widest">
                              {processing ? 'Redirection sécurisée...' : 'Payer et Débloquer'}
                          </span>
                      </button>
                      
                      {/* Trust Badges */}
                      <div className="mt-4 flex flex-col items-center gap-2 opacity-60">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                              <ShieldCheck size={12} /> Paiement Sécurisé par Stripe
                          </div>
                          <div className="flex gap-3 text-[10px] text-gray-500">
                              <span>💳 Carte Bancaire</span>
                              <span>•</span>
                              <span>PayPal</span>
                              <span>•</span>
                              <span>Amazon Pay</span>
                          </div>
                      </div>
                  </div>

                  {/* Bouton d'accès exceptionnel au carnet */}
                  {isTrialExpired && onAccessBook && (
                      <div className="mt-6 pt-6 border-t border-white/10 text-center animate-fade-in">
                          <p className="text-xs text-gray-400 mb-2">Vous avez déjà sauvegardé des recettes ?</p>
                          <button 
                            onClick={onAccessBook}
                            className="flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-gray-300 hover:text-white transition-colors uppercase tracking-widest font-bold"
                          >
                              <Book size={14} /> Accéder à mon carnet (Lecture Seule)
                          </button>
                      </div>
                  )}

                  <p className="text-[10px] text-center text-gray-500 leading-relaxed px-4 pt-4 border-t border-white/5 mt-4">
                      Accès immédiat après paiement. Facture disponible par email.<br/>
                      <button onClick={() => setView && setView(AppView.LEGAL)} className="underline hover:text-white mt-1">Conditions Générales de Vente</button>
                  </p>

              </div>
          </div>
      </div>
    </div>
  );
};

export default Subscription;
