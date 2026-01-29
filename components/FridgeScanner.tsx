
import React, { useState, useRef } from 'react';
import { scanFridgeAndSuggest, fileToGenerativePart, generateRecipeImage } from '../services/geminiService';
import { saveRecipeToBook } from '../services/storageService';
import { LoadingState } from '../types';
import { Sparkles, Loader2, Upload, RefreshCw, Lock, Book, Check, Image as ImageIcon, ChevronRight, Camera, Leaf, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PremiumCamera, PremiumChefHat } from './Icons';

const FridgeScanner: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<LoadingState>('idle');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [dietary, setDietary] = useState('Classique (Aucun)');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setResult('');
    setGeneratedImage(null);
    setIsSaved(false);

    try {
      const b64 = await fileToGenerativePart(file);
      setBase64Image(b64);
    } catch (err) {
      console.error("Error processing file", err);
    }
  };

  const handleScan = async () => {
    if (!base64Image) return;
    setStatus('loading');
    setGeneratedImage(null);
    setIsSaved(false);
    try {
      // On passe maintenant le régime alimentaire à la fonction de scan
      const response = await scanFridgeAndSuggest(base64Image, dietary);
      setResult(response);
      setStatus('success');

      // Attempt to generate image automatically based on title if possible
      const titleMatch = response.match(/^#\s+(.+)$/m);
      if (titleMatch) {
          try {
              const img = await generateRecipeImage(titleMatch[1], `Recette anti-gaspillage gourmet ${dietary !== 'Classique (Aucun)' ? dietary : ''}`);
              setGeneratedImage(img);
          } catch(e) {
              console.error("Failed to generate scan image");
          }
      }

    } catch (e) {
      setStatus('error');
    }
  };

  const handleSaveToBook = async () => {
    if (!result) return;
    const titleMatch = result.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : "Recette Anti-Gaspi";

    await saveRecipeToBook({
      id: Date.now().toString(),
      title: title,
      markdownContent: result,
      date: new Date().toLocaleDateString('fr-FR'),
      image: generatedImage || undefined,
      utensils: [], 
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const dietOptions = ["Classique (Aucun)", "Végétarien", "Vegan", "Halal", "Casher", "Sans Gluten", "Sans Lactose", "Régime Crétois", "Sportif (Protéiné)"];

  return (
    <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
      
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
         <img 
           src="https://images.unsplash.com/photo-1626202378370-13f508c9d264?q=80&w=2070&auto=format&fit=crop" 
           className="w-full h-full object-cover opacity-30 fixed"
           alt="Fridge Background"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#051020]/80 to-black fixed"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-10">
        
        {/* Header */}
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-900 to-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.3)] mb-4 border border-blue-500/30">
                <PremiumCamera size={32} className="text-blue-100" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-blue-500 mb-2 drop-shadow-md">
                Scan Anti-Gaspi
            </h1>
            <p className="text-blue-200/60 text-sm font-light tracking-widest uppercase">
                Mode Analyse & Création
            </p>
        </div>

        {/* Input Container (Glassmorphism like Sommelier) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-1.5 shadow-2xl mb-10">
            <div className="bg-black/40 rounded-[1.7rem] p-6 border border-white/5">
                 <label className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">
                    <Sparkles size={12} /> Vos Ingrédients
                 </label>
                 
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                 />

                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full aspect-video rounded-2xl border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden mb-6 group ${
                        imagePreview ? 'border-blue-500/50 bg-black' : 'border-white/20 bg-[#151515] hover:bg-white/5 hover:border-blue-400/50'
                    }`}
                 >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                    {imagePreview ? (
                        <>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="flex items-center gap-2 text-white font-bold bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
                                    <RefreshCw size={16} /> Changer la photo
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-200 transition-colors z-10">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                <Camera size={28} className="opacity-70" />
                            </div>
                            <p className="font-display text-lg text-white">Ajouter une photo</p>
                            <p className="text-xs opacity-50 font-sans mt-1">Frigo, placard ou ingrédients en vrac</p>
                        </div>
                    )}
                 </div>

                 {/* Dietary Select for Scanner */}
                 <div className="mb-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
                        <Leaf size={12} /> Régime Spécifique ?
                    </label>
                    <div className="relative group">
                        <div className="flex items-center justify-between bg-[#151515] hover:bg-[#1a1a1a] text-white px-4 py-3.5 rounded-xl border border-white/10 focus-within:border-blue-500/50 transition-colors">
                            <span className="font-medium text-sm text-gray-200">{dietary}</span>
                            <ChevronDown size={16} className="text-gray-500" />
                        </div>
                        <select 
                            value={dietary}
                            onChange={(e) => setDietary(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                            {dietOptions.map(opt => <option key={opt} value={opt} className="bg-[#1a1a1a] text-white">{opt}</option>)}
                        </select>
                    </div>
                 </div>

                 <button 
                    onClick={handleScan}
                    disabled={!base64Image || status === 'loading'}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-700 to-[#0a204a] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-blue-900/40 hover:shadow-blue-700/60 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
                 >
                    {status === 'loading' ? <Loader2 className="animate-spin" /> : <>Analyser & Cuisiner <ChevronRight size={16}/></>}
                 </button>
            </div>
        </div>

        {/* Results Card */}
        {result && (
            <div className="animate-fade-in relative">
                {/* Glow effect behind */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-[2.2rem] blur-xl"></div>
                
                <div className="relative bg-[#121212] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                    
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-950/50 to-black p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <PremiumChefHat size={24} className="text-blue-400" />
                            <span className="font-display text-xl text-gray-100">La Création du Chef</span>
                        </div>
                        
                        <button 
                            onClick={handleSaveToBook}
                            disabled={isSaved}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${isSaved ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                        >
                            {isSaved ? <Check size={12}/> : <Book size={12}/>}
                            {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                         {generatedImage && (
                            <div className="w-full h-56 rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-2xl relative group">
                                <img src={generatedImage} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Plat généré" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                    <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 px-2 py-1 rounded text-[9px] text-blue-100 uppercase font-bold">
                                        Suggestion IA
                                    </div>
                                    {dietary !== 'Classique (Aucun)' && (
                                        <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 px-2 py-1 rounded text-[9px] text-green-100 uppercase font-bold">
                                            {dietary}
                                        </div>
                                    )}
                                </div>
                            </div>
                         )}

                         <div className="markdown-prose prose-invert text-gray-300 leading-relaxed space-y-4">
                            <ReactMarkdown
                                components={{
                                    h1: ({node, ...props}) => <h3 className="text-xl font-display text-blue-200 mb-4 mt-2" {...props} />,
                                    h2: ({node, ...props}) => <h4 className="text-lg font-bold text-white mb-3 mt-6 border-b border-blue-900/30 pb-2" {...props} />,
                                    strong: ({node, ...props}) => <strong className="text-blue-400 font-bold" {...props} />,
                                    ul: ({node, ...props}) => <ul className="space-y-2 my-4" {...props} />,
                                    li: ({node, ...props}) => <li className="flex items-start gap-2" {...props}><span className="mt-2 w-1 h-1 bg-blue-500 rounded-full shrink-0"></span><span className="flex-1">{props.children}</span></li>
                                }}
                            >
                                {result}
                            </ReactMarkdown>
                         </div>
                    </div>
                </div>
            </div>
        )}

        <div className="mt-12 text-center pb-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-blue-200/40 font-bold uppercase tracking-wider bg-blue-900/10 px-3 py-1 rounded-full border border-blue-500/10">
                  <Lock size={10} /> Confidentialité Totale
            </div>
            <p className="text-[11px] uppercase tracking-widest text-white max-w-sm leading-relaxed font-medium">
                Conformément au RGPD, cette photo est analysée instantanément par l'IA puis immédiatement supprimée. Aucune donnée n'est conservée.
            </p>
        </div>

      </div>
    </div>
  );
};

export default FridgeScanner;
