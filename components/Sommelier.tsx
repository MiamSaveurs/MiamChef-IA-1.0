
import React, { useState } from 'react';
import { getSommelierAdvice } from '../services/geminiService';
import { t } from '../services/translationService'; // Import translation
import { LoadingState, GroundingChunk } from '../types';
import { Search, Loader2, ExternalLink, Sparkles, Quote, ChevronRight } from 'lucide-react';
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
    <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
      
      <div className="absolute inset-0 z-0">
         <img 
           src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop" 
           className="w-full h-full object-cover opacity-30 fixed"
           alt="Wine Background"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1a0505]/80 to-black fixed"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-10">
        
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-900 to-rose-700 shadow-[0_0_30px_rgba(225,29,72,0.3)] mb-4 border border-rose-500/30">
                <PremiumWine size={32} className="text-rose-100" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-rose-500 mb-2 drop-shadow-md">
                {t('som_title')}
            </h1>
            <p className="text-rose-200/60 text-sm font-light tracking-widest uppercase">
                {t('som_sub')}
            </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-1.5 shadow-2xl mb-10">
            <div className="bg-black/40 rounded-[1.7rem] p-6 border border-white/5">
                 <label className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest mb-4">
                    <Sparkles size={12} /> {t('som_label')}
                 </label>
                 
                 <div className="relative group mb-4">
                     <div className="absolute inset-0 bg-rose-500/20 rounded-2xl blur-lg group-hover:bg-rose-500/30 transition-all opacity-0 group-focus-within:opacity-100"></div>
                     <div className="relative flex items-center bg-[#151515] border border-white/10 rounded-2xl focus-within:border-rose-500/50 focus-within:ring-1 focus-within:ring-rose-500/50 transition-all">
                        <Search className="ml-4 text-gray-500" size={20} />
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                            placeholder={t('som_placeholder')}
                            className="w-full bg-transparent border-none py-4 px-4 text-white text-lg placeholder-gray-600 focus:ring-0 outline-none"
                        />
                     </div>
                 </div>

                 <button 
                    onClick={() => handleAsk()}
                    disabled={status === 'loading' || !query}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-700 to-[#4a0404] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-rose-900/40 hover:shadow-rose-700/60 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
                 >
                    {status === 'loading' ? <Loader2 className="animate-spin" /> : <>{t('som_btn')} <ChevronRight size={16}/></>}
                 </button>
            </div>
        </div>

        {advice && (
            <div className="animate-fade-in relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-600/20 to-purple-600/20 rounded-[2.2rem] blur-xl"></div>
                
                <div className="relative bg-[#121212] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                    
                    <div className="bg-gradient-to-r from-rose-950/50 to-black p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <PremiumChefHat size={24} className="text-rose-400" />
                            <span className="font-display text-xl text-gray-100">{t('som_result_title')}</span>
                        </div>
                        <Quote size={20} className="text-white/10" />
                    </div>

                    <div className="p-8">
                         <div className="markdown-prose prose-invert text-gray-300 leading-relaxed space-y-4">
                            <ReactMarkdown
                                components={{
                                    h1: ({node, ...props}) => <h3 className="text-xl font-display text-rose-200 mb-4 mt-2" {...props} />,
                                    h2: ({node, ...props}) => <h4 className="text-lg font-bold text-white mb-3 mt-6 border-b border-rose-900/30 pb-2" {...props} />,
                                    strong: ({node, ...props}) => <strong className="text-rose-400 font-bold" {...props} />,
                                    ul: ({node, ...props}) => <ul className="space-y-2 my-4" {...props} />,
                                    li: ({node, ...props}) => <li className="flex items-start gap-2" {...props}><span className="mt-2 w-1 h-1 bg-rose-500 rounded-full shrink-0"></span><span className="flex-1">{props.children}</span></li>
                                }}
                            >
                                {advice}
                            </ReactMarkdown>
                         </div>
                    </div>

                    {sources.length > 0 && (
                        <div className="bg-black/40 p-5 border-t border-white/5">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">
                                Références
                            </p>
                            <div className="space-y-2">
                                {sources.map((source, idx) => (
                                    <a 
                                        key={idx}
                                        href={source.web?.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-rose-500/20 transition-all group"
                                    >
                                        <ExternalLink size={12} className="text-gray-600 group-hover:text-rose-400 transition-colors" />
                                        <span className="text-xs text-gray-400 group-hover:text-gray-200 truncate">
                                            {source.web?.title || source.web?.uri}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        <div className="mt-12 text-center pb-8">
            <p className="text-[10px] uppercase tracking-widest text-white">
                {t('som_warning')}
            </p>
        </div>

      </div>
    </div>
  );
};

export default Sommelier;
