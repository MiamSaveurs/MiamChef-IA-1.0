
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

  // --- STATE POUR SMART CONNECT (Simulation IoT) ---
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectStep, setConnectStep] = useState<'searching' | 'found' | 'sending' | 'success'>('searching');

  // --- STATE POUR OVERRIDE DES APPAREILS ---
  const [localSmartDevices, setLocalSmartDevices] = useState<string[]>([]);
  const [availableProfileDevices, setAvailableProfileDevices] = useState<string[]>([]);

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
  const persistentSteps = persistentState?.steps || []; 

  // Chargement initial des devices du profil
  useEffect(() => {
      const profile = getUserProfile();
      if (profile.smartDevices && profile.smartDevices.length > 0) {
          setAvailableProfileDevices(profile.smartDevices);
          setLocalSmartDevices(profile.smartDevices); // Par défaut, tout est actif
      }
  }, []);

  const toggleLocalDevice = (device: string) => {
      if (localSmartDevices.includes(device)) {
          setLocalSmartDevices(prev => prev.filter(d => d !== device));
      } else {
          setLocalSmartDevices(prev => [...prev, device]);
      }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'loading' || adjusting || generatingVideo) {
      
      let baseSteps = isPatissier 
        ? ["Analyse moléculaire des saveurs...", "Calibrage du four virtuel...", "Émulsion des idées...", "Montage de la structure...", "Glaçage final..."]
        : ["Inspection du garde-manger...", "Préchauffage des idées...", "Optimisation du budget...", "Touche du Chef...", "Dressage..."];
      
      if (generatingVideo) {
          baseSteps = ["Initialisation du studio Veo...", "Lumières, Caméra, Action...", "Rendu cinématique en cours...", "Finalisation du montage..."];
      } else if (localSmartDevices.some(d => d.includes('Cookeo'))) {
          baseSteps = ["Connexion au Cookeo...", "Calcul du temps sous pression...", "Génération des étapes dorures...", "Synchronisation MiamChef..."];
      } else if (localSmartDevices.some(d => d.includes('Thermomix') || d.includes('Monsieur'))) {
          baseSteps = ["Synchronisation Robot...", "Calcul vitesse des lames...", "Ajustement température Varoma...", "Programmation des étapes..."];
      } else if (localSmartDevices.some(d => d.includes('Airfryer'))) {
          baseSteps = ["Préchauffage Airfryer virtuel...", "Optimisation circulation air...", "Calcul du croustillant...", "Finalisation..."];
      }

      const adjustSteps = ["Analyse des saveurs...", "Rééquilibrage des ingrédients...", "Mise à jour de la cuisson...", "Finalisation de la recette..."];
      const currentSteps = adjusting ? adjustSteps : baseSteps;
      
      let i = 0;
      setLoadingStep(currentSteps[0]);
      interval = setInterval(() => {
        i = (i + 1) % currentSteps.length;
        setLoadingStep(currentSteps[i]);
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [status, isPatissier, adjusting, localSmartDevices, generatingVideo]);

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

  useEffect(() => {
    if (persistentSteps && persistentSteps.length > 0) {
        setCookingSteps(persistentSteps.map(cleanMarkdown));
    } else if (recipe) {
        const lines = recipe.split('\n');
        let extractedSteps: string[] = [];
        let inInstructions = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.match(/^##\s*(Instruction|Préparation|Étapes|Recette)/i)) {
                inInstructions = true;
                return;
            }
            if (inInstructions && trimmed.startsWith('## ') && !trimmed.match(/étape/i)) {
                inInstructions = false;
                return;
            }
            if ((inInstructions || extractedSteps.length > 0) && (trimmed.match(/^\d+\./) || trimmed.startsWith('- ') || trimmed.startsWith('* '))) {
                const cleanStep = trimmed.replace(/^(\d+\.|-|\*)\s*/, '');
                if (cleanStep.length > 10) { 
                    extractedSteps.push(cleanMarkdown(cleanStep));
                }
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

  const handleGenerate = async () => {
    if (mode === 'create' && !ingredients.trim()) return;
    if (mode === 'search' && !searchQuery.trim()) return;
    
    setStatus('loading');
    setPersistentState(null); 
    setVideoUrl(null); 
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
            difficulty || 'intermediate',
            localSmartDevices 
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

  const handleGenerateVideo = async () => {
      const titleMatch = recipe.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Recette Gourmande';
      
      try {
          // @ts-ignore
          if (window.aistudio && window.aistudio.hasSelectedApiKey) {
              // @ts-ignore
              const hasKey = await window.aistudio.hasSelectedApiKey();
              if (!hasKey) {
                   // @ts-ignore
                   await window.aistudio.openSelectKey();
              }
          }
      } catch (e) {
          console.warn("AI Studio check failed or not available", e);
      }

      setGeneratingVideo(true);
      try {
          const video = await generateRecipeVideo(title, cuisineStyle);
          setVideoUrl(video);
      } catch (e) {
          console.error("Video generation failed", e);
          alert("La génération de vidéo a échoué. Assurez-vous d'avoir une clé API valide.");
      } finally {
          setGeneratingVideo(false);
      }
  };

  const handleAdjustRecipe = async (type: string) => {
      if (!recipe) return;
      setAdjusting(type);
      try {
          const result = await adjustRecipe(recipe, type);
          setPersistentState({
              ...persistentState,
              text: result.text,
              metrics: result.metrics || metrics,
              ingredients: result.ingredients || ingredientsList,
              ingredientsWithQuantities: result.ingredientsWithQuantities || ingredientsWithQuantities,
              steps: result.steps || persistentSteps,
              storageAdvice: result.storageAdvice || storageAdvice,
          });
      } catch (e) {
          console.error("Adjustment failed", e);
      } finally {
          setAdjusting(null);
      }
  };

  const handleClearRecipe = () => {
      setPersistentState(null);
      setIngredients('');
      setSearchQuery('');
      setIsCookingMode(false);
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

  const handleSmartConnect = () => {
      setShowConnectModal(true);
      setConnectStep('searching');
      setTimeout(() => setConnectStep('found'), 2000);
      setTimeout(() => setConnectStep('sending'), 3500);
      setTimeout(() => setConnectStep('success'), 5500);
      setTimeout(() => setShowConnectModal(false), 7500);
  };

  const handleShare = async () => {
      const titleMatch = recipe.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Ma Recette';
      const shareData = {
          title: `MiamChef: ${title}`,
          text: `🍽️ Je viens de créer cette recette unique avec MiamChef !\n\n👨‍🍳 ${title}\n🔥 ${metrics?.caloriesPerPerson} Kcal | Score ${metrics?.nutriScore}\n\nTélécharge l'app pour avoir la recette complète !`,
          url: window.location.href
      };

      if (navigator.share) {
          try {
              await navigator.share(shareData);
          } catch (err) {
              console.log('Partage annulé');
          }
      } else {
          alert("Fonction de partage native non disponible sur ce navigateur.");
      }
  };

  const VisualSelector = ({ 
    label, 
    icon: MainIcon, 
    value, 
    onChange, 
    options,
    getIcon
  }: { 
    label: string, 
    icon: any, 
    value: string, 
    onChange: (val: string) => void, 
    options: string[],
    getIcon?: (opt: string) => any
  }) => {
    return (
        <div className="mb-6">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3" style={{ color: themeColor }}>
                <MainIcon size={12} /> {label}
            </label>
            <div className="flex overflow-x-auto gap-3 pb-2 -mx-2 px-2 no-scrollbar snap-x">
                {options.map((option) => {
                    const isSelected = value === option;
                    const OptionIcon = getIcon ? getIcon(option) : Star;
                    
                    return (
                        <button
                            key={option}
                            onClick={() => onChange(option)}
                            className={`flex-shrink-0 snap-center min-w-[100px] p-3 rounded-xl border flex flex-col items-center gap-2 transition-all duration-300 ${
                                isSelected 
                                ? `bg-${isPatissier ? 'pink' : 'green'}-900/40 border-${isPatissier ? 'pink' : 'green'}-500 shadow-lg scale-105` 
                                : 'bg-[#151515] border-white/5 hover:border-white/20'
                            }`}
                            style={{ borderColor: isSelected ? themeColor : '' }}
                        >
                            <div className={`p-2 rounded-full ${isSelected ? 'text-white' : 'text-gray-500'}`} style={{ backgroundColor: isSelected ? themeColor : 'rgba(255,255,255,0.05)' }}>
                                {OptionIcon && <OptionIcon size={18} />}
                            </div>
                            <span className={`text-[10px] font-bold text-center uppercase tracking-wide leading-tight ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                {option}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
  };

  const getDietIcon = (diet: string) => {
      if (diet.includes("Végétarien")) return Leaf;
      if (diet.includes("Vegan")) return Heart;
      if (diet.includes("Halal")) return Moon;
      if (diet.includes("Casher")) return PremiumSparkles;
      if (diet.includes("Gluten")) return Wheat;
      if (diet.includes("Lactose")) return Milk;
      if (diet.includes("Sportif")) return Activity;
      if (diet.includes("Crétois")) return Sun;
      return Globe;
  };

  const getStyleIcon = (style: string) => {
      if (style.includes("Française")) return Crown;
      if (style.includes("Italie")) return Globe; 
      if (style.includes("Asiatique")) return WickerBasket; 
      if (style.includes("Mexicain")) return Flame;
      if (style.includes("Méditerranéen")) return Sun;
      if (style.includes("Bistrot")) return Coffee;
      if (style.includes("Exception")) return PremiumMedal;
      if (style.includes("Street")) return Utensils;
      return Globe;
  };

  if (isCookingMode) {
      const currentStepText = cookingSteps[currentStepIndex];
      const progress = cookingSteps.length > 0 ? ((currentStepIndex + 1) / cookingSteps.length) * 100 : 0;
      const isLastStep = currentStepIndex >= cookingSteps.length - 1;

      return (
          <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col font-sans">
              <div className="px-6 py-6 flex items-center justify-between bg-black/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-10">
                  <button 
                    onClick={() => setIsCookingMode(false)}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                      <XCircle size={24} />
                  </button>
                  <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mode Cuisine</span>
                      <span className="font-display text-xl leading-none mt-1">Étape {currentStepIndex + 1} <span className="text-gray-600 font-sans text-sm">/ {cookingSteps.length}</span></span>
                      
                      {localSmartDevices.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-900/30 border border-blue-500/30">
                              <Wifi size={10} className="text-blue-400 animate-pulse" />
                              <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">Connecté : {localSmartDevices[0]}</span>
                          </div>
                      )}
                  </div>
                  <div className="w-10"></div>
              </div>

              <div className="h-1 w-full bg-[#1a1a1a]">
                  <div 
                    className="h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%`, backgroundColor: themeColor }}
                  ></div>
              </div>

              <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                  <div className="max-w-2xl w-full animate-slide-up">
                      <p className="text-2xl md:text-4xl font-sans font-medium leading-normal text-center text-gray-100 drop-shadow-lg">
                        {currentStepText}
                      </p>
                  </div>
              </div>

              <div className="p-6 pb-12 bg-black/90 backdrop-blur-lg border-t border-white/10 safe-pb">
                  <div className="flex gap-4 max-w-md mx-auto">
                      <button 
                        onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                        disabled={currentStepIndex === 0}
                        className="flex-1 py-6 rounded-2xl bg-[#1a1a1a] border border-white/10 text-white font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#252525] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <ChevronLeft size={20} /> Précédent
                      </button>

                      {!isLastStep ? (
                          <button 
                            onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                            className="flex-[2] py-6 rounded-2xl text-white font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
                            style={{ backgroundColor: themeColor, boxShadow: `0 10px 30px -10px ${themeColor}66` }}
                          >
                              Suivant <ArrowRight size={24} />
                          </button>
                      ) : (
                          <button 
                            onClick={() => setIsCookingMode(false)}
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

  return (
    <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
      
      {showConnectModal && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center px-6">
            <div className="w-full max-w-sm bg-[#1a1a1a] rounded-[2rem] border border-white/10 p-8 text-center relative overflow-hidden shadow-2xl">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isPatissier ? 'from-pink-500 to-purple-500' : 'from-green-500 to-blue-500'} animate-pulse`}></div>
                
                {connectStep === 'searching' && (
                    <div className="animate-fade-in py-8">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <Wifi size={80} className="text-gray-600 absolute inset-0 animate-ping opacity-20" />
                            <Wifi size={80} className="text-white relative z-10" />
                        </div>
                        <h3 className="text-xl font-display text-white mb-2">Recherche d'appareils...</h3>
                        <p className="text-sm text-gray-500">Scanning Bluetooth & WiFi (Matter™)</p>
                    </div>
                )}

                {connectStep === 'found' && (
                    <div className="animate-slide-up py-8">
                         <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
                            <Radio size={40} className="text-green-400" />
                         </div>
                         <h3 className="text-xl font-display text-white mb-2">Appareil Détecté</h3>
                         <p className="text-lg font-bold text-gray-200 mb-1">
                             {localSmartDevices.length > 0 ? localSmartDevices[0] : (isPatissier ? "Robot Pâtissier Pro" : "Four Vapeur Connecté")}
                         </p>
                         <p className="text-xs text-gray-500 uppercase tracking-widest">Signal Excellent</p>
                    </div>
                )}

                {connectStep === 'sending' && (
                    <div className="animate-pulse py-8">
                         <div className="relative w-20 h-20 mx-auto mb-6">
                            <Cast size={80} className="text-blue-400" />
                         </div>
                         <h3 className="text-xl font-display text-white mb-2">Synchronisation</h3>
                         <p className="text-sm text-gray-400">
                             Envoi du programme de cuisson : <br/>
                             <span className="text-white font-bold">{metrics?.difficulty === 'Expert' ? 'Mode Chef (Précision)' : 'Mode Eco'}</span>
                         </p>
                    </div>
                )}

                {connectStep === 'success' && (
                    <div className="animate-slide-up py-8">
                         <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            <Check size={40} className="text-black" />
                         </div>
                         <h3 className="text-2xl font-display text-white mb-2">Connecté !</h3>
                         <p className="text-sm text-gray-400">
                             Votre appareil est prêt. <br/>Lancement automatique.
                         </p>
                    </div>
                )}
            </div>
        </div>
      )}

      {!recipe ? (
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
                            {isPatissier ? "L'Atelier Sucré" : "L'Atelier Salé"}
                        </h1>
                        <p className="text-gray-400 text-sm font-light tracking-widest uppercase">
                            {isPatissier ? "Précision & Gourmandise" : "Cuisine & Improvisation"}
                        </p>
                    </div>

                    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-1.5 shadow-2xl mb-10">
                        <div className="bg-black/40 rounded-[1.7rem] p-6 border border-white/5">
                            
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

                                <VisualSelector 
                                    label="Régime"
                                    icon={Leaf}
                                    value={dietary}
                                    onChange={setDietary}
                                    options={["Classique (Aucun)", "Végétarien", "Vegan", "Halal", "Casher", "Sans Gluten", "Sans Lactose", "Régime Crétois", "Sportif (Protéiné)"]}
                                    getIcon={getDietIcon}
                                />

                                <VisualSelector 
                                    label="Style"
                                    icon={Globe}
                                    value={cuisineStyle}
                                    onChange={setCuisineStyle}
                                    options={["Tradition Française", "Italie / Pâtes", "Saveurs Asiatiques", "Mexicain / Épicé", "Oriental / Méditerranéen", "Plat du Jour (Bistrot)", "Repas d'Exception", "Street Food / Rapide"]}
                                    getIcon={getStyleIcon}
                                />

                                <div 
                                    onClick={() => setIsBatchCooking(!isBatchCooking)}
                                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isBatchCooking ? 'bg-[#151515] border-white/30' : 'bg-[#151515] border-white/5'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Layers size={18} className={isBatchCooking ? 'text-white' : 'text-gray-500'} />
                                        <span className={`text-sm font-medium ${isBatchCooking ? 'text-white' : 'text-gray-400'}`}>Cuisiner pour la semaine (Batch Cooking)</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isBatchCooking ? 'bg-white border-white' : 'border-gray-600 bg-transparent'}`}>
                                        {isBatchCooking && <Check size={12} className="text-black" />}
                                    </div>
                                </div>

                                {availableProfileDevices.length > 0 && (
                                    <div className="bg-[#151515] p-3 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                            <Wifi size={10} /> Appareils pour cette recette
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {availableProfileDevices.map(device => (
                                                <button
                                                    key={device}
                                                    onClick={() => toggleLocalDevice(device)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
                                                        localSmartDevices.includes(device)
                                                            ? 'bg-purple-900/30 border-purple-500 text-purple-200'
                                                            : 'bg-[#1a1a1a] border-white/10 text-gray-500 hover:text-gray-300'
                                                    }`}
                                                >
                                                    {device}
                                                    {localSmartDevices.includes(device) && <Check size={12} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                    {mode === 'create' ? 'Lancer la Recette' : 'Lancer la Recherche'}
                                    </>
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
      ) : (
        <div className="animate-fade-in relative bg-[#0a0a0a]">

            {(adjusting || generatingVideo) && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                        {generatingVideo ? (
                            <Video size={48} className="text-red-500 animate-pulse mx-auto mb-4" />
                        ) : (
                            <Wand2 size={48} className="text-purple-400 animate-bounce mx-auto mb-4" />
                        )}
                        <h3 className="text-xl font-display text-white mb-2">
                            {generatingVideo ? "Studio Veo en cours..." : "Ajustement en cours..."}
                        </h3>
                        <p className="text-sm text-gray-400 animate-pulse">{loadingStep}</p>
                    </div>
                </div>
            )}
            
            <div className="w-full h-[50vh] relative">
                {videoUrl ? (
                    <div className="w-full h-full bg-black flex items-center justify-center relative">
                        <video src={videoUrl} controls autoPlay loop className="h-full w-auto max-w-full" />
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase animate-pulse">
                            Généré par Veo
                        </div>
                    </div>
                ) : generatedImage ? (
                    <img src={generatedImage} className="w-full h-full object-cover" alt="Plat" />
                ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                        <PremiumChefHat size={64} className="opacity-20 text-white" />
                    </div>
                )}
                {!videoUrl && <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]"></div>}
                
                <button 
                    onClick={handleClearRecipe} 
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-full text-white border border-white/10 backdrop-blur-md transition-all shadow-lg"
                >
                      <XCircle size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Fermer</span>
                </button>

                {!videoUrl && (
                    <button 
                        onClick={handleGenerateVideo}
                        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg group"
                    >
                        <Video size={16} className="text-red-500 group-hover:scale-110 transition-transform"/>
                        GÉNÉRER LA VIDÉO
                    </button>
                )}
            </div>

            <div className="relative z-10 -mt-24 px-4 pb-20 max-w-4xl mx-auto">
                
                <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                    
                    <div className="flex justify-center gap-3 mb-6">
                        <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg border border-white/10 flex items-center gap-2" style={{ backgroundColor: themeColor }}>
                            {isPatissier ? <PremiumCake size={12}/> : <PremiumChefHat size={12}/>}
                            {isPatissier ? 'Sucré' : 'Salé'}
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

                    <h1 className="text-4xl md:text-5xl font-display text-white text-center leading-tight mb-8 drop-shadow-lg">
                        {recipe.match(/^#\s+(.+)$/m)?.[1] || 'Recette du Chef'}
                    </h1>

                    {metrics && (
                        <div className="grid grid-cols-4 gap-4 mb-8 py-6 border-y border-white/5">
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

                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-3 px-1">
                             <Wand2 size={14} className="text-purple-400" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Personnalisation</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button 
                                onClick={() => handleAdjustRecipe('Réduire le sel')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all group"
                            >
                                <Droplets size={20} className="text-blue-300 mb-1 group-hover:scale-110 transition-transform"/>
                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide text-center">Réduire Sel</span>
                            </button>
                            <button 
                                onClick={() => handleAdjustRecipe('Augmenter les protéines')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all group"
                            >
                                <Activity size={20} className="text-red-300 mb-1 group-hover:scale-110 transition-transform"/>
                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide text-center">Plus de Protéines</span>
                            </button>
                            <button 
                                onClick={() => handleAdjustRecipe('Passer au végétal')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all group"
                            >
                                <Leaf size={20} className="text-green-300 mb-1 group-hover:scale-110 transition-transform"/>
                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide text-center">Végétaliser</span>
                            </button>
                            <button 
                                onClick={() => handleAdjustRecipe('Adapter aux enfants')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all group"
                            >
                                <Smile size={20} className="text-yellow-300 mb-1 group-hover:scale-110 transition-transform"/>
                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide text-center">Pour Enfants</span>
                            </button>
                        </div>
                    </div>

                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <Wifi size={14} className="text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Appareils Connectés</span>
                        </div>
                        <button
                            onClick={handleSmartConnect}
                            className="w-full p-4 rounded-xl bg-blue-900/10 border border-blue-500/20 hover:bg-blue-900/20 hover:border-blue-500/40 transition-all group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <Wifi size={20} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-bold text-gray-200 group-hover:text-white">Smart Connect</span>
                                    <span className="block text-[10px] text-blue-300/60 uppercase tracking-wider">Synchroniser Four / Robot</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-blue-500/50 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        <button 
                            onClick={handleShare}
                            className="bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-colors w-full justify-center"
                        >
                            <Share2 size={16} /> Partager la recette
                        </button>
                    </div>

                    <div className="mb-10 flex justify-center">
                        <button 
                            onClick={startCooking}
                            disabled={cookingSteps.length === 0}
                            className="group relative px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                        >
                            <Play size={20} fill="black" />
                            Lancer le Mode Cuisine
                            <div className="absolute inset-0 rounded-full ring-2 ring-white/50 animate-pulse group-hover:ring-white"></div>
                        </button>
                    </div>

                    <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                        
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

                        <div className="order-1 md:order-2">
                            
                            <div className="markdown-prose prose-invert text-gray-300 leading-relaxed space-y-4">
                                <ReactMarkdown 
                                components={{
                                    h1: ({node, ...props}) => <h1 className="hidden" {...props} />,
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
