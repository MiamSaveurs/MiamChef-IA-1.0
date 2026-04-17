
import React from 'react';
import { Book, Check, Utensils, Snowflake, XCircle, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PremiumChefHat, PremiumCake } from './Icons';
import { GeneratedContent } from '../types';
import { processAffiliateLink } from '../constants/affiliateLinks';

interface RecipeResultCardProps {
  result: GeneratedContent;
  generatedImage: string | null;
  isSaved: boolean;
  onSave: () => void;
  onClose: () => void;
}

const RecipeResultCard: React.FC<RecipeResultCardProps> = ({ 
  result, 
  generatedImage, 
  isSaved, 
  onSave, 
  onClose 
}) => {
  return (
    <div className="animate-fade-in relative max-w-2xl mx-auto">
        {/* Clear Button */}
        <button 
            onClick={onClose}
            className="absolute -top-3 -right-3 z-30 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors border-2 border-black"
            title="Effacer la recette"
        >
            <XCircle size={24} />
        </button>

        {/* Glow effect behind */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-[2.2rem] blur-xl"></div>
        
        <div className="relative bg-[#121212] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-950/50 to-black p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <PremiumChefHat size={24} className="text-blue-400" />
                    <span className="font-display text-xl text-gray-100">Votre Recette Anti-Gaspi</span>
                </div>
                
                <button 
                    onClick={onSave}
                    disabled={isSaved}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${isSaved ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                >
                    {isSaved ? <Check size={12}/> : <Book size={12}/>}
                    {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
                </button>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                 {result.utensils && result.utensils.length > 0 && (
                    <div className="mb-8 bg-blue-500/5 rounded-2xl border border-blue-500/20 p-4">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
                            <Utensils size={14} /> Matériel Nécessaire
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {result.utensils.map((u, i) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-200 uppercase">
                                    {u}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                  {(generatedImage || result.image) && (
                    <div className="w-full h-56 rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-2xl relative group">
                        <img src={generatedImage || result.image || ''} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Plat généré" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 px-2 py-1 rounded text-[9px] text-blue-100 uppercase font-bold">
                                Suggestion Miam
                            </div>
                        </div>
                    </div>
                 )}

                 {/* Badges Régime et Style */}
                 <div className="flex flex-wrap items-center gap-2 mb-6">
                    {result.chefMode && (
                        <div className={`px-2 py-1 rounded text-[9px] text-white uppercase font-bold flex items-center gap-1 ${result.chefMode === 'patisserie' ? 'bg-pink-600' : 'bg-amber-600'}`}>
                            {result.chefMode === 'patisserie' ? <PremiumCake size={10}/> : <PremiumChefHat size={10}/>}
                            {result.chefMode === 'patisserie' ? 'Sucré' : 'Salé'}
                        </div>
                    )}
                    {result.dietary && (
                        <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 px-2 py-1 rounded text-[9px] text-green-100 uppercase font-bold">
                            {result.dietary}
                        </div>
                    )}
                    {result.cuisineStyle && (
                        <div className="bg-amber-500/20 backdrop-blur-md border border-amber-500/30 px-2 py-1 rounded text-[9px] text-amber-100 uppercase font-bold">
                            {result.cuisineStyle}
                        </div>
                    )}
                 </div>

                  {/* NOUVEAU : Infos nutritionnelles et portions */}
                  <div className="grid grid-cols-4 gap-2 mb-8 py-6 border-y border-white/5">
                     <div className="text-center border-r border-white/10">
                         <div className="text-xl font-display text-white">{result.metrics?.nutriScore || '---'}</div>
                         <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Nutri</div>
                     </div>
                     <div className="text-center border-r border-white/10">
                         <div className="text-xl font-display text-white">{result.metrics?.caloriesPerPerson || '---'}</div>
                         <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Kcal</div>
                     </div>
                     <div className="text-center border-r border-white/10">
                         <div className="text-xl font-display text-white">{result.metrics?.proteins || 0}g</div>
                         <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Prot.</div>
                     </div>
                     <div className="text-center">
                         <div className="text-xl font-display text-white">{result.servings || 2}</div>
                         <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Pers.</div>
                     </div>
                  </div>

                 <div className="markdown-prose prose-invert text-gray-300 leading-relaxed space-y-4">
                    <ReactMarkdown
                        components={{
                            h1: ({...props}) => <h3 className="text-xl font-display text-blue-200 mb-4 mt-2" {...props} />,
                            h2: ({...props}) => <h4 className="text-lg font-bold text-white mb-3 mt-6 border-b border-blue-900/30 pb-2" {...props} />,
                            strong: ({...props}) => <strong className="text-blue-400 font-bold" {...props} />,
                            ul: ({...props}) => <ul className="space-y-3 my-4" {...props} />,
                            li: ({node, ...props}) => {
                                const hasImage = JSON.stringify(node).includes('"tagName":"img"');
                                return (
                                    <li className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors mb-2" {...props}>
                                        {!hasImage && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 ml-3"></span>}
                                        <span className="flex-1 flex items-center text-gray-200 font-medium">{props.children}</span>
                                    </li>
                                );
                            },
                            img: ({ src, alt, ...props }) => (
                                <div className="w-16 h-16 shrink-0 bg-[#1a1a1a] rounded-xl flex items-center justify-center p-2 mr-3 shadow-inner border border-white/5">
                                    <img 
                                        src={src} 
                                        alt={alt} 
                                        className="w-full h-full object-contain drop-shadow-xl" 
                                        referrerPolicy="no-referrer" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                                        }}
                                        {...props} 
                                    />
                                </div>
                            ),
                            a: ({ href, ...props }) => <a href={processAffiliateLink(href)} className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
                        }}
                    >
                        {result.text}
                    </ReactMarkdown>
                 </div>

                 {result.storageAdvice && (
                    <div className="mt-8 p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-lg">
                        <h3 className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
                            <Snowflake size={14} /> Conseils de Conservation
                        </h3>
                        <p className="text-sm text-gray-300 font-light leading-relaxed italic">
                            {result.storageAdvice}
                        </p>
                    </div>
                 )}
                  {result.faq && result.faq.length > 0 && (
                    <div className="mt-8 p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <HelpCircle size={64} className="text-purple-400" />
                        </div>
                        <h3 className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-6 relative z-10">
                            <HelpCircle size={14} /> Foire Aux Questions (FAQ)
                        </h3>
                        <div className="space-y-6 relative z-10">
                            {result.faq.map((item, idx) => (
                                <div key={idx} className="group">
                                    <h4 className="text-sm font-bold text-white mb-2 flex items-start gap-2">
                                        <span className="text-purple-500 mt-0.5">•</span>
                                        {item.question}
                                    </h4>
                                    <p className="text-xs text-gray-400 leading-relaxed pl-4 border-l border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                                        {item.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
            </div>
        </div>
    </div>
  );
};

export default RecipeResultCard;
