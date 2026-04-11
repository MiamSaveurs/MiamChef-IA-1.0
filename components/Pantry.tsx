import React, { useState, useEffect, useRef } from 'react';
import { PantryItem } from '../types';
import { getPantryItems, savePantryItem, deletePantryItem } from '../services/storageService';
import { parseVoiceToPantryItems } from '../services/geminiService';
import { ChevronLeft, Mic, Plus, Trash2, MicOff, Loader2 } from 'lucide-react';

const CATEGORIES = [
  "Légumes", "Fruits", "Viandes & Poissons", "Produits Laitiers", "Épicerie", "Boissons", "Autre"
];

const Pantry: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(CATEGORIES[0]);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    loadItems();
    
    // Initialize Speech Recognition
    const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current = new (SpeechRecognitionAPI as any)();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'fr-FR';
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsRecording(false);
          await handleVoiceInput(transcript);
        };
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
          if (event.error === 'not-allowed') {
            setMicError("L'accès au micro a été refusé. Veuillez autoriser le micro dans les réglages de votre navigateur.");
          } else if (event.error === 'network') {
            setMicError("Erreur réseau. Vérifiez votre connexion internet.");
          } else {
            setMicError("Une erreur est survenue avec le micro.");
          }
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadItems = async () => {
    const data = await getPantryItems();
    setItems(data);
    setLoading(false);
  };

  const handleVoiceInput = async (text: string) => {
    setIsProcessingVoice(true);
    try {
      const parsedItems = await parseVoiceToPantryItems(text);
      for (const item of parsedItems) {
        if (item.name && item.category) {
          const newItem: PantryItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: item.name,
            quantity: item.quantity || '1',
            category: item.category,
            dateAdded: new Date().toLocaleDateString('fr-FR')
          };
          await savePantryItem(newItem);
        }
      }
      await loadItems();
    } catch (error) {
      console.error("Failed to parse voice input", error);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const toggleRecording = () => {
    setMicError(null);
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!recognitionRef.current) {
        const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
          setMicError("Désolé, votre navigateur ne supporte pas la reconnaissance vocale.");
          return;
        }
      }
      
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
        setMicError("Impossible de démarrer le micro. Vérifiez les autorisations.");
      }
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    const newItem: PantryItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: newItemName.trim(),
      quantity: newItemQuantity.trim() || '1',
      category: newItemCategory,
      dateAdded: new Date().toLocaleDateString('fr-FR')
    };
    
    await savePantryItem(newItem);
    setNewItemName('');
    setNewItemQuantity('');
    await loadItems();
  };

  const handleDelete = async (id: string) => {
    await deletePantryItem(id);
    await loadItems();
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PantryItem[]>);

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-sans">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button 
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 border border-white/10 transition-colors backdrop-blur-md"
          >
              <ChevronLeft size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Retour</span>
          </button>
        </div>

        <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-display text-[#509f2a] mb-2 drop-shadow-md">
                Garde-Manger
            </h1>
            <p className="text-[#509f2a]/60 text-sm font-light tracking-widest uppercase">
                Mon inventaire virtuel
            </p>
        </div>

        {/* Voice Input Section */}
        <div className="bg-[#15151a] border border-[#509f2a]/30 rounded-[2rem] p-6 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#509f2a]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-xl font-display text-white mb-4">Ajout Vocal Rapide</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Appuyez sur le micro et dictez vos ingrédients. MiamChef s'occupe de les ranger !<br/>
            <span className="italic opacity-70">Ex: "J'ai acheté 3 tomates, 500g de poulet et du lait."</span>
          </p>
          
          <button 
            onClick={toggleRecording}
            disabled={isProcessingVoice}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 shadow-xl ${
              isRecording 
                ? 'bg-red-500 animate-pulse shadow-red-500/50' 
                : isProcessingVoice 
                  ? 'bg-amber-500 cursor-not-allowed' 
                  : 'bg-[#509f2a] hover:bg-[#428522] hover:scale-105 shadow-[#509f2a]/30'
            }`}
          >
            {isProcessingVoice ? (
              <Loader2 size={32} className="text-white animate-spin" />
            ) : isRecording ? (
              <MicOff size={32} className="text-white" />
            ) : (
              <Mic size={32} className="text-white" />
            )}
          </button>
          {isRecording && <p className="text-red-400 text-xs font-bold mt-4 animate-pulse">Écoute en cours...</p>}
          {isProcessingVoice && <p className="text-amber-400 text-xs font-bold mt-4 animate-pulse">MiamChef range vos courses...</p>}
          
          {micError && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs animate-fade-in">
              <p className="font-bold mb-1">Problème avec le micro :</p>
              <p>{micError}</p>
              <button 
                onClick={() => {
                  setMicError(null);
                  toggleRecording();
                }}
                className="mt-2 text-white underline font-bold"
              >
                Réessayer
              </button>
            </div>
          )}
          
          {!micError && !isRecording && !isProcessingVoice && (
            <p className="text-gray-500 text-[10px] mt-4 uppercase tracking-widest opacity-50">
              Cliquez pour parler
            </p>
          )}
        </div>

        {/* Manual Input Form */}
        <form onSubmit={handleManualAdd} className="bg-[#121212] border border-white/10 rounded-2xl p-4 mb-10 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-500 mb-1 ml-1 uppercase tracking-wider">Ingrédient</label>
            <input 
              type="text" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Ex: Tomate"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#509f2a] focus:ring-1 focus:ring-[#509f2a] outline-none transition-all"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs text-gray-500 mb-1 ml-1 uppercase tracking-wider">Qté</label>
            <input 
              type="text" 
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              placeholder="Ex: 3"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#509f2a] focus:ring-1 focus:ring-[#509f2a] outline-none transition-all"
            />
          </div>
          <div className="w-40">
            <label className="block text-xs text-gray-500 mb-1 ml-1 uppercase tracking-wider">Catégorie</label>
            <select 
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#509f2a] focus:ring-1 focus:ring-[#509f2a] outline-none transition-all appearance-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button 
            type="submit"
            disabled={!newItemName.trim()}
            className="bg-white/10 hover:bg-[#509f2a] text-white p-3 rounded-xl border border-white/10 hover:border-[#509f2a] transition-all disabled:opacity-50 disabled:hover:bg-white/10 disabled:hover:border-white/10"
          >
            <Plus size={24} />
          </button>
        </form>

        {/* Inventory Display */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="text-[#509f2a] animate-spin" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
            <p className="text-gray-400 font-display text-xl">Votre garde-manger est vide.</p>
            <p className="text-gray-600 text-sm mt-2">Ajoutez des ingrédients pour commencer !</p>
          </div>
        ) : (
          <div className="space-y-8">
            {CATEGORIES.map(category => {
              const categoryItems = groupedItems[category];
              if (!categoryItems || categoryItems.length === 0) return null;
              
              return (
                <div key={category} className="animate-fade-in">
                  <h3 className="text-lg font-display text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#509f2a]"></span>
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {categoryItems.map(item => (
                      <div key={item.id} className="bg-[#121212] border border-white/5 rounded-2xl p-4 flex flex-col items-center relative group hover:border-[#509f2a]/50 transition-colors">
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        
                        <span className="text-sm font-bold text-white text-center line-clamp-1 w-full mt-2">{item.name}</span>
                        <span className="text-xs text-[#509f2a] font-bold mt-2 bg-[#509f2a]/10 px-3 py-1 rounded-full">{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Pantry;
