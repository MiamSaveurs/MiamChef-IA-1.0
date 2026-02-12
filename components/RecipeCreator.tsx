import React, { useState, useEffect } from 'react';
import { generateChefRecipe, searchChefsRecipe, generateRecipeImage, adjustRecipe, generateRecipeVideo } from '../services/geminiService';
import { saveRecipeToBook, addToShoppingList, getUserProfile } from '../services/storageService';
import { LoadingState, RecipeMetrics } from '../types';
import {
  ChevronLeft,
  Target,
  Zap,
  RotateCcw,
  Minus,
  Plus,
  User,
  Leaf,
  Globe,
  Clock,
  Layers,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  Book,
  GraduationCap,
  Award,
  Crown,
  ShoppingCart,
  Square,
  CheckSquare,
  ArrowRight,
  XCircle,
  Snowflake,
  Play,
  ArrowLeft,
  Share2,
  Wifi,
  Radio,
  Cast,
  Activity,
  Smile,
  Droplets,
  Wand2,
  ChevronRight,
  Heart,
  Moon,
  Wheat,
  Milk,
  Sun,
  Flame,
  Coffee,
  Utensils,
  Star,
  Video
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  GourmetBook,
  PremiumChefHat,
  PremiumCake,
  PremiumSearch,
  PremiumCheck,
  PremiumTimer,
  PremiumSparkles,
  PremiumEuro,
  PremiumMedal,
  PremiumUtensils,
  WickerBasket
} from './Icons';

interface RecipeCreatorProps {
    persistentState: {
        text: string;
        metrics: RecipeMetrics | null;
        utensils: string[];
        ingredients: string[];
        ingredientsWithQuantities?: string[];
        steps?: string[];
        image: string | null;
        storageAdvice?: string;
    } | null;
    setPersistentState: (data: any) => void;
}

