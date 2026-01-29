
import React from 'react';
import { X, ArrowRight, Star, Clock } from 'lucide-react';
import { t } from '../services/translationService'; // Import translation
import { 
  PremiumChefHat, 
  PremiumFingerprint, 
  PremiumGlobe, 
  PremiumWine, 
  PremiumLayers, 
  PremiumEuro, 
  WickerBasket, 
  PremiumHeart, 
  PremiumBriefcase, 
  PremiumShield,
  PremiumPaperPlane
} from './Icons';

interface ValuePropositionProps {
  onClose: () => void;
  onSubscribe: () => void;
}

const ValueProposition: React.FC<ValuePropositionProps> = ({ onClose, onSubscribe }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-white overflow-y-auto animate-fade-in font-body">
      
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            <PremiumChefHat size={24} />
            <span className="font-display text-xl text-chef-dark">{t('vp_title')}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-20 pb-24">
        
        <div className="text-center space-y-4">
            <div className="inline-block bg-chef-green/10 text-chef-green px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
                Offre Découverte
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-chef-dark leading-tight">
                {t('vp_hero_title')}<br/>
                <span className="text-chef-green">{t('vp_hero_sub')}</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
                {t('vp_hero_desc')}
            </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-[2.5rem] shadow-sm border border-green-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
            
            <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 border border-green-50">
                    <PremiumFingerprint size={36} />
                </div>
                <h2 className="text-3xl font-display text-chef-dark mb-4">{t('vp_p1_title')}</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        <strong className="text-chef-dark">{t('vp_p1_prob')}</strong> 
                    </p>
                    <p>
                        <strong className="text-chef-dark">{t('vp_p1_sol')}</strong> {t('vp_p1_desc')}
                    </p>
                    
                    <div className="mt-6 bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-chef-green font-bold uppercase text-xs tracking-wider">
                            <PremiumGlobe size={18} /> {t('vp_univ_title')}
                        </div>
                        <p className="text-sm text-gray-700">
                            {t('vp_univ_desc')}
                        </p>
                    </div>

                    <div className="mt-2 bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                         <div className="flex items-center gap-2 mb-2 text-red-600 font-bold uppercase text-xs tracking-wider">
                            <PremiumWine size={18} className="text-red-600" /> {t('vp_biz_title')}
                        </div>
                        <p className="text-sm text-gray-700">
                            {t('vp_biz_desc')}
                        </p>
                    </div>
                    
                    <div className="mt-2 bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-chef-green font-bold uppercase text-xs tracking-wider">
                            <PremiumLayers size={18} /> {t('vp_batch_title')}
                        </div>
                        <p className="text-sm text-gray-700">
                             {t('vp_batch_desc')}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-[2.5rem] shadow-sm border border-blue-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
            
            <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 border border-blue-50">
                    <PremiumEuro size={36} />
                </div>
                <h2 className="text-3xl font-display text-chef-dark mb-4">{t('vp_p2_title')}</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        <strong className="text-chef-dark">{t('vp_p2_const')}</strong>
                    </p>
                    <p>
                        <strong className="text-chef-dark">MiamChef :</strong> {t('vp_p2_desc')}
                    </p>

                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm mt-4 text-center">
                        <p className="text-sm text-gray-500 mb-1">{t('vp_p2_res')}</p>
                        <p className="text-lg font-bold text-chef-dark">
                            <span className="text-green-600 text-2xl">{t('vp_p2_eco')}</span>
                        </p>
                    </div>

                    <div className="mt-4 flex gap-4 bg-white p-4 rounded-xl border border-blue-100 shadow-sm items-start">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                            <WickerBasket size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-chef-dark text-sm">{t('vp_drive')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-[2.5rem] shadow-sm border border-red-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
            
            <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 border border-red-50">
                    <PremiumHeart size={36} />
                </div>
                <h2 className="text-3xl font-display text-chef-dark mb-4">{t('vp_p3_title')}</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        <strong className="text-chef-dark">{t('vp_p3_exp')}</strong> {t('vp_p3_desc')}
                    </p>
                    
                    <div className="mt-6 bg-red-600 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 bg-yellow-400 w-16 h-16 rounded-full opacity-20"></div>
                        <div className="flex items-center gap-2 mb-2">
                             <PremiumBriefcase size={22} />
                             <span className="font-bold uppercase text-xs tracking-wider text-yellow-300">{t('vp_pros')}</span>
                        </div>
                        <p className="font-display text-lg mb-2">Coachs, Naturopathes, Diététiciens ?</p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-red-600 bg-red-50 px-4 py-2 rounded-full w-fit border border-red-100">
                        <PremiumShield size={20} />
                        <span className="text-xs font-bold uppercase">Scientifically Certified</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="text-center pt-8">
            <h3 className="font-display text-2xl text-chef-dark mb-6">{t('vp_cta_title')}</h3>
            <button 
                onClick={onSubscribe}
                className="w-full bg-chef-green text-white font-display text-xl py-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
                {t('vp_cta_btn')} <PremiumPaperPlane size={24} />
            </button>
            <p className="text-xs text-gray-400 mt-4 max-w-xs mx-auto">
                <Clock size={12} className="inline mr-1"/>
                Offre limitée. Satisfait ou remboursé.
            </p>
        </div>

      </div>
    </div>
  );
};

export default ValueProposition;
