
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
  Snowflake
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
  const [cuisineStyle, setCuisineStyle] = useState('Cuisine Française'); 
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

  const handleGenerate = async () => {
    if (mode === 'create' && !ingredients.trim()) return;
    if (mode === 'search' && !searchQuery.trim()) return;
    
    setStatus('loading');
    setPersistentState(null); // Reset previous recipe
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
      
      // PASSAGE DU CONTEXTE COMPLET À L'IMAGE GENERATOR
      const contextString = `Style: ${cuisineStyle}. Type: ${chefMode}. Diet: ${dietary}. Ingredients: ${mode === 'create' ? ingredients : searchQuery}`;
      const img = await generateRecipeImage(title, contextString);
      
      // Save full result to persistent state
      setPersistentState({
          text: result.text,
          metrics: result.metrics || null,
          utensils: result.utensils || [],
          ingredients: result.ingredients || [],
          ingredientsWithQuantities: result.ingredientsWithQuantities || [],
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
      setPersistentState(null);
      setIngredients('');
      setSearchQuery('');
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

  const CustomSelect = ({ 
    icon: Icon, 
    value, 
    onChange, 
    options 
  }: { 
    icon: any, 
    value: string, 
    onChange: (val: string) => void, 
    options: string[] 
  }) => (
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
        {options.map(opt => <option key={opt} value={opt} className="bg-[#1a1a1a] text-white">{opt}</option>)}
      </select>
    </div>
  );

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
                            La Cuisine du Chef
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
                                    <span className="font-bold text-xs uppercase tracking-wider">Cuisinier</span>
                                </button>
                                <button 
                                onClick={() => setChefMode('patisserie')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 ${chefMode === 'patisserie' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <PremiumCake size={16} />
                                    <span className="font-bold text-xs uppercase tracking-wider">Pâtissier</span>
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
                                        onClick={() => setRecipeCost('authentic')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${recipeCost === 'authentic' ? 'bg-[#509f2a]/10 border-[#509f2a] text-[#509f2a]' : 'bg-[#151515] border-white/5 text-gray-400 hover:bg-[#1a1a1a]'}`}
                                    >
                                        <PremiumMedal size={20} className="mb-1" />
                                        <span className="text-[10px] font-bold uppercase">Authentique</span>
                                    </button>
                                    <button
                                        onClick={() => setRecipeCost('budget')}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${recipeCost === 'budget' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-[#151515] border-white/5 text-gray-400 hover:bg-[#1a1a1a]'}`}
                                    >
                                        <PremiumEuro size={20} className="mb-1" />
                                        <span className="text-[10px] font-bold uppercase">Petit Budget</span>
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
                                    options={["Cuisine Française", "Cuisine Italienne", "Cuisine Asiatique", "Cuisine Mexicaine", "Cuisine Orientale", "Cuisine Bistrot", "Cuisine Gastronomique", "Street Food"]}
                                />

                                <div 
                                    onClick={() => setIsBatchCooking(!isBatchCooking)}
                                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isBatchCooking ? 'bg-[#151515] border-white/30' : 'bg-[#151515] border-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Layers size={18} className={isBatchCooking ? 'text-white' : 'text-gray-500'} />
                                        <span className={`text-sm font-medium ${isBatchCooking ? 'text-white' : 'text-gray-400'}`}>Batch Cooking</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isBatchCooking ? 'bg-white border-white' : 'border-gray-600 bg-transparent'}`}>
                                        {isBatchCooking && <Check size={12} className="text-black" />}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={status === 'loading' || (mode === 'create' ? !ingredients : !searchQuery)}
                                className={`w-full py-5 rounded-xl bg-gradient-to-r ${themeGradient} text-white font-bold text-sm tracking-widest uppercase ${themeShadow} hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none shadow-lg`}
                            >
                                {status === 'loading' ? (
                                    <div className="flex flex-col items-center">
                                        <span className="animate-pulse">{loadingStep}</span>
                                    </div>
                                ) : (
                                    <>
                                    {mode === 'create' ? <Zap size={16} fill="white" /> : <Search size={16} />}
                                    {mode === 'create' ? 'Générer la Recette' : 'Lancer la Recherche'}
                                    </>
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
      ) : (
        /* VUE RECETTE GENEREE (DESIGN AMÉLIORÉ) */
        <div className="animate-fade-in relative bg-[#0a0a0a]">
            
            {/* HERO HEADER IMAGE */}
            <div className="w-full h-[50vh] relative">
                {generatedImage ? (
                    <img src={generatedImage} className="w-full h-full object-cover" alt="Plat" />
                ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                        <PremiumChefHat size={64} className="opacity-20 text-white" />
                    </div>
                )}
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]"></div>
                
                {/* Back / Clear Button */}
                <button 
                    onClick={handleClearRecipe} 
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-full text-white border border-white/10 backdrop-blur-md transition-all shadow-lg"
                >
                      <XCircle size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Fermer / Supprimer</span>
                </button>
            </div>

            {/* CONTENT CARD (FLOATING UP) */}
            <div className="relative z-10 -mt-24 px-4 pb-20 max-w-4xl mx-auto">
                
                {/* Main Recipe Info */}
                <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                    
                    {/* Badge Badges */}
                    <div className="flex justify-center gap-3 mb-6">
                        <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg border border-white/10 flex items-center gap-2" style={{ backgroundColor: themeColor }}>
                            {isPatissier ? <PremiumCake size={12}/> : <PremiumChefHat size={12}/>}
                            {isPatissier ? 'Pâtisserie' : 'Cuisine'}
                        </div>
                        {recipeCost === 'budget' && (
                            <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg border border-white/10 bg-blue-600">
                                <PremiumEuro size={12}/> Eco
                            </div>
                        )}
                        <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg border border-white/10 bg-[#222]">
                            {metrics?.difficulty || "Moyen"}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-display text-white text-center leading-tight mb-8 drop-shadow-lg">
                        {recipe.match(/^#\s+(.+)$/m)?.[1] || 'Recette du Chef'}
                    </h1>

                    {/* Metrics Bar */}
                    {metrics && (
                        <div className="grid grid-cols-4 gap-4 mb-10 py-6 border-y border-white/5">
                             <div className="text-center border-r border-white/10 last:border-0">
                                <div className="text-2xl font-display text-white">{metrics.nutriScore}</div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Nutri</div>
                             </div>
                             <div className="text-center border-r border-white/10 last:border-0">
                                <div className="text-2xl font-display text-white">{metrics.caloriesPerPerson}</div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Kcal</div>
                             </div>
                             <div className="text-center border-r border-white/10 last:border-0">
                                <div className="text-2xl font-display text-white">{metrics.proteins}g</div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Prot.</div>
                             </div>
                             <div className="text-center">
                                <div className="text-2xl font-display text-white">{people}</div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Pers.</div>
                             </div>
                        </div>
                    )}

                    <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                        
                        {/* LEFT COLUMN: SHOPPING LIST WIDGET */}
                        <div className="order-2 md:order-1">
                            {ingredientsList && ingredientsList.length > 0 && (
                                <div className="bg-[#1a1a1a] rounded-2xl border-l-4 overflow-hidden shadow-lg sticky top-6" style={{ borderLeftColor: themeColor }}>
                                    <div className="p-5 border-b border-white/5 bg-white/5">
                                        <h3 className="font-display text-lg text-white flex items-center gap-2">
                                            <ShoppingCart size={18} className="text-white/60" />
                                            Panier Express
                                        </h3>
                                        <p className="text-[10px] text-gray-500 mt-1">Cochez pour ajouter à votre liste de courses.</p>
                                    </div>
                                    
                                    <div className="p-4 space-y-1">
                                        <div className="flex justify-end mb-2">
                                            <button 
                                                onClick={toggleAllIngredients}
                                                className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
                                            >
                                                {selectedIngredients.size === ingredientsList.length ? 'Tout décocher' : 'Tout cocher'}
                                            </button>
                                        </div>

                                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-2 space-y-2">
                                            {ingredientsList.map((ing, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => toggleIngredient(ing)}
                                                    className={`w-full text-left text-sm px-3 py-2.5 rounded-lg transition-all flex items-start gap-3 group ${selectedIngredients.has(ing) ? 'bg-[#509f2a]/20 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                                                >
                                                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedIngredients.has(ing) ? 'bg-[#509f2a] border-[#509f2a]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                                                        {selectedIngredients.has(ing) && <Check size={10} className="text-white" />}
                                                    </div>
                                                    <span className={`leading-tight text-xs font-medium ${selectedIngredients.has(ing) ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{ing}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white/5 border-t border-white/5">
                                        <button
                                            onClick={handleAddIngredientsToCart}
                                            disabled={selectedIngredients.size === 0 || isAddedToCart}
                                            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isAddedToCart ? 'bg-white text-black' : 'bg-[#333] hover:bg-[#444] text-white disabled:opacity-50'}`}
                                        >
                                            {isAddedToCart ? (
                                                <><Check size={14} /> Ajouté !</>
                                            ) : (
                                                <><ShoppingCart size={14} /> Ajouter ({selectedIngredients.size})</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: INSTRUCTIONS */}
                        <div className="order-1 md:order-2">
                            
                            {/* STORAGE ADVICE BLOCK (NEW) */}
                            {storageAdvice && (
                                <div className="mb-6 p-4 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-start gap-3">
                                    <div className="bg-blue-500/20 p-2 rounded-full text-blue-300">
                                        <Snowflake size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Conservation</h3>
                                        <p className="text-sm text-blue-100/90 leading-relaxed">{storageAdvice}</p>
                                    </div>
                                </div>
                            )}

                            {/* INGREDIENTS WITH QUANTITIES BLOCK (NEW FOR COOKING) */}
                            {ingredientsWithQuantities && ingredientsWithQuantities.length > 0 && (
                                <div className="mb-6 p-5 rounded-2xl border border-dashed border-white/10 bg-white/5 relative overflow-hidden">
                                     <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2" style={{ color: themeColor }}>
                                        <Leaf size={18} /> Ingrédients & Dosages
                                    </h3>
                                    <ul className="space-y-2">
                                        {ingredientsWithQuantities.map((ing, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{backgroundColor: themeColor}}></span>
                                                <span>{ing}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* USTENSILES BLOCK */}
                            {utensilsList && utensilsList.length > 0 && (
                                <div className="mb-6 p-5 rounded-2xl border border-dashed border-white/10 bg-white/5 relative overflow-hidden">
                                    <h3 className="font-display text-lg text-white mb-3 flex items-center gap-2" style={{ color: themeColor }}>
                                        <PremiumUtensils size={18} /> Matériel Requis
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {utensilsList.map((item, idx) => (
                                            <span key={idx} className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-[#151515] text-gray-300 border border-white/5 shadow-sm">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="markdown-prose prose-invert text-gray-300 leading-relaxed space-y-4">
                                <ReactMarkdown 
                                components={{
                                    h1: ({node, ...props}) => <h1 className="hidden" {...props} />, // On cache le titre H1 car déjà affiché en haut
                                    h2: ({node, ...props}) => (
                                        <div className="flex items-center gap-3 mt-8 mb-4">
                                            <div className="h-[1px] flex-1 bg-white/10"></div>
                                            <h2 className="text-lg font-bold text-white uppercase tracking-widest" {...props} />
                                            <div className="h-[1px] flex-1 bg-white/10"></div>
                                        </div>
                                    ),
                                    strong: ({node, ...props}) => <strong className="font-bold text-white" style={{color: themeColor}} {...props} />,
                                    ul: ({node, ...props}) => <ul className="space-y-4 my-6" {...props} />,
                                    li: ({node, ...props}) => (
                                        <li className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors" {...props}>
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{backgroundColor: themeColor}}></span>
                                            <span className="flex-1 text-gray-300">{props.children}</span>
                                        </li>
                                    ),
                                    p: ({node, ...props}) => <p className="mb-4 text-gray-400 font-light" {...props} />
                                }}
                                >
                                {recipe}
                                </ReactMarkdown>
                            </div>

                             {/* Save Button */}
                            <button 
                                onClick={handleSaveToBook} 
                                disabled={isSaved}
                                className="w-full mt-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border border-white/10 shadow-xl text-white uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-100"
                                style={{ backgroundColor: isSaved ? '#333' : themeColor }}
                            >
                                {isSaved ? <Check size={18} /> : <Book size={18} />}
                                {isSaved ? 'Enregistré dans le carnet' : 'Sauvegarder cette recette'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCreator;
