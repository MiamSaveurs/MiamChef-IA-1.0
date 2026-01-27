
import React, { useState } from 'react';
import { getSommelierAdvice } from '../services/geminiService';
import { LoadingState, GroundingChunk } from '../types';
import { Search, Loader2, ExternalLink, Sparkles, User, FileText, TrendingUp, Euro } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PremiumWine, PremiumChefHat } from './Icons';

const Sommelier: React.FC = () => {
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
      const result = await getSommelierAdvice(finalQuery, 'b2c');
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
            <div className="p-3 rounded-2xl bg-green-50">
                <PremiumWine size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-display text-chef-dark leading-none">Sommelier IA</h2>
                <p className="text-gray-500 text-sm font-body">Accords Mets & Vins</p>
            </div>
        </div>
      </header>

      <div className="rounded-[2.5rem] p-6 md:p-10 shadow-card border transition-all mb-8 bg-white border-gray-100">
        
        <div className="mb-8 text-center">
            <h3 className="font-display text-2xl mb-2 text-chef-dark">
                Quel vin pour votre repas ?
            </h3>
            <p className="text-sm max-w-lg mx-auto text-gray-500">
                L'IA trouve la bouteille idéale pour sublimer votre plat, selon vos goûts.
            </p>
        </div>

        <div className="max-w-2xl mx-auto w-full space-y-4">
            <div className="flex items-center px-4 py-2 gap-3 rounded-2xl border transition-colors bg-gray-50 border-gray-100 focus-within:ring-2 focus-within:ring-chef-green focus-within:bg-white">
                <Search className="text-gray-400" />
                <input
                    type="text"
                    className="flex-1 py-3 bg-transparent border-none focus:ring-0 outline-none font-body text-lg text-chef-dark placeholder-gray-400"
                    placeholder="Ex: Lasagnes, Sushi, Fromage..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                />
            </div>

            <button
                onClick={() => handleAsk()}
                disabled={status === 'loading' || !query}
                className="w-full bg-chef-green text-white px-6 py-4 rounded-2xl font-bold font-display tracking-wide hover:bg-green-600 transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
            >
                {status === 'loading' ? <Loader2 className="animate-spin" /> : <><Sparkles size={20}/> Trouver l'accord parfait</>}
            </button>
        </div>
      </div>

      {advice && (
        <div className="p-8 rounded-[2rem] shadow-card border animate-fade-in relative mb-8 bg-white border-gray-100">
           <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
             <div className="flex items-center gap-2">
                <PremiumChefHat size={28} />
                <h3 className="font-display text-2xl text-chef-dark m-0 border-none p-0">La Sélection</h3>
             </div>
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
      </div>
    </div>
  );
};

export default Sommelier;
