import React, { useState, useRef } from 'react';
import { editDishPhoto, fileToGenerativePart } from '../services/geminiService';
import { LoadingState } from '../types';
import { Wand2, Image as ImageIcon, Loader2, Download, Upload, ShieldCheck } from 'lucide-react';

const DishEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalBase64, setOriginalBase64] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<LoadingState>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setOriginalImage(previewUrl);
    setEditedImage(null);

    try {
      const b64 = await fileToGenerativePart(file);
      setOriginalBase64(b64);
    } catch (err) {
      console.error("Error processing file", err);
    }
  };

  const handleEdit = async () => {
    if (!originalBase64 || !prompt.trim()) return;
    setStatus('loading');
    try {
      const result = await editDishPhoto(originalBase64, prompt);
      setEditedImage(result);
      setStatus('success');
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="pb-32 px-4 pt-6 max-w-3xl mx-auto min-h-screen">
      <header className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-purple-50 rounded-2xl">
          <Wand2 className="text-purple-500" size={28} />
        </div>
        <div>
           <h2 className="text-3xl font-display text-chef-dark leading-none">Styliste Photo</h2>
           <p className="text-gray-500 text-sm font-body">Mode Retouche</p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-3xl shadow-card border border-gray-100">
         <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Original */}
            <div 
                onClick={() => !status.includes('loading') && fileInputRef.current?.click()}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden relative border-2 transition-all ${originalImage ? 'border-purple-200' : 'border-dashed border-gray-200 bg-gray-50 hover:bg-purple-50 hover:border-purple-300'}`}
            >
                {originalImage ? (
                    <>
                        <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg font-bold uppercase backdrop-blur-sm">Avant</div>
                        <div className="absolute top-2 right-2 bg-white/20 p-2 rounded-full backdrop-blur-md hover:bg-white/40 transition-colors">
                            <Upload size={14} className="text-white"/>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-400 p-4">
                        <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                        <span className="text-sm font-display text-purple-500">Ajouter une photo</span>
                    </div>
                )}
            </div>

            {/* Result */}
            <div className={`aspect-square rounded-2xl flex items-center justify-center overflow-hidden relative border-2 ${editedImage ? 'border-chef-green ring-2 ring-green-100' : 'border-dashed border-gray-200 bg-gray-50'}`}>
                {status === 'loading' ? (
                    <div className="text-center">
                       <Loader2 className="animate-spin text-purple-500 mx-auto mb-2" size={32} />
                       <span className="text-xs text-purple-500 font-bold animate-pulse">L'IA travaille...</span>
                    </div>
                ) : editedImage ? (
                    <>
                        <img src={editedImage} alt="Edited" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-chef-green text-white text-[10px] px-2 py-1 rounded-lg font-bold uppercase shadow-sm">Après</div>
                        <a href={editedImage} download="miamchef-edit.png" className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white text-chef-green shadow-md transition-all">
                            <Download size={16} />
                        </a>
                    </>
                ) : (
                    <div className="text-center text-gray-400 p-4">
                        <Wand2 size={32} className="mx-auto mb-2 opacity-50" />
                        <span className="text-sm font-display">Résultat</span>
                    </div>
                )}
            </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-50">
            <div>
                <label className="block text-sm font-bold text-chef-dark mb-2">
                    Votre demande de retouche
                </label>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all font-body"
                        placeholder="Ex: Ajoute un filtre vintage, enlève la fourchette..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button
                        onClick={handleEdit}
                        disabled={!originalBase64 || !prompt || status === 'loading'}
                        className="absolute right-1 top-1 bottom-1 px-4 bg-chef-green text-white rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:bg-gray-300"
                    >
                        <Wand2 size={16} />
                    </button>
                </div>
                <div className="mt-3 flex items-center gap-1.5 justify-center text-[10px] text-gray-400">
                    <ShieldCheck size={10} /> Vos photos ne sont pas conservées. Conformité RGPD.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DishEditor;