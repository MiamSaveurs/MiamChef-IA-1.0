
import React, { useState, useRef } from 'react';
import { scanFridgeAndSuggest, fileToGenerativePart, generateRecipeImage } from '../services/geminiService';
import { saveRecipeToBook } from '../services/storageService';
import { LoadingState, GeneratedContent } from '../types';
import { Sparkles, Loader2, RefreshCw, Lock, ChevronRight, Camera, Leaf, ChevronDown } from 'lucide-react';
import { PremiumCamera } from './Icons';
import RecipeResultCard from './RecipeResultCard';

interface FridgeScannerProps {
  persistentState: (GeneratedContent & { dietary?: string }) | null;
  setPersistentState: (data: (GeneratedContent & { dietary?: string }) | null) => void;
}

const FridgeScanner: React.FC<FridgeScannerProps> = ({ persistentState, setPersistentState }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [dietary, setDietary] = useState('Classique (Aucun)');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync result with persistent state
  const result = persistentState;
  const setResult = setPersistentState;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setResult(null);
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

    try {
      // Check for API key for high quality images (Gemini 3.1 Flash Image)
      // @ts-expect-error - AIS Studio API
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          // @ts-expect-error - AIS Studio API
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) {
               // @ts-expect-error - AIS Studio API
               await window.aistudio.openSelectKey();
          }
      }
    } catch (e) {
      console.warn("AI Studio key check failed", e);
    }

    setStatus('loading');
    setGeneratedImage(null);
    setIsSaved(false);
    try {
      // On passe maintenant le régime alimentaire à la fonction de scan
      const response = await scanFridgeAndSuggest(base64Image, dietary);
      setResult({ ...response, dietary });
      setStatus('success');

      // Attempt to generate image automatically based on title if possible
      const title = response.seoTitle || "Recette Anti-Gaspi";
      try {
          const imageIngredients = response.ingredients || [];
          const img = await generateRecipeImage(title, `Recette anti-gaspillage gourmet ${dietary !== 'Classique (Aucun)' ? dietary : ''}`, imageIngredients);
          setGeneratedImage(img);
          setResult({ ...response, dietary, image: img });
      } catch(err) {
          console.error("Failed to generate scan image", err);
      }

    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleSaveToBook = async () => {
    if (!result) return;
    const title = result.seoTitle || "Recette Anti-Gaspi";

    try {
      await saveRecipeToBook({
        id: Date.now().toString(),
        title: title,
        markdownContent: result.text,
        date: new Date().toLocaleDateString('fr-FR'),
        image: generatedImage || result.image || undefined,
        utensils: result.utensils || [], 
        metrics: result.metrics || undefined,
        ingredients: result.ingredients || [],
        ingredientsWithQuantities: result.ingredientsWithQuantities || [],
        steps: result.steps || [],
        storageAdvice: result.storageAdvice || undefined,
        seoTitle: result.seoTitle || undefined,
        seoDescription: result.seoDescription || undefined,
        servings: result.servings || 2,
        dietary: dietary,
        cuisineStyle: result.cuisineStyle || 'Anti-Gaspi',
        chefMode: 'cuisine',
        faq: result.faq
      });
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save recipe", err);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const handleClearResult = () => {
    setResult(null);
    setGeneratedImage(null);
    setImagePreview(null);
    setBase64Image(null);
    setStatus('idle');
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
            <RecipeResultCard 
                result={result}
                generatedImage={generatedImage}
                isSaved={isSaved}
                onSave={handleSaveToBook}
                onClose={handleClearResult}
            />
        )}

        <div className="mt-12 text-center pb-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-blue-200/40 font-bold uppercase tracking-wider bg-blue-900/10 px-3 py-1 rounded-full border border-blue-500/10">
                  <Lock size={10} /> Confidentialité Totale
            </div>
            <p className="text-[11px] uppercase tracking-widest text-white max-w-sm leading-relaxed font-medium">
                Conformément au RGPD, cette photo est analysée instantanément par le moteur sécurisé puis immédiatement supprimée. Aucune donnée n'est conservée.
            </p>
        </div>

      </div>
    </div>
  );
};

export default FridgeScanner;
