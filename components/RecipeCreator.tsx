
import React, { useState, useEffect } from 'react';
import { generateChefRecipe, searchChefsRecipe, generateRecipeImage, adjustRecipe, generateRecipeVideo } from '../services/geminiService';
import { saveRecipeToBook, addToShoppingList, getUserProfile } from '../services/storageService';
import { LoadingState, RecipeMetrics } from '../types';
import { 
  ChevronLeft, 
  Minus,
  Plus,
  Leaf,
  Globe,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  Book,
  Crown,
  ShoppingCart,
  ArrowRight,
  XCircle,
  Play,
  Share2,
  Wifi,
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
  Video,
  Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  PremiumChefHat, 
  PremiumCake, 
  PremiumEuro, 
  PremiumMedal, 
  PremiumUtensils
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
  
  const [recipeCost, setRecipeCost] = useState<'authentic' | 'budget'>('authentic');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');
  
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('Classique (Aucun)');
  const [mealTime, setMealTime] = useState('Déjeuner / Dîner');
  const [cuisineStyle, setCuisineStyle] = useState('Tradition Française'); 
  const [isBatchCooking, setIsBatchCooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'economical' | 'authentic'>('economical');
  const [people, setPeople] = useState(2);
  
  // Local state
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<LoadingState>('idle');
  const [loadingStep, setLoadingStep] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [adjusting, setAdjusting] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [cookingSteps, setCookingSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectStep, setConnectStep] = useState<'searching' | 'found' | 'sending' | 'success'>('searching');
  const [localSmartDevices, setLocalSmartDevices] = useState<string[]>([]);

  const isPatissier = chefMode === 'patisserie';
  // Couleur fixe verte pour coller au screenshot "Atelier du Chef"
  const themeColor = '#509f2a'; 

  // Derived state from persistent prop
  const recipe = persistentState?.text || '';
  const metrics = persistentState?.metrics || null;
  const ingredientsList = persistentState?.ingredients || [];
  const ingredientsWithQuantities = persistentState?.ingredientsWithQuantities || [];
  const generatedImage = persistentState?.image || null;
  const storageAdvice = persistentState?.storageAdvice || '';
  const persistentSteps = persistentState?.steps || []; 

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'loading' || adjusting || generatingVideo) {
      const steps = ["Analyse des saveurs...", "Calibration du Chef...", "Création de la recette...", "Dressage virtuel..."];
      let i = 0;
      setLoadingStep(steps[0]);
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setLoadingStep(steps[i]);
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [status, adjusting, generatingVideo]);

  const cleanMarkdown = (text: string) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/__/g, '').replace(/^#+\s/g, '').replace(/^Étape \d+\s*:\s*/i, '').trim();
  };

  useEffect(() => {
    if (persistentSteps && persistentSteps.length > 0) {
        setCookingSteps(persistentSteps.map(cleanMarkdown));
    } else if (recipe) {
        // Fallback parsing logic similar to previous version
        const lines = recipe.split('\n');
        let extractedSteps: string[] = [];
        let inInstructions = false;
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.match(/^##\s*(Instruction|Préparation|Étapes|Recette)/i)) { inInstructions = true; return; }
            if (inInstructions && trimmed.startsWith('## ') && !trimmed.match(/étape/i)) { inInstructions = false; return; }
            if ((inInstructions || extractedSteps.length > 0) && (trimmed.match(/^\d+\./) || trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
                const cleanStep = trimmed.replace(/^(\d+\.|-|\*)\s*/, '');
                if (cleanStep.length > 10) extractedSteps.push(cleanMarkdown(cleanStep));
            }
        });
        setCookingSteps(extractedSteps);
    }
  }, [recipe, persistentSteps]);

  const handleGenerate = async () => {
    if (mode === 'create' && !ingredients.trim()) return;
    if (mode === 'search' && !searchQuery.trim()) return;
    
    setStatus('loading');
    setPersistentState(null); 
    setVideoUrl(null); 
    
    try {
      let result;
      if (mode === 'create') {
        result = await generateChefRecipe(
            ingredients, people, dietary, mealTime, cuisineStyle, isBatchCooking, chefMode, recipeCost, difficulty, localSmartDevices
        );
      } else {
        result = await searchChefsRecipe(searchQuery, people, searchType);
      }
      
      const titleMatch = result.text.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Création du Chef';
      const img = await generateRecipeImage(title, `Professional food photography, ${cuisineStyle}`);
      
      setPersistentState({
          text: result.text,
          metrics: result.metrics || null,
          utensils: result.utensils || [],
          ingredients: result.ingredients || [],
          ingredientsWithQuantities: result.ingredientsWithQuantities || [],
          steps: result.steps || [], 
          storageAdvice: result.storageAdvice || '',
          image: img
      });
      setStatus('success');
    } catch (e: any) {
      console.error(e);
      setStatus('error');
    }
  };

  const handleGenerateVideo = async () => {
      const titleMatch = recipe.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Recette Gourmande';
      setGeneratingVideo(true);
      try {
          // @ts-ignore
          if (window.aistudio && window.aistudio.hasSelectedApiKey) {
               // @ts-ignore
              const hasKey = await window.aistudio.hasSelectedApiKey();
               // @ts-ignore
              if (!hasKey) await window.aistudio.openSelectKey();
          }
          const video = await generateRecipeVideo(title, cuisineStyle);
          setVideoUrl(video);
      } catch (e) {
          console.error("Video failed", e);
      } finally {
          setGeneratingVideo(false);
      }
  };

  const handleClearRecipe = () => {
      setPersistentState(null);
      setIngredients('');
      setSearchQuery('');
      setVideoUrl(null);
  };

  const handleSaveToBook = async () => {
    if (!recipe) return;
    const titleMatch = recipe.match(/^#\s+(.+)$/m);
    await saveRecipeToBook({
      id: Date.now().toString(),
      title: titleMatch ? titleMatch[1] : "Nouvelle Recette",
      markdownContent: recipe,
      date: new Date().toLocaleDateString('fr-FR'),
      metrics: metrics || undefined,
      image: generatedImage || undefined,
      utensils: persistentState?.utensils,
      ingredients: ingredientsList,
      ingredientsWithQuantities: ingredientsWithQuantities,
      steps: persistentSteps,
      storageAdvice: storageAdvice
    });
    setIsSaved(true);
  };

  const handleAdjustRecipe = async (type: string) => {
      setAdjusting(type);
      try {
          const result = await adjustRecipe(recipe, type);
          setPersistentState({ ...persistentState, text: result.text, steps: result.steps });
      } finally {
          setAdjusting(null);
      }
  };

  const VisualSelector = ({ label, icon: Icon, value, onChange, options }: any) => (
    <div className="mb-6">
        <label className="flex items-center gap-2 text-xs font-bold text-[#509f2a] uppercase tracking-widest mb-3">
            <Icon size={12} /> {label}
        </label>
        <div className="flex overflow-x-auto gap-3 pb-2 -mx-2 px-2 no-scrollbar snap-x">
            {options.map((option: string) => (
                <button
                    key={option}
                    onClick={() => onChange(option)}
                    className={`flex-shrink-0 snap-center px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all ${
                        value === option 
                        ? 'bg-[#509f2a] text-white border-[#509f2a]' 
                        : 'bg-[#151515] text-gray-400 border-white/5 hover:border-white/20'
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
  );

  // --- MODE CUISINE (FULL SCREEN) ---
  if (isCookingMode) {
      return (
          <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col font-sans">
              <div className="px-6 py-6 flex items-center justify-between bg-black/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
                  <button onClick={() => setIsCookingMode(false)} className="p-2 bg-white/10 rounded-full"><XCircle size={24} /></button>
                  <span className="font-display text-xl">Étape {currentStepIndex + 1} / {cookingSteps.length}</span>
                  <div className="w-10"></div>
              </div>
              <div className="h-1 w-full bg-[#1a1a1a]"><div className="h-full bg-[#509f2a] transition-all duration-500" style={{ width: `${((currentStepIndex + 1) / cookingSteps.length) * 100}%` }}></div></div>
              <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                  <p className="text-2xl md:text-3xl font-medium text-center leading-relaxed">{cookingSteps[currentStepIndex]}</p>
              </div>
              <div className="p-6 bg-black/90 border-t border-white/10 flex gap-4">
                  <button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} className="flex-1 py-4 bg-[#1a1a1a] rounded-xl font-bold uppercase disabled:opacity-50">Précédent</button>
                  <button onClick={() => currentStepIndex < cookingSteps.length - 1 ? setCurrentStepIndex(currentStepIndex + 1) : setIsCookingMode(false)} className="flex-[2] py-4 bg-[#509f2a] text-white rounded-xl font-bold uppercase">
                      {currentStepIndex < cookingSteps.length - 1 ? 'Suivant' : 'Terminer'}
                  </button>
              </div>
          </div>
      );
  }

  // --- RESULT VIEW ---
  if (recipe) {
      return (
        <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
             {(adjusting || generatingVideo) && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                        <Wand2 size={48} className="text-[#509f2a] animate-bounce mx-auto mb-4" />
                        <h3 className="text-xl font-display text-white mb-2">{generatingVideo ? "Studio Vidéo..." : "Ajustement..."}</h3>
                        <p className="text-sm text-gray-400 animate-pulse">{loadingStep}</p>
                    </div>
                </div>
            )}

            {/* HEADER IMAGE / VIDEO */}
            <div className="w-full h-[50vh] relative">
                {videoUrl ? (
                    <div className="w-full h-full bg-black flex items-center justify-center relative">
                        <video src={videoUrl} controls autoPlay loop className="h-full w-auto max-w-full" />
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase animate-pulse">Veo Video</div>
                    </div>
                ) : generatedImage ? (
                    <img src={generatedImage} className="w-full h-full object-cover" alt="Plat" />
                ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center"><PremiumChefHat size={64} className="opacity-20 text-white" /></div>
                )}
                {!videoUrl && <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]"></div>}
                
                <button onClick={handleClearRecipe} className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-full text-white border border-white/10 backdrop-blur-md transition-all shadow-lg">
                      <XCircle size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Fermer</span>
                </button>

                {!videoUrl && (
                    <button onClick={handleGenerateVideo} className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg">
                        <Video size={16} className="text-red-500"/> GÉNÉRER LA VIDÉO
                    </button>
                )}
            </div>

            <div className="relative z-10 -mt-20 px-4 max-w-4xl mx-auto">
                <div className="bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-2xl">
                    <h1 className="text-3xl font-display text-white mb-6 text-center">{recipe.match(/^#\s+(.+)$/m)?.[1] || 'Recette du Chef'}</h1>
                    
                    {/* Actions Row */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <button onClick={handleSaveToBook} disabled={isSaved} className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold uppercase text-xs flex items-center justify-center gap-2 ${isSaved ? 'bg-[#1a1a1a] text-green-500' : 'bg-[#509f2a] text-white'}`}>
                            {isSaved ? <Check size={16}/> : <Book size={16}/>} {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
                        </button>
                        <button onClick={() => setIsCookingMode(true)} className="flex-1 min-w-[120px] py-3 rounded-xl bg-white text-black font-bold uppercase text-xs flex items-center justify-center gap-2">
                            <Play size={16}/> Cuisiner
                        </button>
                        <button onClick={() => handleAdjustRecipe('Revisiter')} className="flex-1 min-w-[120px] py-3 rounded-xl bg-purple-900/30 text-purple-300 border border-purple-500/30 font-bold uppercase text-xs flex items-center justify-center gap-2">
                            <Wand2 size={16}/> Revisiter
                        </button>
                    </div>

                    {/* Markdown Content */}
                    <div className="markdown-prose prose-invert text-gray-300 leading-relaxed">
                        <ReactMarkdown components={{ h1: () => null, h2: ({node, ...props}) => <h2 className="text-lg font-bold text-[#509f2a] mt-6 mb-3 uppercase tracking-widest border-b border-white/10 pb-2" {...props}/> }}>
                            {recipe}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- INPUT SCREEN (RESTORED DESIGN) ---
  return (
    <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
        
        {/* Header - Identique Capture */}
        <div className="text-center pt-8 pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a4a2a] shadow-[0_0_30px_rgba(80,159,42,0.3)] mb-4 border border-[#509f2a]/30">
                 <PremiumChefHat size={32} className="text-[#509f2a]" />
            </div>
            <h1 className="text-4xl font-display text-white mb-1">Atelier du Chef</h1>
            <p className="text-[#509f2a] text-xs font-bold uppercase tracking-widest">Création Sur-Mesure</p>
        </div>

        {/* Tabs - Identique Capture */}
        <div className="flex justify-center gap-4 mb-8 px-6">
            <button 
                onClick={() => setMode('create')}
                className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${mode === 'create' ? 'bg-[#509f2a] text-white shadow-lg shadow-green-900/50' : 'bg-[#1a1a1a] text-gray-500 border border-white/10'}`}
            >
                CRÉATION
            </button>
            <button 
                onClick={() => setMode('search')}
                className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${mode === 'search' ? 'bg-[#509f2a] text-white shadow-lg shadow-green-900/50' : 'bg-[#1a1a1a] text-gray-500 border border-white/10'}`}
            >
                RECHERCHE
            </button>
        </div>

        {/* Main Card - Identique Capture */}
        <div className="max-w-xl mx-auto px-6">
             <div className="bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-2xl relative">
                 
                 {/* Ingrédients Input */}
                 <div className="mb-6">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#509f2a] uppercase tracking-widest mb-3">
                        <Leaf size={12} /> {mode === 'create' ? "VOS INGRÉDIENTS" : "VOTRE RECHERCHE"}
                    </label>
                    <textarea 
                        value={mode === 'create' ? ingredients : searchQuery}
                        onChange={(e) => mode === 'create' ? setIngredients(e.target.value) : setSearchQuery(e.target.value)}
                        placeholder={mode === 'create' ? "Ex: Poulet, Crème, Champignons..." : "Ex: Blanquette de veau..."}
                        className="w-full h-32 bg-[#151515] text-white px-4 py-4 rounded-xl border border-white/10 focus:border-[#509f2a] outline-none transition-colors resize-none placeholder:text-gray-600 text-sm"
                    />
                 </div>

                 {/* Row: Couverts & Mode */}
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Couverts</label>
                        <div className="flex items-center justify-between bg-[#151515] rounded-xl border border-white/10 px-3 py-3">
                            <button onClick={() => setPeople(Math.max(1, people - 1))} className="text-gray-500 hover:text-white"><Minus size={16}/></button>
                            <span className="font-bold text-sm">{people} pers.</span>
                            <button onClick={() => setPeople(people + 1)} className="text-gray-500 hover:text-white"><Plus size={16}/></button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Mode</label>
                        <button 
                            onClick={() => setChefMode(chefMode === 'cuisine' ? 'patisserie' : 'cuisine')}
                            className="w-full flex items-center justify-center gap-2 bg-[#151515] rounded-xl border border-white/10 px-3 py-3 font-bold text-sm text-white hover:bg-[#202020]"
                        >
                            {chefMode === 'cuisine' ? <Search size={14}/> : <PremiumCake size={14}/>}
                            {chefMode === 'cuisine' ? 'Cuisine' : 'Pâtisserie'}
                        </button>
                    </div>
                 </div>

                 {/* Difficulty & Budget */}
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block"><Zap size={10} className="inline mr-1"/> Difficulté</label>
                        <select 
                            value={difficulty} 
                            onChange={(e) => setDifficulty(e.target.value as any)}
                            className="w-full bg-[#151515] text-white text-xs font-bold uppercase py-3 px-3 rounded-xl border border-white/10 outline-none appearance-none"
                        >
                            <option value="beginner">DÉBUTANT</option>
                            <option value="intermediate">INTERMÉDIAIRE</option>
                            <option value="expert">EXPERT</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block"><PremiumEuro size={10} className="inline mr-1"/> Budget</label>
                        <button 
                            onClick={() => setRecipeCost(recipeCost === 'authentic' ? 'budget' : 'authentic')}
                            className="w-full bg-[#151515] rounded-xl border border-white/10 py-3 text-xs font-bold uppercase text-white hover:bg-[#202020]"
                        >
                            {recipeCost === 'authentic' ? 'AUTHENTIQUE' : 'BUDGET'}
                        </button>
                    </div>
                 </div>

                 {/* Régimes (Réintégrés ici comme demandé) */}
                 <VisualSelector 
                    label="Régimes Spécifiques"
                    icon={Leaf}
                    value={dietary}
                    onChange={setDietary}
                    options={["Classique (Aucun)", "Végétarien", "Vegan", "Halal", "Casher", "Sans Gluten", "Sans Lactose", "Régime Crétois", "Sportif (Protéiné)"]}
                 />

                 <button 
                    onClick={handleGenerate}
                    disabled={status === 'loading' || (mode === 'create' && !ingredients)}
                    className="w-full py-4 rounded-xl bg-[#509f2a] hover:bg-[#408020] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-green-900/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {status === 'loading' ? 'INVOCATION...' : 'INVOQUER LE CHEF >'}
                 </button>

             </div>
         </div>
    </div>
  );
};

export default RecipeCreator;
