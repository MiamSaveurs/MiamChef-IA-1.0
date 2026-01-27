
import React, { useState, useRef } from 'react';
import { scanFridgeAndSuggest, fileToGenerativePart, generateRecipeImage } from '../services/geminiService';
import { saveRecipeToBook } from '../services/storageService';
import { LoadingState } from '../types';
import { Sparkles, Loader2, Upload, RefreshCw, Lock, Book, Check, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PremiumCamera } from './Icons';

const FridgeScanner: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [status, setStatus] = useState<LoadingState>('idle');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
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
      const response = await scanFridgeAndSuggest(base64Image);
      setResult(response);
      setStatus('success');

      // Attempt to generate image automatically based on title
      const titleMatch = response.match(/^#\s+(.+)$/m);
      if (titleMatch) {
          try {
              const img = await generateRecipeImage(titleMatch[1], "Recette anti-gaspillage faite avec des restes");
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
    // Extract title
    const titleMatch = result.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : "Recette Anti-Gaspi";

    await saveRecipeToBook({
      id: Date.now().toString(),
      title: title,
      markdownContent: result,
      date: new Date().toLocaleDateString('fr-FR'),
      // Metrics are missing from basic scan, but we can save the text and image
      image: generatedImage || undefined,
      utensils: [], 
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="pb-32 px-4 pt-6 max-w-3xl mx-auto min-h-screen">
       <header className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-blue-50 rounded-2xl">
          <PremiumCamera size={32} />
        </div>
        <div>
           <h2 className="text-3xl font-display text-chef-dark leading-none">Scan Anti-Gaspi</h2>
           <p className="text-gray-500 text-sm font-body">Mode Analyse</p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-3xl shadow-card border border-gray-100 mb-8 flex flex-col items-center">
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
          className={`w-full max-w-md aspect-video border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${
            imagePreview ? 'border-chef-green bg-gray-900' : 'border-gray-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-300'
          }`}
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-white font-bold flex gap-2 font-display text-xl items-center"><RefreshCw size={20}/> Changer</span>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                <Upload size={32} className="text-blue-500" />
              </div>
              <p className="text-chef-dark font-display text-lg">Ajouter une photo</p>
              <p className="text-xs text-gray-400 mt-1 font-body">Frigo, placard ou ingrédients en vrac</p>
            </>
          )}
        </div>

        <div className="w-full max-md mt-6">
           <button
            onClick={handleScan}
            disabled={!base64Image || status === 'loading'}
            className="w-full bg-chef-green text-white font-display text-xl py-3.5 rounded-2xl shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:translate-y-0"
          >
            {status === 'loading' ? (
              <><Loader2 className="animate-spin" /> Analyse des ingrédients...</>
            ) : (
              <><Sparkles /> Générer la Recette</>
            )}
          </button>
          
          <div className="mt-4 flex flex-col items-center gap-1 text-center">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full">
                  <Lock size={10} /> 100% Confidentiel & Sécurisé
              </div>
              <p className="text-[10px] text-gray-400 max-w-xs leading-tight">
                  Conformément au RGPD, cette photo est analysée instantanément par l'IA puis immédiatement supprimée. Aucune image n'est stockée sur nos serveurs.
              </p>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-3xl shadow-card border border-gray-100 animate-fade-in mb-8">
           
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
             <div className="flex items-center gap-2">
                 <div className="p-2 bg-green-100 rounded-lg text-chef-green"><Sparkles size={20} /></div>
                 <h3 className="font-display text-2xl text-chef-dark m-0 border-none p-0">Suggestion du Chef</h3>
             </div>
             
             <button 
                onClick={handleSaveToBook} 
                disabled={isSaved} 
                className={`flex items-center justify-center gap-2 font-bold text-sm px-4 py-2 rounded-xl transition-colors border shadow-sm ${isSaved ? 'bg-green-50 text-green-700 border-green-200' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
             >
                {isSaved ? <Check size={18} /> : <Book size={18} />} {isSaved ? 'Enregistré' : 'Ajouter au carnet'}
             </button>
           </div>

           {generatedImage ? (
               <div className="w-full h-48 md:h-64 bg-gray-100 rounded-2xl overflow-hidden mb-6 relative shadow-md">
                   <img src={generatedImage} alt="Recette générée" className="w-full h-full object-cover" />
                   <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                       <Sparkles size={10} className="text-chef-green" /> Aperçu IA
                   </div>
               </div>
           ) : status === 'success' ? (
               <div className="w-full h-32 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mb-6 flex items-center justify-center gap-2 text-gray-400">
                   <Loader2 size={20} className="animate-spin text-chef-green" />
                   <span className="text-sm font-medium">Création de la photo du plat...</span>
               </div>
           ) : null}

          <div className="markdown-prose font-body text-chef-dark">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default FridgeScanner;
