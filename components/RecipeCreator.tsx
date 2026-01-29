
import React, { useState, useEffect } from 'react';
import { generateChefRecipe, searchChefsRecipe, generateRecipeImage } from '../services/geminiService';
import { saveRecipeToBook, addToShoppingList } from '../services/storageService';
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
  Volume2,
  StopCircle,
  Trash2
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
  PremiumUtensils 
} from './Icons';

interface RecipeCreatorProps {
    persistentState: {
        text: string;
        metrics: RecipeMetrics | null;
        utensils: string[];
        ingredients: string[];
        ingredientsWithQuantities?: string[];
        steps?: string[]; // NOUVEAU
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

  // --- STATE POUR LE MODE CUISINE ---
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [cookingSteps, setCookingSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false); // État pour la synthèse vocale

  const isPatissier = chefMode === 'patisserie';
  const themeColor = isPatissier ? '#ec4899' : '#509f2a'; 
  const themeGradient = isPatissier ? 'from-pink-600 to-pink-900' : 'from-[#509f2a] to-[#1a4a2a]';
  const themeShadow = isPatissier ? 'shadow-pink-900/40' : 'shadow-green-900/40';

  // Derived state from persistent prop
  const recipe = persistentState?.text || '';
  const metrics = persistentState?.metrics || null;
  const ingredientsList = persistentState?.ingredients || [];
  const ingredientsWithQuantities = persistentState?.ingredientsWithQuantities || [];
  const utensilsList = persistentState?.utensils || [];
  const generatedImage = persistentState?.image || null;
  const storageAdvice = persistentState?.storageAdvice || '';
  const persistentSteps = persistentState?.steps || []; // Récupération des étapes IA

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'loading') {
      const steps = isPatissier 
        ? ["Pesée au gramme près...", "Tamisage des poudres...", "Émulsion de la ganache...", "Montage délicat...", "Glaçage miroir..."]
        : ["Mise en place...", "Maîtrise du feu...", "Réduction des sucs...", "Assaisonnement...", "Dressage du chef..."];
      let i = 0;
      setLoadingStep(steps[0]);
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setLoadingStep(steps[i]);
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [status, isPatissier]);

