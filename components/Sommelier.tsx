
import React, { useState } from 'react';
import { getSommelierAdvice } from '../services/geminiService';
import { LoadingState, GroundingChunk } from '../types';
import { Search, Loader2, ExternalLink, Sparkles, User, Briefcase, FileText, TrendingUp, Euro } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PremiumWine, PremiumChefHat } from './Icons';

type UserType = 'individual' | 'pro';

const Sommelier: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('individual');
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [status, setStatus] = useState<LoadingState>('idle');

  const handleAsk = async (customQuery?: string) => {
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;
    
    setStatus('loading');
    setAdvice('');
    setSources([]);
    
    try {
      const result = await getSommelierAdvice(finalQuery, userType === 'pro' ? 'b2b' : 'b2c');
      setAdvice(result.text);
      setSources(result.groundingChunks || []);
      setStatus('success');
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="pb-32 px-4 pt-6 max-w-4xl mx-auto min-h-screen flex flex-col">
      
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl transition-colors ${userType === 'pro' ? 'bg-red-50' : 'bg-green-50'}`}>
                <PremiumWine size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-display text-chef-dark leading-none">Sommelier IA</h2>
                <p className="text-gray-500 text-sm font-body">
                    {userType === 'pro' ? 'Solutions Business & Rentabilité' : 'Accords Mets & Vins'}
                </p>
            </div>
        </div>

        <div className="bg-white border border-gray-100 p-1.5 rounded-xl flex items-center font-bold text-sm shadow-sm">
            <button 
                onClick={() => { setUserType('individual'); setAdvice(''); setQuery(''); }}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${userType === 'individual' ? 'bg-chef-green text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            >
                <User size={18} /> Particulier
            </button>
            <button 
                onClick={() => { setUserType('pro'); setAdvice(''); setQuery(''); }}
                className={`ml-1 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${
                    userType === 'pro' 
                    ? 'bg-white border-2 border-red-600 text-red-600 shadow-md' 
                    : 'text-red-600 hover:bg-red-50' 
                }`}
            >
                <Briefcase size={18} className="text-red-600" strokeWidth={userType === 'pro' ? 3 : 2.5} /> 
                <span className={userType === 'pro' ? '' : 'text-red-600'}>Pro</span>
            </button>
        </div>
      </header>

      <div className={`rounded-[2.5rem] p-6 md:p-10 shadow-card border transition-all mb-8 ${userType === 'pro' ? 'bg-white border-yellow-400 ring-4 ring-yellow-50' : 'bg-white border-gray-100'}`}>
        
        <div className="mb-8 text-center">
            {userType === 'pro' && (
                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                    Espace Professionnel
                </div>
            )}
            <h3 className="font-display text-2xl mb-2 text-chef-dark">
                {userType === 'pro' ? 'Optimisez votre Carte des Vins' : 'Quel vin pour votre repas ?'}
            </h3>
            <p className="text-sm max-w-lg mx-auto text-gray-500">
                {userType === 'pro' 
                    ? "Générez des argumentaires de vente percutants, des fiches techniques précises et des stratégies de prix pour augmenter votre chiffre d'affaires."
                    : "L'IA trouve la bouteille idéale (et son prix) pour sublimer votre plat, selon vos goûts."}
            </p>
        </div>

        <div className="max-w-2xl mx-auto w-full space-y-4">
            <div className="flex items-center px-4 py-2 gap-3 rounded-2xl border transition-colors bg-gray-50 border-gray-100 focus-within:ring-2 focus-within:ring-chef-green focus-within:bg-white">
                <Search className="text-gray-400" />
                <input
                    type="text"
                    className="flex-1 py-3 bg-transparent border-none focus:ring-0 outline-none font-body text-lg text-chef-dark placeholder-gray-400"
                    placeholder={userType === 'pro' ? "Ex: Nom d'une bouteille ou Plat Signature..." : "Ex: Lasagnes, Sushi, Fromage..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                />
            </div>

            {userType === 'pro' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button 
                        onClick={() => handleAsk("Génère un argumentaire de vente commercial pour : " + query)}
                        disabled={!query}
                        className="p-4 bg-white hover:bg-green-50 text-chef-dark rounded-2xl text-xs font-bold border border-gray-200 hover:border-chef-green flex flex-col items-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 group"
                    >
                        <div className="p-2 bg-green-100 text-green-700 rounded-full group-hover:scale-110 transition-transform">
                            <Euro size={18} />
                        </div>
                        Pitch Commercial
                    </button>
                    <button 
                        onClick={() => handleAsk("Crée une fiche technique sommelier détaillée pour : " + query)}
                        disabled={!query}
                        className="p-4 bg-white hover:bg-blue-50 text-chef-dark rounded-2xl text-xs font-bold border border-gray-200 hover:border-blue-300 flex flex-col items-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 group"
                    >
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-full group-hover:scale-110 transition-transform">
                             <FileText size={18} />
                        </div>
                        Fiche Technique
                    </button>
                    <button 
                        onClick={() => handleAsk("Suggère 3 niveaux de gamme (Marge, Cœur, Prestige) pour accompagner : " + query)}
                        disabled={!query}
                        className="p-4 bg-white hover:bg-purple-50 text-chef-dark rounded-2xl text-xs font-bold border border-gray-200 hover:border-purple-300 flex flex-col items-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50 group"
                    >
                        <div className="p-2 bg-purple-100 text-purple-700 rounded-full group-hover:scale-110 transition-transform">
                             <TrendingUp size={18} />
                        </div>
                        Stratégie Prix
                    </button>
                </div>
            )}

            {userType === 'individual' && (
                <button
                    onClick={() => handleAsk()}
                    disabled={status === 'loading' || !query}
                    className="w-full bg-chef-green text-white px-6 py-4 rounded-2xl font-bold font-display tracking-wide hover:bg-green-600 transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
                >
                    {status === 'loading' ? <Loader2 className="animate-spin" /> : <><Sparkles size={20}/> Trouver l'accord parfait</>}
                </button>
            )}
        </div>
      </div>

      {advice && (
        <div className={`p-8 rounded-[2rem] shadow-card border animate-fade-in relative mb-8 ${userType === 'pro' ? 'bg-white border-yellow-400/30' : 'bg-white border-gray-100'}`}>
           <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
             <div className="flex items-center gap-2">
                <PremiumChefHat size={28} />
                <h3 className="font-display text-2xl text-chef-dark m-0 border-none p-0">
                    {userType === 'pro' ? 'L\'Expertise MiamChef' : 'La Sélection'}
                </h3>
             </div>
             {userType === 'pro' && (
                 <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                     Mode B2B Actif
                 </div>
             )}
           </div>
           
          <div className="markdown-prose font-body text-chef-dark">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>

          {sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Références Web</p>
              <div className="grid gap-3">
                {sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.web?.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-50 rounded-xl text-sm text-chef-dark hover:bg-green-50 hover:text-chef-green transition-colors flex items-center gap-3 group border border-gray-100 hover:border-chef-green/30"
                  >
                    <ExternalLink size={14} className="text-gray-400 group-hover:text-chef-green" /> 
                    <span className="truncate font-medium">{source.web?.title || source.web?.uri}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto text-center py-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide border-t border-gray-200 pt-4">
              L'abus d'alcool est dangereux pour la santé, à consommer avec modération.
          </p>
          {userType === 'pro' && (
              <p className="text-xs text-red-700 font-bold mt-2">
                  L'exploitant d'un débit de boissons doit détenir une licence valide (L. 3332-3 CSP).
              </p>
          )}
      </div>
    </div>
  );
};

export default Sommelier;