const RecipeCreator: React.FC<RecipeCreatorProps> = ({ persistentState, setPersistentState }) => {
  const [mode, setMode] = useState<'create' | 'search'>('create');
  const [chefMode, setChefMode] = useState<'cuisine' | 'patisserie'>('cuisine');

  const [recipeCost, setRecipeCost] = useState<'authentic' | 'budget' | null>(null);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert' | null>(null);

  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('Classique (Aucun)');
  const [mealTime, setMealTime] = useState('Déjeuner / Dîner');
  const [cuisineStyle, setCuisineStyle] = useState('Tradition Française');
  const [isBatchCooking, setIsBatchCooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'economical' | 'authentic'>('economical');
  const [people, setPeople] = useState(2);

  // Local state only for temporary interactions (selection, loading, saving feedback)
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<LoadingState>('idle');
  const [loadingStep, setLoadingStep] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Smart Adjust State
  const [adjusting, setAdjusting] = useState<string | null>(null);

  // Video Generation State (Veo)
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generatingVideo, setGeneratingVideo] = useState(false);

  // --- STATE POUR LE MODE CUISINE ---
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [cookingSteps, setCookingSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Load persistent state if exists
  useEffect(() => {
    if (persistentState) {
        // If we have persistent data, we are in "result" mode implicitly if text is present
        // However, the UI state management below relies on checking 'status'.
        // Let's assume if persistentState is populated, we are in success state?
        // Or we just use persistentState to render the result view if available.
    }
  }, [persistentState]);

  const handleGenerate = async () => {
    setStatus('loading');
    setLoadingStep('Analyses des saveurs...');
    try {
        const result = await generateChefRecipe(
            ingredients,
            people,
            dietary,
            mealTime,
            cuisineStyle,
            isBatchCooking,
            chefMode,
            recipeCost || 'authentic',
            difficulty || 'intermediate'
        );

        // Attempt image generation
        setLoadingStep('Dressage photographique...');
        let imageUrl = null;
        try {
             // Extract title from markdown usually # Title
             const titleMatch = result.text.match(/^#\s+(.+)$/m);
             const title = titleMatch ? titleMatch[1] : 'Plat gastronomique';
             imageUrl = await generateRecipeImage(title, cuisineStyle);
        } catch (e) {
            console.error("Image generation failed", e);
        }

        const newState = {
            text: result.text,
            metrics: result.metrics || null,
            utensils: result.utensils || [],
            ingredients: result.ingredients || [],
            ingredientsWithQuantities: result.ingredientsWithQuantities || [],
            steps: result.steps || [],
            storageAdvice: result.storageAdvice,
            image: imageUrl
        };
        setPersistentState(newState);
        setStatus('success');
    } catch (e) {
        console.error(e);
        setStatus('error');
    }
  };

  const handleSearch = async () => {
      setStatus('loading');
      setLoadingStep('Recherche dans les carnets...');
      try {
          const result = await searchChefsRecipe(searchQuery, people, searchType);
          
          let imageUrl = null;
          try {
                const titleMatch = result.text.match(/^#\s+(.+)$/m);
                const title = titleMatch ? titleMatch[1] : searchQuery;
                imageUrl = await generateRecipeImage(title, 'Gastronomique');
          } catch (e) { console.error(e); }

          const newState = {
            text: result.text,
            metrics: result.metrics || null,
            utensils: result.utensils || [],
            ingredients: result.ingredients || [],
            ingredientsWithQuantities: result.ingredientsWithQuantities || [],
            steps: result.steps || [],
            storageAdvice: result.storageAdvice,
            image: imageUrl
          };
          setPersistentState(newState);
          setStatus('success');
      } catch (e) {
          console.error(e);
          setStatus('error');
      }
  };

  const handleSave = async () => {
      if (!persistentState) return;
      const titleMatch = persistentState.text.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : "Recette du Chef";
      
      await saveRecipeToBook({
          id: Date.now().toString(),
          title,
          markdownContent: persistentState.text,
          date: new Date().toLocaleDateString(),
          metrics: persistentState.metrics || undefined,
          image: persistentState.image || undefined,
          utensils: persistentState.utensils,
          ingredients: persistentState.ingredients,
          ingredientsWithQuantities: persistentState.ingredientsWithQuantities,
          steps: persistentState.steps,
          storageAdvice: persistentState.storageAdvice
      });
      setIsSaved(true);
  };

  const handleSmartAdjust = async (type: string) => {
      if (!persistentState) return;
      setAdjusting(type);
      try {
          const result = await adjustRecipe(persistentState.text, type);
          setPersistentState({
              ...persistentState,
              text: result.text,
              metrics: result.metrics,
              ingredients: result.ingredients,
              ingredientsWithQuantities: result.ingredientsWithQuantities,
              steps: result.steps,
              storageAdvice: result.storageAdvice
          });
      } catch (e) {
          console.error(e);
      } finally {
          setAdjusting(null);
      }
  };

  const handleGenerateVideo = async () => {
      if (!persistentState) return;
      // Check for API Key first (UI usually handles this via window.aistudio check, but logic here calls service)
      setGeneratingVideo(true);
      try {
          const titleMatch = persistentState.text.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1] : "Plat gastronomique";
          const url = await generateRecipeVideo(title, cuisineStyle);
          setVideoUrl(url);
      } catch(e) {
          console.error("Video generation error", e);
          alert("Erreur lors de la génération vidéo. Vérifiez votre clé API.");
      } finally {
          setGeneratingVideo(false);
      }
  };

  const startCooking = () => {
      if (persistentState?.steps && persistentState.steps.length > 0) {
          setCookingSteps(persistentState.steps);
          setIsCookingMode(true);
          setCurrentStepIndex(0);
      } else {
          alert("Pas d'étapes interactives disponibles pour cette recette.");
      }
  };

  // Render logic...
  // Needs to handle input forms (create/search) and result view.

  if (persistentState && (status === 'success' || persistentState.text)) {
      // RESULT VIEW
      if (isCookingMode) {
          return (
              <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
                  {/* COOKING MODE UI */}
                  <div className="p-4 flex justify-between items-center border-b border-gray-800">
                      <button onClick={() => setIsCookingMode(false)} className="text-gray-400"><XCircle /></button>
                      <h2 className="font-display text-xl">Mode Cuisine</h2>
                      <div className="w-8"></div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <div className="mb-6">
                        <span className="text-6xl font-display text-green-500">{currentStepIndex + 1}</span>
                        <span className="text-2xl text-gray-500">/{cookingSteps.length}</span>
                      </div>
                      <p className="text-2xl font-medium leading-relaxed max-w-2xl">
                        {cookingSteps[currentStepIndex]}
                      </p>
                  </div>
                  <div className="p-6 flex justify-between gap-4">
                      <button 
                        onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                        disabled={currentStepIndex === 0}
                        className="flex-1 py-4 bg-gray-800 rounded-xl disabled:opacity-50"
                      >Précédent</button>
                      <button 
                        onClick={() => setCurrentStepIndex(Math.min(cookingSteps.length - 1, currentStepIndex + 1))}
                        disabled={currentStepIndex === cookingSteps.length - 1}
                        className="flex-1 py-4 bg-green-600 rounded-xl disabled:opacity-50 font-bold"
                      >Suivant</button>
                  </div>
              </div>
          );
      }

      return (
          <div className="min-h-screen pb-32 bg-black text-white">
              {/* Result UI with Image, Markdown, Metrics, Actions */}
              <div className="relative h-64 md:h-80 w-full">
                  {persistentState.image ? (
                      <img src={persistentState.image} className="w-full h-full object-cover" alt="Recette" />
                  ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700">
                          <PremiumChefHat size={64} />
                      </div>
                  )}
                  <button onClick={() => { setPersistentState(null); setStatus('idle'); }} className="absolute top-4 left-4 bg-black/50 p-2 rounded-full text-white backdrop-blur-md">
                      <ArrowLeft />
                  </button>
              </div>
              
              <div className="px-6 py-6 max-w-4xl mx-auto -mt-10 relative z-10 bg-[#121212] rounded-t-[2rem] border-t border-white/10">
                  {/* Actions Bar */}
                  <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                      <button onClick={handleSave} disabled={isSaved} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wide whitespace-nowrap ${isSaved ? 'bg-green-900/30 border-green-500 text-green-400' : 'border-white/20 text-white'}`}>
                          {isSaved ? <Check size={14} /> : <Book size={14} />} {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
                      </button>
                      <button onClick={startCooking} className="flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/50 bg-orange-900/20 text-orange-400 text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                          <Play size={14} /> Cuisiner
                      </button>
                      <button onClick={() => { addToShoppingList(persistentState.ingredients); setIsAddedToCart(true); }} className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/50 bg-blue-900/20 text-blue-400 text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                          {isAddedToCart ? <Check size={14} /> : <ShoppingCart size={14} />} Liste
                      </button>
                  </div>

                  {/* Smart Adjust */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-3 text-purple-300 text-xs font-bold uppercase tracking-widest">
                          <Wand2 size={14} /> Adaptation Intelligente
                      </div>
                      <div className="flex flex-wrap gap-2">
                          {["Réduire le sel", "Augmenter les protéines", "Passer au végétal", "Adapter aux enfants"].map(adj => (
                              <button 
                                key={adj}
                                onClick={() => handleSmartAdjust(adj)}
                                disabled={!!adjusting}
                                className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-[10px] text-gray-300 hover:bg-white/10 transition-colors"
                              >
                                  {adjusting === adj ? <Loader2 size={12} className="animate-spin"/> : adj}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Veo Video Generation */}
                  <div className="mb-6">
                      {!videoUrl ? (
                          <button 
                            onClick={handleGenerateVideo}
                            disabled={generatingVideo}
                            className="w-full py-3 rounded-xl border border-pink-500/30 bg-pink-900/10 text-pink-300 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-pink-900/20"
                          >
                             {generatingVideo ? <Loader2 className="animate-spin" /> : <Video size={16} />} 
                             Générer une vidéo (Veo)
                          </button>
                      ) : (
                          <div className="w-full rounded-xl overflow-hidden border border-white/10 relative">
                              <video src={videoUrl} controls className="w-full aspect-[9/16] object-cover" />
                              <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white">Généré par Veo</div>
                          </div>
                      )}
                  </div>

                  {/* Content */}
                  <div className="markdown-prose prose-invert text-gray-300 leading-relaxed">
                      <ReactMarkdown>{persistentState.text}</ReactMarkdown>
                  </div>
              </div>
          </div>
      );
  }

  // INPUT FORM (CREATE/SEARCH)
  return (
    <div className="min-h-screen pb-32 bg-black text-white px-4 pt-6">
        <header className="mb-8 text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-900 mb-4 shadow-lg shadow-green-900/30">
                 <PremiumChefHat size={32} className="text-white" />
             </div>
             <h1 className="text-4xl font-display text-white mb-2">Atelier du Chef</h1>
             <div className="flex justify-center gap-4 mt-6">
                 <button 
                    onClick={() => setMode('create')}
                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${mode === 'create' ? 'bg-green-600 text-white shadow-lg' : 'bg-[#1a1a1a] text-gray-500 border border-white/5'}`}
                 >
                     Création
                 </button>
                 <button 
                    onClick={() => setMode('search')}
                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${mode === 'search' ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#1a1a1a] text-gray-500 border border-white/5'}`}
                 >
                     Recherche
                 </button>
             </div>
        </header>

        <div className="max-w-xl mx-auto bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-2xl">
            {mode === 'create' ? (
                <div className="space-y-6">
                    {/* Ingredients Input */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-widest mb-3">
                            <Leaf size={14} /> Vos Ingrédients
                        </label>
                        <textarea 
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="Ex: Poulet, Crème, Champignons..."
                            className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-green-500/50 outline-none h-24 resize-none transition-colors"
                        />
                    </div>

                    {/* People & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Couverts</label>
                            <div className="flex items-center bg-[#1a1a1a] rounded-xl border border-white/10 px-3 py-2">
                                <User size={16} className="text-gray-400 mr-2"/>
                                <select value={people} onChange={(e) => setPeople(parseInt(e.target.value))} className="bg-transparent text-white w-full outline-none">
                                    {[1,2,3,4,5,6,8,10,12].map(n => <option key={n} value={n}>{n} pers.</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Moment</label>
                            <div className="flex items-center bg-[#1a1a1a] rounded-xl border border-white/10 px-3 py-2">
                                <Clock size={16} className="text-gray-400 mr-2"/>
                                <select value={mealTime} onChange={(e) => setMealTime(e.target.value)} className="bg-transparent text-white w-full outline-none">
                                    <option>Déjeuner / Dîner</option>
                                    <option>Petit-Déjeuner</option>
                                    <option>Goûter</option>
                                    <option>Brunch</option>
                                    <option>Apéritif</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Options Toggles */}
                    <div className="space-y-3 pt-2">
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                             {['Authentique', 'Budget'].map(c => (
                                 <button 
                                    key={c} 
                                    onClick={() => setRecipeCost(c === 'Budget' ? 'budget' : 'authentic')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${
                                        (recipeCost === 'budget' && c === 'Budget') || (recipeCost !== 'budget' && c === 'Authentique')
                                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' 
                                        : 'bg-[#1a1a1a] border-white/5 text-gray-500'
                                    }`}
                                 >
                                     {c}
                                 </button>
                             ))}
                        </div>
                         <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                             {['Débutant', 'Intermédiaire', 'Expert'].map(l => (
                                 <button 
                                    key={l} 
                                    onClick={() => setDifficulty(l === 'Débutant' ? 'beginner' : l === 'Expert' ? 'expert' : 'intermediate')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${
                                        (difficulty === 'beginner' && l === 'Débutant') || (difficulty === 'expert' && l === 'Expert') || (difficulty === 'intermediate' && l === 'Intermédiaire')
                                        ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
                                        : 'bg-[#1a1a1a] border-white/5 text-gray-500'
                                    }`}
                                 >
                                     {l}
                                 </button>
                             ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={status === 'loading'}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-green-800 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-green-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Créer la Recette</>}
                    </button>
                    
                    {status === 'loading' && <p className="text-center text-xs text-green-400 animate-pulse">{loadingStep}</p>}

                </div>
            ) : (
                <div className="space-y-6">
                     <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
                            <Search size={14} /> Recherche
                        </label>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ex: Blanquette de veau, Tiramisu..."
                            className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/50 outline-none transition-colors"
                        />
                    </div>
                    
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={() => setSearchType('authentic')}
                            className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all ${searchType === 'authentic' ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'bg-[#1a1a1a] border-white/5 text-gray-500'}`}
                        >
                            Gastronomique
                        </button>
                        <button 
                            onClick={() => setSearchType('economical')}
                            className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all ${searchType === 'economical' ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-[#1a1a1a] border-white/5 text-gray-500'}`}
                        >
                            Économique
                        </button>
                    </div>

                    <button 
                        onClick={handleSearch}
                        disabled={status === 'loading' || !searchQuery}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-blue-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
                    >
                         {status === 'loading' ? <Loader2 className="animate-spin" /> : <><Search size={18} /> Rechercher</>}
                    </button>
                    
                    {status === 'loading' && <p className="text-center text-xs text-blue-400 animate-pulse">{loadingStep}</p>}
                </div>
            )}
        </div>
    </div>
  );
};

export default RecipeCreator;