  // Parsing des étapes quand une recette est chargée
  useEffect(() => {
    // ... (Code parsing inchangé)
    if (persistentSteps && persistentSteps.length > 0) {
        setCookingSteps(persistentSteps.map(cleanMarkdown));
    } else if (recipe) {
        // Fallback parsing (inchangé)
        const lines = recipe.split('\n');
        let extractedSteps: string[] = [];
        let inInstructions = false;
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.match(/^##\s*(Instruction|Préparation|Étapes|Recette)/i)) { inInstructions = true; return; }
            if (inInstructions && trimmed.startsWith('## ') && !trimmed.match(/étape/i)) { inInstructions = false; return; }
            if ((inInstructions || extractedSteps.length > 0) && (trimmed.match(/^\d+\./) || trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
                const cleanStep = trimmed.replace(/^(\d+\.|-|\*)\s*/, '');
                if (cleanStep.length > 10) { extractedSteps.push(cleanMarkdown(cleanStep)); }
            }
        });
        if (extractedSteps.length <= 1) {
            const instructionPart = recipe.split(/##\s*(Instruction|Préparation|Étapes|Recette)/i)[2] || recipe;
            const rawSteps = instructionPart.split(/\n\n+/).map(s => s.trim()).filter(s => s.length > 10 && !s.startsWith('#') && !s.includes('Ingrédients'));
            if (rawSteps.length <= 1 && rawSteps[0]) {
                 const sentences = rawSteps[0].split('. ').filter(s => s.length > 10).map(s => s.trim() + '.');
                 extractedSteps = sentences.map(cleanMarkdown);
            } else {
                 extractedSteps = rawSteps.map(cleanMarkdown);
            }
        }
        setCookingSteps(extractedSteps.filter(s => s && s.length > 5));
    }
  }, [recipe, persistentSteps]);

  // Cleanup speech on unmount
  useEffect(() => {
      return () => {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      };
  }, []);

  // Fonction utilitaire pour nettoyer le markdown
  const cleanMarkdown = (text: string) => {
    if (!text) return "";
    return text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/__/g, '')
        .replace(/^#+\s/g, '')
        .replace(/^Étape \d+\s*:\s*/i, '')
        .trim();
  };

  const handleGenerate = async () => {
    if (mode === 'create' && !ingredients.trim()) return;
    if (mode === 'search' && !searchQuery.trim()) return;
    
    setStatus('loading');
    setPersistentState(null);
    setIsAddedToCart(false);
    
    try {
      let result;
      if (mode === 'create') {
        result = await generateChefRecipe(
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
      } else {
        result = await searchChefsRecipe(searchQuery, people, searchType);
      }
      
      const titleMatch = result.text.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Création du Chef';
      const contextString = `Style: ${cuisineStyle}. Type: ${chefMode}. Diet: ${dietary}. Ingredients: ${mode === 'create' ? ingredients : searchQuery}`;
      const img = await generateRecipeImage(title, contextString);
      
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

  const handleClearRecipe = () => {
      if (confirm("Voulez-vous vraiment effacer cette recette et recommencer ?")) {
          setPersistentState(null);
          setIngredients('');
          setSearchQuery('');
          setIsCookingMode(false);
          window.speechSynthesis.cancel();
      }
  };

  const handleSaveToBook = async () => {
    if (!recipe) return;
    
    // LOGIQUE DE DÉTECTION DU TITRE AMÉLIORÉE
    let title = "Recette du Chef";
    const h1Match = recipe.match(/^#\s+(.+)$/m);
    const h2Match = recipe.match(/^##\s+(.+)$/m);

    if (h1Match) {
        title = h1Match[1].replace(/\*\*/g, '').trim();
    } else if (h2Match) {
        title = h2Match[1].replace(/\*\*/g, '').trim();
    } else {
        // Fallback ultime : première ligne non vide qui n'est pas une instruction technique
        const cleanLines = recipe.split('\n').map(l => l.trim()).filter(l => l.length > 5 && !l.startsWith('!') && !l.includes('Ingrédient'));
        if (cleanLines.length > 0) {
            title = cleanLines[0].replace(/^[#*-\s]+/, '');
        }
    }

    await saveRecipeToBook({
      id: Date.now().toString(),
      title: title,
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
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleIngredient = (ing: string) => {
      const next = new Set(selectedIngredients);
      if (next.has(ing)) next.delete(ing);
      else next.add(ing);
      setSelectedIngredients(next);
  };

  const toggleAllIngredients = () => {
      if (selectedIngredients.size === ingredientsList.length) {
          setSelectedIngredients(new Set());
      } else {
          setSelectedIngredients(new Set(ingredientsList));
      }
  };

  const handleAddIngredientsToCart = async () => {
      if (selectedIngredients.size === 0) return;
      await addToShoppingList(Array.from(selectedIngredients));
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 3000);
  };

  const startCooking = () => {
      setCurrentStepIndex(0);
      setIsCookingMode(true);
      window.scrollTo(0, 0);
  };

  // Gestion de la voix
  const speakStep = (text: string) => {
      if (!('speechSynthesis' in window)) return;
      
      // Si ça parle déjà, on arrête
      if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          return;
      }

      window.speechSynthesis.cancel(); // Safety clear
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0; 
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
  };

  const changeStep = (newIndex: number) => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentStepIndex(newIndex);
  };

  const CustomSelect = ({ icon: Icon, value, onChange, options }: any) => (
    <div className="relative group">
      <div className="flex items-center justify-between bg-[#151515] hover:bg-[#1a1a1a] text-white px-4 py-4 rounded-xl border border-white/10 focus-within:border-white/30 transition-colors">
        <div className="flex items-center gap-3">
          <Icon size={18} style={{ color: themeColor }} />
          <span className="font-medium text-sm text-gray-200">{value}</span>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </div>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {options.map((opt: string) => <option key={opt} value={opt} className="bg-[#1a1a1a] text-white">{opt}</option>)}
      </select>
    </div>
  );

  // --- RENDU MODE CUISINE IMMERSIF ---
  if (isCookingMode) {
      const currentStepText = cookingSteps[currentStepIndex];
      const progress = cookingSteps.length > 0 ? ((currentStepIndex + 1) / cookingSteps.length) * 100 : 0;
      const isLastStep = currentStepIndex >= cookingSteps.length - 1;

      return (
          <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col font-sans">
              {/* Header Immersif */}
              <div className="px-6 py-6 flex items-center justify-between bg-black/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
                  <button 
                    onClick={() => {
                        window.speechSynthesis.cancel();
                        setIsSpeaking(false);
                        setIsCookingMode(false);
                    }}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                      <XCircle size={24} />
                  </button>
                  <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mode Cuisine</span>
                      <span className="font-display text-xl leading-none mt-1">Étape {currentStepIndex + 1} <span className="text-gray-600 font-sans text-sm">/ {cookingSteps.length}</span></span>
                  </div>
                  <div className="w-10"></div> {/* Spacer pour centrer */}
              </div>

              {/* Barre de progression */}
              <div className="h-1 w-full bg-[#1a1a1a]">
                  <div 
                    className="h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%`, backgroundColor: themeColor }}
                  ></div>
              </div>

              {/* Contenu de l'étape (Centré et Gros) */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto relative">
                  <div className="max-w-2xl w-full animate-slide-up text-center">
                      <p className="text-2xl md:text-4xl font-sans font-medium leading-normal text-gray-100 drop-shadow-lg mb-10">
                        {currentStepText}
                      </p>

                      {/* TTS Button */}
                      <button 
                        onClick={() => speakStep(currentStepText)}
                        className={`mx-auto flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${isSpeaking ? 'bg-white text-black border-white animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                      >
                          {isSpeaking ? <StopCircle size={24} className="fill-current" /> : <Volume2 size={24} />}
                          <span className="text-sm font-bold uppercase tracking-widest">
                             {isSpeaking ? 'Arrêter' : 'Écouter'}
                          </span>
                      </button>
                  </div>
              </div>

              {/* Navigation Footer */}
              <div className="p-6 pb-12 bg-black/90 backdrop-blur-lg border-t border-white/10 safe-pb">
                  <div className="flex gap-4 max-w-md mx-auto">
                      <button 
                        onClick={() => changeStep(Math.max(0, currentStepIndex - 1))}
                        disabled={currentStepIndex === 0}
                        className="flex-1 py-6 rounded-2xl bg-[#1a1a1a] border border-white/10 text-white font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#252525] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <ChevronLeft size={20} /> Précédent
                      </button>

                      {!isLastStep ? (
                          <button 
                            onClick={() => changeStep(currentStepIndex + 1)}
                            className="flex-[2] py-6 rounded-2xl text-white font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
                            style={{ backgroundColor: themeColor, boxShadow: `0 10px 30px -10px ${themeColor}66` }}
                          >
                              Suivant <ArrowRight size={24} />
                          </button>
                      ) : (
                          <button 
                            onClick={() => {
                                window.speechSynthesis.cancel();
                                setIsSpeaking(false);
                                setIsCookingMode(false);
                            }}
                            className="flex-[2] py-6 rounded-2xl bg-white text-black font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-lg hover:bg-gray-200"
                          >
                              <Check size={24} /> Terminer
                          </button>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  // --- RENDU STANDARD ---
  return (
    <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
      
      {!recipe ? (
        /* VUE FORMULAIRE DE CRÉATION */
        <>
            <div className="absolute inset-0 z-0">
                <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-30 fixed"
                alt="Kitchen Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#0a150a]/80 to-black fixed"></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6 pt-10">
                <div className="animate-fade-in flex flex-col items-center">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div 
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full shadow-[0_0_30px_rgba(80,159,42,0.3)] mb-4 border border-white/10 transition-colors duration-500"
                            style={{ backgroundColor: isPatissier ? '#831843' : '#1a4a2a', borderColor: isPatissier ? '#ec4899' : '#509f2a' }}
                        >
                            {isPatissier ? (
                                <PremiumCake size={32} className="text-pink-200" />
                            ) : (
                                <PremiumChefHat size={32} className="text-green-200" />
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display mb-2 drop-shadow-md transition-colors duration-500" style={{ color: themeColor }}>
                            {isPatissier ? "Recette Sucrée" : "Recette Salée"}
                        </h1>
                        <p className="text-gray-400 text-sm font-light tracking-widest uppercase">
                            Cuisine & Improvisation
                        </p>
                    </div>

                    {/* Main Glass Card */}
                    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-1.5 shadow-2xl mb-10">
                        <div className="bg-black/40 rounded-[1.7rem] p-6 border border-white/5">
                            
                            {/* Switch Cuisinier / Pâtissier */}
                            <div className="bg-[#151515] p-1 rounded-xl flex w-full mb-6 border border-white/5">
                                <button 
                                onClick={() => setChefMode('cuisine')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 ${chefMode === 'cuisine' ? 'bg-[#509f2a] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <PremiumChefHat size={16} />
                                    <span className="font-bold text-xs uppercase tracking-wider">Côté Salé</span>
                                </button>
                                <button 
                                onClick={() => setChefMode('patisserie')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 ${chefMode === 'patisserie' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <PremiumCake size={16} />
                                    <span className="font-bold text-xs uppercase tracking-wider">Côté Sucré</span>
                                </button>
                            </div>

                            {/* Mode Toggles (Create / Search) */}
                            <div className="flex justify-center mb-8 border-b border-white/10 pb-4">
                                <div className="flex gap-6">
                                    <button 
                                        onClick={() => setMode('create')}
                                        className={`flex items-center gap-2 pb-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${mode === 'create' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                                    >
                                        <PremiumSparkles size={14} /> Créer
                                    </button>
                                    <button 
                                        onClick={() => setMode('search')}
                                        className={`flex items-center gap-2 pb-2 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${mode === 'search' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                                    >
                                        <PremiumSearch size={14} /> Rechercher
                                    </button>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="mb-8">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3" style={{ color: themeColor }}>
                                    {mode === 'create' ? (isPatissier ? <PremiumCake size={12}/> : <Leaf size={12}/>) : <Search size={12}/>}
                                    {mode === 'create' ? "Vos Ingrédients" : "Votre Recherche"}
                                </label>
                                <textarea 
                                    className="w-full bg-[#151515] text-white px-4 py-4 rounded-xl border border-white/10 focus:border-white/30 focus:ring-0 outline-none transition-colors resize-none placeholder:text-gray-600 text-sm min-h-[100px]"
                                    placeholder={mode === 'create' ? (isPatissier ? "Ex: Farine, oeufs, chocolat..." : "Ex: J'ai du poulet, du riz et...") : "Ex: Blanquette de veau..."}
                                    value={mode === 'create' ? ingredients : searchQuery}
                                    onChange={(e) => mode === 'create' ? setIngredients(e.target.value) : setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Configuration Section */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-2 mb-2 opacity-50">
                                    <User size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Configuration</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <button
                                        onClick={() => setRecipeCost('budget')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${recipeCost === 'budget' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-[#151515] border-white/5 text-gray-400 hover:bg-[#1a1a1a]'}`}
                                    >
                                        <PremiumEuro size={20} className="mb-1" />
                                        <span className="text-[10px] font-bold uppercase">Économique</span>
                                    </button>
                                    <button
                                        onClick={() => setRecipeCost('authentic')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${recipeCost === 'authentic' ? 'bg-[#509f2a]/10 border-[#509f2a] text-[#509f2a]' : 'bg-[#151515] border-white/5 text-gray-400 hover:bg-[#1a1a1a]'}`}
                                    >
                                        <PremiumMedal size={20} className="mb-1" />
                                        <span className="text-[10px] font-bold uppercase">De Qualité</span>
                                    </button>
                                </div>

                                <div className="mb-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block ml-1">Niveau de difficulté</label>
                                    <div className="flex bg-[#151515] rounded-xl p-1 border border-white/5">
                                        <button
                                            onClick={() => setDifficulty('beginner')}
                                            className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 transition-all ${difficulty === 'beginner' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <GraduationCap size={16} />
                                            <span className="text-[9px] font-bold uppercase">Facile</span>
                                        </button>
                                        <button
                                            onClick={() => setDifficulty('intermediate')}
                                            className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 transition-all ${difficulty === 'intermediate' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Award size={16} />
                                            <span className="text-[9px] font-bold uppercase">Moyen</span>
                                        </button>
                                        <button
                                            onClick={() => setDifficulty('expert')}
                                            className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 transition-all ${difficulty === 'expert' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Crown size={16} />
                                            <span className="text-[9px] font-bold uppercase">Expert</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-[#151515] p-2 rounded-xl border border-white/10">
                                    <div className="px-3 text-xs font-bold text-gray-400 uppercase">Convives</div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setPeople(Math.max(1, people - 1))}
                                            className="w-10 h-10 rounded-lg bg-black hover:bg-gray-900 flex items-center justify-center text-white transition-colors border border-white/5"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="text-xl font-display w-8 text-center">{people}</span>
                                        <button 
                                            onClick={() => setPeople(Math.min(20, people + 1))}
                                            className="w-10 h-10 rounded-lg bg-black hover:bg-gray-900 flex items-center justify-center text-white transition-colors border border-white/5"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <CustomSelect 
                                    icon={Leaf}
                                    value={dietary}
                                    onChange={setDietary}
                                    options={["Classique (Aucun)", "Végétarien", "Vegan", "Halal", "Casher", "Sans Gluten", "Sans Lactose", "Régime Crétois", "Sportif (Protéiné)"]}
                                />

                                <CustomSelect 
                                    icon={Globe}
                                    value={cuisineStyle}
                                    onChange={setCuisineStyle}
                                    options={["Tradition Française", "Italie / Pâtes", "Saveurs Asiatiques", "Mexicain / Épicé", "Oriental / Méditerranéen", "Plat du Jour (Bistrot)", "Repas d'Exception", "Street Food / Rapide"]}
                                />

                                <div 
                                    onClick={() => setIsBatchCooking(!isBatchCooking)}
                                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isBatchCooking ? 'bg-[#151515] border-white/30' : 'bg-[#151515] border-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Layers size={18} className={isBatchCooking ? 'text-white' : 'text-gray-500'} />
                                        <span className={`text-sm font-medium ${isBatchCooking ? 'text-white' : 'text-gray-400'}`}>Mode Batch Cooking</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isBatchCooking ? 'bg-[#509f2a] border-[#509f2a]' : 'border-gray-600'}`}>
                                        {isBatchCooking && <Check size={14} className="text-white" />}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={status === 'loading'}
                                className="w-full py-5 rounded-xl text-white font-bold text-sm tracking-widest uppercase shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
                                style={{
                                    background: `linear-gradient(to right, ${isPatissier ? '#db2777' : '#15803d'}, ${isPatissier ? '#831843' : '#14532d'})`,
                                    boxShadow: `0 10px 30px -10px ${isPatissier ? '#db277780' : '#15803d80'}`
                                }}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Target className="animate-spin" /> {loadingStep}
                                    </>
                                ) : (
                                    <>
                                        <Zap size={18} /> Lancer le Chef
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center pb-8 opacity-60">
                         <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                             Propulsé par Google Gemini Pro 1.5
                         </p>
                    </div>

                </div>
            </div>
        </>
      ) : (
        /* VUE RECETTE GÉNÉRÉE */
        <div className="animate-fade-in pb-20">
             
             {/* Header Image Fullscreen with Overlay */}
             <div className="relative h-[50vh] w-full">
                {generatedImage ? (
                    <img src={generatedImage} className="w-full h-full object-cover" alt="Plat généré" />
                ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                        <PremiumChefHat size={64} className="opacity-10 text-white" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
                
                {/* Navbar flottante */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
                    <button 
                        onClick={handleClearRecipe} 
                        className="bg-red-500/80 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-red-600 transition-all border border-red-400/50 flex items-center gap-2 shadow-lg"
                    >
                        <Trash2 size={18} /> <span className="text-xs font-bold uppercase tracking-wide">Effacer</span>
                    </button>
                    <div className="flex gap-3">
                         <button onClick={handleSaveToBook} disabled={isSaved} className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                            {isSaved ? <Check size={16} /> : <Book size={16} />} {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
                         </button>
                    </div>
                </div>

                {/* Title & Metrics Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent pt-32">
                     <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-5xl font-display text-white mb-4 leading-tight drop-shadow-lg">
                            {recipe.match(/^#\s+(.+)$/m)?.[1] || "Recette du Chef"}
                        </h1>
                        
                        {metrics && (
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                    <Clock size={14} className="text-gray-300" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                        {metrics.difficulty}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                    <Target size={14} className="text-gray-300" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                        {metrics.caloriesPerPerson} Kcal
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                    <PremiumEuro size={14} className="text-gray-300" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                        ~{metrics.pricePerPerson}€ / pers
                                    </span>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold border border-white/20 ${metrics.nutriScore === 'A' ? 'bg-[#008148]' : metrics.nutriScore === 'B' ? 'bg-[#8ac53e]' : metrics.nutriScore === 'C' ? 'bg-[#fecb02]' : metrics.nutriScore === 'D' ? 'bg-[#ee8100]' : 'bg-[#e63e11]'}`}>
                                    NUTRI-SCORE {metrics.nutriScore}
                                </div>
                            </div>
                        )}
                     </div>
                </div>
             </div>

             <div className="max-w-4xl mx-auto px-6 -mt-6 relative z-10 space-y-8">
                
                {/* ACTIONS RAPIDES (MODE CUISINE) */}
                <div className="flex gap-4">
                     <button 
                        onClick={startCooking}
                        className="flex-1 py-4 bg-[#509f2a] hover:bg-[#408020] text-white rounded-2xl shadow-lg shadow-green-900/40 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        <Play size={18} fill="currentColor" /> Lancer le Mode Cuisine
                     </button>
                </div>

                {/* STORAGE ADVICE CARD (NEW) */}
                {storageAdvice && (
                    <div className="bg-[#121212] border border-blue-900/30 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Snowflake size={64} />
                        </div>
                        <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                            <Snowflake size={14} /> Conservation & Anti-Gaspi
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {storageAdvice}
                        </p>
                    </div>
                )}

                {/* INGREDIENTS CHECKLIST (SHOPPING MODE) */}
                <div className="bg-[#121212] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display text-2xl text-white flex items-center gap-3">
                            <Leaf size={24} className="text-green-500" /> Ingrédients
                        </h3>
                        <div className="flex gap-2">
                             <button onClick={toggleAllIngredients} className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase">
                                 Tout cocher
                             </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {ingredientsWithQuantities.map((ing, idx) => {
                            // On essaye de matcher avec la liste "panier" pour savoir quoi ajouter
                            // Note: c'est une approximation car ingredientsWithQuantities est plus détaillé
                            const simpleIng = ingredientsList[idx] || ing; 
                            const isSelected = selectedIngredients.has(simpleIng);
                            
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => toggleIngredient(simpleIng)}
                                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${isSelected ? 'bg-green-900/20 border-green-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                >
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                                        {isSelected && <Check size={14} className="text-white" />}
                                    </div>
                                    <span className={`text-sm ${isSelected ? 'text-green-100' : 'text-gray-300'}`}>{ing}</span>
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        onClick={handleAddIngredientsToCart}
                        disabled={selectedIngredients.size === 0 || isAddedToCart}
                        className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${isAddedToCart ? 'bg-gray-800 text-gray-400' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'}`}
                    >
                        {isAddedToCart ? <><CheckSquare size={16}/> Ajouté à la liste</> : <><ShoppingCart size={16}/> Ajouter la sélection à ma liste</>}
                    </button>
                </div>

                {/* USTENSILS */}
                {utensilsList.length > 0 && (
                     <div className="bg-[#121212] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
                            <PremiumUtensils size={20} className="text-gray-400" /> Matériel
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {utensilsList.map((u, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-sm text-gray-300 border border-white/5">
                                    {u}
                                </span>
                            ))}
                        </div>
                     </div>
                )}

                {/* STEPS PREVIEW (READ ONLY) */}
                <div className="bg-[#121212] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                     <h3 className="font-display text-2xl text-white mb-6 flex items-center gap-3">
                        <PremiumChefHat size={24} className="text-orange-500" /> Préparation
                    </h3>
                    
                    {/* On affiche le markdown complet pour la lecture */}
                    <div className="markdown-prose prose-invert text-gray-300 leading-relaxed space-y-4">
                         <ReactMarkdown 
                            components={{
                                h1: ({node, ...props}) => <h1 className="hidden" {...props} />, // On cache le titre H1
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mb-4 mt-8 border-b border-white/10 pb-2 flex items-center gap-2" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-orange-400 font-bold" {...props} />,
                                li: ({node, ...props}) => <li className="flex items-start gap-3 mb-3" {...props}><span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-orange-500"></span><span className="flex-1">{props.children}</span></li>
                            }}
                         >
                            {recipe}
                        </ReactMarkdown>
                    </div>
                </div>

             </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCreator;
