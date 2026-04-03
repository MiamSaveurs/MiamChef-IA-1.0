
import React from 'react';
import { Book, Check, Utensils, Snowflake, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PremiumChefHat } from './Icons';
import { GeneratedContent } from '../types';
import { processAffiliateLink } from '../constants/affiliateLinks';

interface RecipeResultCardProps {
  result: GeneratedContent;
  generatedImage: string | null;
  dietary: string;
  isSaved: boolean;
  onSave: () => void;
  onClose: () => void;
}

const RecipeResultCard: React.FC<RecipeResultCardProps> = ({ 
  result, 
  generatedImage, 
  dietary, 
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
                            {dietary !== 'Classique (Aucun)' && (
                                <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 px-2 py-1 rounded text-[9px] text-green-100 uppercase font-bold">
                                    {dietary}
                                </div>
                            )}
                        </div>
                    </div>
                 )}

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
                            ul: ({...props}) => <ul className="space-y-2 my-4" {...props} />,
                            li: ({...props}) => <li className="flex items-start gap-2" {...props}><span className="mt-2 w-1 h-1 bg-blue-500 rounded-full shrink-0"></span><span className="flex-1">{props.children}</span></li>,
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
            </div>
        </div>
    </div>
  );
};

export default RecipeResultCard;
