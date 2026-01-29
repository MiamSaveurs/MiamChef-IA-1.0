
import React, { useState } from 'react';
import { Check, X, ShieldCheck, Lock, Eye, Circle, Star } from 'lucide-react';
import { startSubscription } from '../services/storageService';
import { t } from '../services/translationService'; // Import translation
import { AppView } from '../types';

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
      setTimeout(() => {
          setProcessing(false);
          startSubscription(selectedPlan);
          alert(t('success'));
          window.location.reload(); 
      }, 1500);
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

      <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-12 px-4">
          
          <div className="w-full max-w-lg bg-[#1a1c1a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in">
              
              <div className="pt-10 pb-6 px-8 text-center">
                  <h1 className="font-display text-4xl md:text-5xl mb-4 text-white drop-shadow-sm font-normal">
                      {t('sub_title')}
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-sm mx-auto">
                      {t('sub_desc')}
                  </p>
              </div>

              <div className="px-6 pb-10 space-y-8">
                  
                  <div>
                      <h2 className="text-xl font-serif italic mb-4 opacity-90 text-center md:text-left">{t('sub_step1')}</h2>
                      
                      <div className="space-y-4">
                          
                          <div 
                            onClick={() => setSelectedPlan('monthly')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'monthly' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg ring-1 ring-[#4a7c45]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <div className="text-2xl font-display mb-1">{t('sub_monthly')}</div>
                                      <div className="text-xs font-medium opacity-90">{t('sub_monthly_detail')}</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'monthly' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              <div className={`text-xs space-y-1.5 pt-3 border-t ${selectedPlan === 'monthly' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> {t('sub_feat_unlimited')}</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> {t('sub_feat_scan')}</div>
                              </div>
                          </div>

                          <div 
                            onClick={() => setSelectedPlan('annual')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer group ${selectedPlan === 'annual' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg ring-1 ring-[#4a7c45]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              {selectedPlan === 'annual' && (
                                <div className="absolute -top-3 right-4 bg-[#509f2a] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                                    {t('sub_annual_best')}
                                </div>
                              )}
                              
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <div className="text-2xl font-display mb-1">{t('sub_annual')}</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'annual' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              <div className={`text-xs space-y-1.5 pt-3 border-t ${selectedPlan === 'annual' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> {t('sub_feat_create')}</div>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> {t('sub_feat_sommelier')}</div>
                              </div>
                          </div>

                          <div 
                            onClick={() => setSelectedPlan('lifetime')}
                            className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'lifetime' ? 'bg-[#3f622f] border-[#4a7c45] shadow-lg ring-1 ring-[#4a7c45]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <div className="text-2xl font-display mb-1 text-[#509f2a]">{t('sub_lifetime')}</div>
                                      <div className="text-xs font-medium opacity-90">{t('sub_lifetime_detail')}</div>
                                  </div>
                                  <div className="text-white">
                                      {selectedPlan === 'lifetime' ? <div className="bg-white text-[#3f622f] rounded-full p-1"><Check size={16} strokeWidth={4} /></div> : <Circle size={24} className="opacity-30" />}
                                  </div>
                              </div>
                              <div className={`text-xs space-y-1.5 pt-3 border-t ${selectedPlan === 'lifetime' ? 'border-white/20' : 'border-white/10'}`}>
                                  <div className="flex items-center gap-2"><Check size={12} className="opacity-70"/> {t('sub_feat_updates')}</div>
                                  <div className="flex items-center gap-2 text-[#509f2a] font-bold"><Star size={12} fill="currentColor" /> {t('sub_feat_pack')}</div>
                              </div>
                          </div>

                      </div>
                  </div>

                  <div>
                      <h2 className="text-xl font-serif italic mb-4 opacity-90 text-center md:text-left">{t('sub_step2')}</h2>
                      <div className="space-y-3">
                          <button 
                            onClick={handleProcessPayment}
                            className="w-full bg-[#ffc439] hover:bg-[#f4bb33] text-[#2c2e2f] font-bold py-3 rounded-full flex items-center justify-center gap-3 shadow-lg"
                          >
                              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="PayPal" />
                              <span className="opacity-90">PayPal</span>
                          </button>

                          <button 
                            onClick={handleProcessPayment}
                            className="w-full bg-[#635bff] hover:bg-[#5851e3] text-white font-bold py-3 rounded-full flex items-center justify-center gap-3 shadow-lg"
                          >
                              <span className="opacity-80 font-normal text-sm">{t('payment_stripe')}</span>
                          </button>
                      </div>
                  </div>

                  <p className="text-[10px] text-center text-gray-400 leading-relaxed px-4">
                      {t('sub_terms')}
                  </p>

              </div>
          </div>
      </div>
    </div>
  );
};

export default Subscription;
