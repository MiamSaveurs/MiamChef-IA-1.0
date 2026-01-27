
import React, { useState, useEffect, useRef } from 'react';
import { generateChefRecipe, searchChefsRecipe, generateRecipeImage, modifyChefRecipe, generateStepVideo } from '../services/geminiService';
import { saveRecipeToBook, addToShoppingList } from '../services/storageService';
import { LoadingState, GroundingChunk, RecipeMetrics } from '../types';
import { Loader2, Play, X, ChevronRight, ChevronLeft, Volume2, Flame, Wheat, Video, Check, Image as ImageIcon, Wand2, Plus, Globe2, Layers, ChevronDown, MapPin, Store, Mic, MicOff, Medal, ShoppingCart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  GourmetBook, 
  PremiumChefHat, 
  PremiumCake, 
  PremiumCroissant, 
  PremiumSparkles, 
  PremiumSearch, 
  PremiumUsers, 
  PremiumLeaf, 
  PremiumTimer, 
  PremiumGlobe, 
  PremiumLayers, 
  PremiumWheat, 
  PremiumUtensils, 
  PremiumMedal, 
  PremiumEuro, 
  PremiumPlay, 
  PremiumPlus, 
  PremiumShoppingCart, 
  PremiumVideo, 
  PremiumVolume, 
  PremiumMic, 
  PremiumMicOff, 
  PremiumX, 
  PremiumMapPin, 
  PremiumStore, 
  PremiumDownload 
} from './Icons';

const MacroDonut = ({ value, label, color, total }: { value: number, label: string, color: string, total: number }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
      <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 flex items-center justify-center rounded-full mb-2 bg-white border border-green-50 shadow-inner">
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                    background: `conic-gradient(${color} ${percentage}%, transparent 0)`,
                    maskImage: 'radial-gradient(transparent 55%, black 56%)',
                    WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)'
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-sm font-bold text-emerald-900">{value}g</span>
              </div>
          </div>
          <span className="text-[9px] font-bold text-emerald-700/60 uppercase tracking-wider">{label}</span>
      </div>
  )
};

const RecipeCreator: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'search'>('create');
  const currentYear = new Date().getFullYear();
  const [chefMode, setChefMode] = useState<'cuisine' | 'patisserie'>('cuisine');
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [cuisineStyle, setCuisineStyle] = useState('Cuisine Française'); 
  const [isBatchCooking, setIsBatchCooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'economical' | 'authentic'>('economical');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [people, setPeople] = useState(2);
  const [recipe, setRecipe] = useState('');
  const [metrics, setMetrics] = useState<RecipeMetrics | null>(null);
  const [utensils, setUtensils] = useState<string[]>([]);
  const [seoData, setSeoData] = useState<{title?: string, description?: string}>({});
  const [status, setStatus] = useState<LoadingState>('idle');
  const [loadingStep, setLoadingStep] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [addedToList, setAddedToList] = useState(false);
  const isTwistingRef = useRef(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState<LoadingState>('idle');
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [parsedSteps, setParsedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepVideo, setStepVideo] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [userCity, setUserCity] = useState(localStorage.getItem('miamchef_city') || '');
  const [selectedIngredientForDrive, setSelectedIngredientForDrive] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [listeningTarget, setListeningTarget] = useState<'ingredients' | 'search' | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'loading') {
      if (isTwistingRef.current) return;
      const stepsCuisine = ["Activation du Cerveau Salé...", "Analyse des saveurs...", "Dressage virtuel...", "Calibration des cuissons...", "Astuces du Chef..."];
      const stepsPatisserie = ["Activation du Cerveau Sucré...", "Précision moléculaire...", "Architecture du gâteau...", "Glaçage virtuel...", "Finition Pâtissière..."];
      const steps = mode === 'create' 
        ? (chefMode === 'patisserie' ? stepsPatisserie : stepsCuisine)
        : [`Recherche sur le web ${currentYear}...`, "Adaptation MiamChef...", "Analyse diététique...", "Calcul du prix...", "Finalisation..."];
      let i = 0;
      setLoadingStep(steps[0]);
      interval = setInterval(() => {
        i = (i + 1);
        if (i < steps.length) {
             setLoadingStep(steps[i]);
        }
      }, 2500); 
    } else {
        isTwistingRef.current = false;
    }
    return () => clearInterval(interval);
  }, [status, mode, chefMode]);

  const handleGenerate = async () => {
    if (mode === 'create' && !ingredients.trim()) return;
    if (mode === 'search' && !searchQuery.trim()) return;
    isTwistingRef.current = false;
    setStatus('loading');
    setRecipe('');
    setSources([]);
    setMetrics(null);
    setUtensils([]);
    setSeoData({});
    setGeneratedImage(null);
    setImageStatus('idle');
    setIsSaved(false);
    setAddedToList(false);
    setCheckedIngredients(new Set()); 
    try {
      let result;
      if (mode === 'create') {
        result = await generateChefRecipe(ingredients, people, dietary, mealTime, cuisineStyle, isBatchCooking, chefMode);
      } else {
        result = await searchChefsRecipe(searchQuery, people, searchType);
      }
      setRecipe(result.text);
      setMetrics(result.metrics || null);
      setUtensils(result.utensils || []);
      setSeoData({title: result.seoTitle, description: result.seoDescription});
      if (mode === 'search') setSources(result.groundingChunks || []);
      setStatus('success');
      triggerImageGeneration(result.text, mode === 'create' ? `${ingredients} style ${cuisineStyle}` : searchQuery);
    } catch (e: any) {
      console.error(e);
      setStatus('error');
      alert(`Erreur : ${e.message}`);
    }
  };

  const handleSmartTwist = async (twist: string) => {
    if (!recipe) return;
    isTwistingRef.current = true;
    setStatus('loading');
    setLoadingStep(`Twist : ${twist}...`);
    setCheckedIngredients(new Set());
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
        const result = await modifyChefRecipe(recipe, twist);
        setRecipe(result.text);
        setMetrics(result.metrics || null);
        setUtensils(result.utensils || []);
        setSeoData({title: result.seoTitle, description: result.seoDescription});
        setStatus('success');
        triggerImageGeneration(result.text, twist);
    } catch (e) {
        setStatus('error');
    }
  };

  const triggerImageGeneration = async (recipeText: string, context: string) => {
    setImageStatus('loading');
    try {
      const titleMatch = recipeText.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : (mode === 'search' ? searchQuery : 'Plat Gourmand');
      const imageUrl = await generateRecipeImage(title, context);
      if (imageUrl) {
        setGeneratedImage(imageUrl);
        setImageStatus('success');
      } else {
        setImageStatus('error');
      }
    } catch (e) {
      console.error("Image generation failed", e);
      setImageStatus('error');
    }
  };

  const handleSaveToBook = async () => {
    if (!recipe) return;
    const titleMatch = recipe.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : (mode === 'create' ? "Recette Inventée" : searchQuery);
    await saveRecipeToBook({
      id: Date.now().toString(),
      title: title,
      markdownContent: recipe,
      date: new Date().toLocaleDateString('fr-FR'),
      metrics: metrics || undefined,
      utensils: utensils || undefined,
      image: generatedImage || undefined,
      seoTitle: seoData.title,
      seoDescription: seoData.description
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('recipe-pdf-container');
    if (!element) return;
    element.classList.add('pdf-layout');
    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     `miamchef-${new Date().toISOString().slice(0, 10)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      enableLinks:  true
    };
    const html2pdf = (window as any).html2pdf;
    if (html2pdf) {
      html2pdf().set(opt).from(element).save().then(() => element.classList.remove('pdf-layout')).catch(() => element.classList.remove('pdf-layout'));
    }
  };

  const startImmersiveMode = () => {
    const lines = recipe.split('\n');
    const steps: string[] = [];
    let isCapture = false;
    for (const line of lines) {
        if (line.match(/^#+\s*(Préparation|Instructions|Étapes|Recette|Méthode)/i)) {
            isCapture = true;
            continue;
        }
        if (isCapture) {
             if (line.match(/^#{1,2}\s/)) isCapture = false;
             else if (line.trim().length > 5) {
                 const cleanLine = line.replace(/[*_]/g, '').trim();
                 const finalLine = cleanLine.replace(/^(\d+\.|-)\s*/, '');
                 if (finalLine.length > 3) steps.push(finalLine);
             }
        }
    }
    if (steps.length === 0) {
        steps.push("Lisez bien la recette avant de commencer.");
        const paragraphs = recipe.split('\n\n').filter(p => p.length > 20 && !p.startsWith('#')).map(p => p.replace(/[*_#]/g, '').trim());
        if(paragraphs.length > 0) steps.push(...paragraphs.slice(1));
    }
    setParsedSteps(steps);
    setCurrentStep(0);
    setStepVideo(null); 
    setImmersiveMode(true);
  };

  const speakStep = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (immersiveMode && parsedSteps.length > 0) {
        speakStep(parsedSteps[currentStep]);
        setStepVideo(null);
    } else {
        window.speechSynthesis.cancel();
    }
  }, [immersiveMode, currentStep, parsedSteps]);

  const handleGenerateVideo = async () => {
      if (videoLoading) return;
      setVideoLoading(true);
      const stepText = parsedSteps[currentStep];
      const videoUrl = await generateStepVideo(stepText);
      if (videoUrl) {
          setStepVideo(videoUrl);
      } else {
          console.log("Failed to generate video");
      }
      setVideoLoading(false);
  }

  const toggleIngredientCheck = (idx: number) => {
    const newSet = new Set(checkedIngredients);
    if (newSet.has(idx)) {
        newSet.delete(idx);
    } else {
        newSet.add(idx);
    }
    setCheckedIngredients(newSet);
  };

  const getRecipeSection = (type: 'ingredients' | 'instructions') => {
      const lines = recipe.split('\n');
      let capture = false;
      const content: string[] = [];
      for (const line of lines) {
          const lower = line.toLowerCase();
          const trimmed = line.trim();
          if (!capture) {
             if (type === 'ingredients' && (lower.includes('ingrédients') || lower.includes('courses')) && trimmed.startsWith('#')) {
                 capture = true; continue;
             }
             if (type === 'instructions' && (lower.includes('préparation') || lower.includes('étapes') || lower.includes('instructions')) && trimmed.startsWith('#')) {
                 capture = true; continue;
             }
             continue;
          }
          if (capture) {
              if (trimmed.match(/^#{1,2}\s/)) { capture = false; break; }
              if (trimmed.length > 2) content.push(line);
          }
      }
      return content;
  }

  const ingredientsList = getRecipeSection('ingredients');
  const instructionsList = getRecipeSection('instructions');

  const cleanIngredientName = (text: string) => {
      let clean = text.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      clean = clean.replace(/\s*\(.*?\)/g, '');
      clean = clean.replace(/^[\d\s.,/]+(g|kg|ml|cl|l|mg|c\.à\.s|c\.à\.c|cuillères?|tranches?|morceaux?|bottes?|sachets?|boites?|pots?|verres?|tasses?|pincées?|têtes?|gousses?|feuilles?|brins?|filets?|pavés?|escalopes?|poignées?)?(\s+(d'|de|du|des)\s+)?/i, '');
      clean = clean.replace(/^\d+\s+/, '').trim();
      return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  const handleAddSelectedToShoppingList = async () => {
      if (checkedIngredients.size === 0) return;
      const selectedItems: string[] = [];
      ingredientsList.forEach((line, idx) => {
          if (checkedIngredients.has(idx)) {
              const cleanText = cleanIngredientName(line);
              if (!cleanText.toLowerCase().startsWith('pour') && cleanText.length > 1) {
                 selectedItems.push(cleanText);
              }
          }
      });
      if (selectedItems.length > 0) {
          await addToShoppingList(selectedItems);
          setAddedToList(true);
          setTimeout(() => setAddedToList(false), 3000);
      }
  };

  const handleOpenDriveModal = (ingredient: string) => {
      const clean = cleanIngredientName(ingredient);
      setSelectedIngredientForDrive(clean);
      setShowDriveModal(true);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserCity(e.target.value);
      localStorage.setItem('miamchef_city', e.target.value);
  };

  const findDrive = (brandName: string) => {
      if (!userCity) {
          alert("Veuillez entrer votre ville.");
          return;
      }
      const query = `Drive ${brandName} ${userCity}`;
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
  };

  const startListening = (target: 'ingredients' | 'search') => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
          alert("Désolé, votre navigateur ne supporte pas la reconnaissance vocale.");
          return;
      }
      try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'fr-FR';
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.onstart = () => { setListeningTarget(target); setIsListening(true); };
          recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              if (target === 'ingredients') {
                  setIngredients(prev => {
                      const spacer = prev.trim().length > 0 ? ' ' : '';
                      return prev + spacer + transcript;
                  });
              } else { setSearchQuery(transcript); }
          };
          recognition.onerror = () => { setIsListening(false); setListeningTarget(null); };
          recognition.onend = () => { setIsListening(false); setListeningTarget(null); };
          recognition.start();
      } catch (e) { alert("Impossible de démarrer le micro."); }
  };

  const supermarketBrands = [
    { name: 'E.Leclerc Drive', color: 'bg-blue-600' },
    { name: 'Carrefour Drive', color: 'bg-blue-500' },
    { name: 'Intermarché Drive', color: 'bg-red-600' },
    { name: 'Auchan Drive', color: 'bg-red-500' },
    { name: 'Courses U', color: 'bg-blue-400' },
    { name: 'Chronodrive', color: 'bg-green-600' },
    { name: 'Casino Drive', color: 'bg-green-700' },
    { name: 'Lidl', color: 'bg-yellow-500' }
  ];

  return (
    <div className="pb-32 px-4 pt-6 max-w-5xl mx-auto min-h-screen font-body text-emerald-900 bg-[#f4fcf0]">
      
      {/* HEADER & INPUT SECTION */}
      <div className="print:hidden">
        <header className="mb-8 flex items-center gap-3">
            <div className={`p-3 rounded-2xl shadow-sm border ${chefMode === 'patisserie' ? 'bg-pink-100 border-pink-200' : 'bg-green-100 border-green-200'}`}>
                {chefMode === 'patisserie' ? <PremiumCake size={28}/> : <PremiumChefHat size={32} />}
            </div>
            <div>
            <h2 className={`text-3xl font-display leading-none text-emerald-900`}>
                {chefMode === 'patisserie' ? 'Atelier Pâtisserie' : 'Atelier du Chef'}
            </h2>
            <p className="text-emerald-700/60 text-xs font-bold tracking-widest uppercase mt-1">
                {chefMode === 'patisserie' ? 'Précision & Gourmandise' : 'Cuisine & Improvisation'}
            </p>
            </div>
        </header>

        {/* DOUBLE CERVEAU SWITCH */}
        {!recipe && (
            <div className="bg-green-100/50 p-1 rounded-2xl flex mb-6 mx-auto max-w-lg border border-green-200/50 backdrop-blur-md">
                <button
                    onClick={() => setChefMode('cuisine')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${chefMode === 'cuisine' ? 'bg-chef-green text-white shadow-md' : 'text-emerald-700/60 hover:text-emerald-900'}`}
                >
                    <PremiumChefHat size={18} /> Cuisinier
                </button>
                <button
                    onClick={() => setChefMode('patisserie')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${chefMode === 'patisserie' ? 'bg-pink-500 text-white shadow-md' : 'text-emerald-700/60 hover:text-emerald-900'}`}
                >
                    <div className="flex items-center gap-2">
                         <PremiumCroissant size={16} /> Pâtissier
                    </div>
                </button>
            </div>
        )}

        {/* Mode Switcher */}
        {!recipe && (
        <div className="bg-white/40 p-1 rounded-xl flex mb-6 mx-auto max-w-md border border-green-100 shadow-inner">
            <button
            onClick={() => { setMode('create'); setRecipe(''); setMetrics(null); setUtensils([]); setGeneratedImage(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                mode === 'create' ? `bg-white text-emerald-900 shadow-sm border border-green-100` : 'text-emerald-700/40 hover:text-emerald-700/60'
            }`}
            >
            <PremiumChefHat size={14} /> Créer
            </button>
            <button
            onClick={() => { setMode('search'); setRecipe(''); setMetrics(null); setUtensils([]); setGeneratedImage(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                mode === 'search' ? `bg-white text-emerald-900 shadow-sm border border-green-100` : 'text-emerald-700/40 hover:text-emerald-700/60'
            }`}
            >
            <PremiumSearch size={14} /> Rechercher
            </button>
        </div>
        )}

        {/* INPUT FORM */}
        {!recipe && (
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
            {/* Configuration */}
            <div className="md:col-span-1 space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-green-50 shadow-sm">
                    <h3 className="font-bold text-emerald-700/40 text-[10px] uppercase tracking-widest mb-5 flex items-center gap-2">
                        <PremiumUsers size={12} /> Configuration
                    </h3>
                    <div className="space-y-5">
                        <div>
                        <label className="block text-xs font-bold text-emerald-700/40 mb-2 uppercase tracking-wide">{chefMode === 'patisserie' ? 'Gourmands' : 'Convives'}</label>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-10 h-10 bg-green-50 rounded-xl font-bold text-emerald-700/40 hover:bg-green-100 transition-colors flex items-center justify-center border border-green-100">-</button>
                            <span className="font-display text-2xl text-emerald-900 w-8 text-center">{people}</span>
                            <button onClick={() => setPeople(Math.min(12, people + 1))} className="w-10 h-10 bg-green-50 rounded-xl font-bold text-emerald-700/40 hover:bg-green-100 transition-colors flex items-center justify-center border border-green-100">+</button>
                        </div>
                        </div>
                        {mode === 'create' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-emerald-700/40 mb-2 uppercase tracking-wide">Diététique</label>
                                <div className="relative">
                                    <PremiumLeaf size={16} className="absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none opacity-40" />
                                    <select 
                                        className="w-full pl-10 pr-10 py-3 bg-green-50/50 border border-green-100 rounded-xl text-sm appearance-none cursor-pointer outline-none font-bold text-emerald-900 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"
                                        value={dietary}
                                        onChange={(e) => setDietary(e.target.value)}
                                    >
                                        <option value="">Classique (Aucun)</option>
                                        <option value="Régime Méditerranéen">Régime Méditerranéen</option>
                                        <option value="Végétarien">Végétarien</option>
                                        <option value="Végétalien (Vegan)">Végétalien (Vegan)</option>
                                        <option value="Sans Gluten">Sans Gluten</option>
                                        <option value="Sans Lactose">Sans Lactose</option>
                                        <option value="Keto (Cétogène)">Keto (Cétogène)</option>
                                        <option value="Halal">Halal</option>
                                        <option value="Casher">Casher</option>
                                        <option value="Sans Porc">Sans Porc</option>
                                        <option value="Faible en Glucides">Faible en Glucides</option>
                                        <option value="Hypocalorique">Hypocalorique</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700/40 pointer-events-none" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-emerald-700/40 mb-2 uppercase tracking-wide flex items-center gap-2"><PremiumGlobe size={12}/> Voyage / Style</label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-4 py-3 bg-green-50/50 border border-green-100 rounded-xl text-sm appearance-none cursor-pointer pr-10 outline-none font-bold text-emerald-900 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"
                                        value={cuisineStyle}
                                        onChange={(e) => setCuisineStyle(e.target.value)}
                                    >
                                        <option value="Cuisine Française">🇫🇷 Cuisine Française</option>
                                        <option value="Italien (Trattoria)">🇮🇹 Italien (Trattoria)</option>
                                        <option value="Asiatique (Street Food)">🌏 Asiatique (Street Food)</option>
                                        <option value="Japonais (Authentique)">🇯🇵 Japonais (Authentique)</option>
                                        <option value="Oriental & Épices">🕌 Oriental & Épices</option>
                                        <option value="Américain (Diner)">🇺🇸 Américain (Diner)</option>
                                        <option value="Créole & Îles">🌴 Créole & Îles</option>
                                        <option value="Indien (Ayurvédique)">🇮🇳 Indien (Ayurvédique)</option>
                                        <option value="Mexicain (Cantina)">🇲🇽 Mexicain (Cantina)</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700/40 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-emerald-700/40 mb-2 uppercase tracking-wide">Moment</label>
                                <div className="relative">
                                    <PremiumTimer size={16} className="absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none opacity-40" />
                                    <select 
                                        className="w-full pl-10 pr-10 py-3 bg-green-50/50 border border-green-100 rounded-xl text-sm appearance-none cursor-pointer outline-none font-bold text-emerald-900 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"
                                        value={mealTime} 
                                        onChange={(e) => setMealTime(e.target.value)}
                                    >
                                        <option value="">Déjeuner / Dîner</option>
                                        <option value="Petit-déjeuner">Petit-déjeuner</option>
                                        <option value="Brunch">Brunch</option>
                                        <option value="Déjeuner">Déjeuner</option>
                                        <option value="Goûter">Goûter</option>
                                        <option value="Apéritif / Dînatoire">Apéritif / Dînatoire</option>
                                        <option value="Dîner">Dîner</option>
                                        <option value="Encas">Encas</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-700/40 pointer-events-none" />
                                </div>
                            </div>

                            {chefMode === 'cuisine' && (
                                <div 
                                    onClick={() => setIsBatchCooking(!isBatchCooking)}
                                    className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center gap-3 ${isBatchCooking ? 'border-chef-green bg-green-50' : 'border-green-100 bg-green-50/50 hover:bg-green-100/50'}`}
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isBatchCooking ? 'bg-chef-green' : 'bg-green-200'}`}>
                                        <Check size={14} className="text-white" />
                                    </div>
                                    <span className={`text-xs font-bold ${isBatchCooking ? 'text-chef-green' : 'text-emerald-700/40'}`}><PremiumLayers size={12} className="inline mr-1"/> Batch Cooking</span>
                                </div>
                            )}
                        </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-green-50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        {chefMode === 'patisserie' ? <PremiumCake size={120} /> : <PremiumChefHat size={120} />}
                    </div>
                    
                    {mode === 'create' ? (
                        <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <label className={`block text-xs font-black text-emerald-700/40 uppercase tracking-[0.15em] flex items-center gap-2`}>
                                {chefMode === 'patisserie' ? <PremiumWheat size={14}/> : <PremiumUtensils size={14}/>} 
                                Ingrédients & Envies
                            </label>
                            
                            <div className="flex items-center gap-2">
                                {isListening && listeningTarget === 'ingredients' && <span className="text-[10px] text-red-500 font-black animate-pulse uppercase tracking-wider">En écoute...</span>}
                                <button 
                                    onClick={() => startListening('ingredients')}
                                    className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-bold border ${
                                        isListening && listeningTarget === 'ingredients' 
                                        ? 'bg-red-50 border-red-200 text-red-500' 
                                        : 'bg-white border-green-100 text-emerald-700/60 hover:bg-green-50 hover:text-emerald-900'
                                    }`}
                                >
                                    {isListening && listeningTarget === 'ingredients' ? <><PremiumMicOff size={14} /> Stop</> : <><PremiumMic size={14} /> Dicter</>}
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <textarea 
                                className="w-full p-6 bg-[#f0f7ed] border border-green-100 rounded-3xl outline-none resize-none font-body text-emerald-900 min-h-[180px] text-xl transition-all focus:bg-white focus:ring-4 focus:ring-green-50 shadow-inner" 
                                placeholder={chefMode === 'patisserie' ? "Ex: J'ai de la farine et des pommes, je voudrais un gâteau moelleux..." : "Ex: J'ai du poulet, du riz, et j'aimerais un plat épicé..."} 
                                value={ingredients} 
                                onChange={(e) => setIngredients(e.target.value)} 
                            />
                        </div>
                        </div>
                    ) : (
                        <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <label className={`block text-xs font-black text-emerald-700/40 uppercase tracking-[0.15em] flex items-center gap-2`}><PremiumSearch size={14} /> Nom de la recette</label>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => startListening('search')}
                                    className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-bold border ${
                                        isListening && listeningTarget === 'search' 
                                        ? 'bg-red-50 border-red-200 text-red-500' 
                                        : 'bg-white border-green-100 text-emerald-700/60 hover:bg-green-50 hover:text-emerald-900'
                                    }`}
                                >
                                    {isListening && listeningTarget === 'search' ? <><PremiumMicOff size={14} /> Stop</> : <><PremiumMic size={14} /> Dicter</>}
                                </button>
                            </div>
                        </div>
                        <div className="relative mb-4">
                            <input 
                                type="text" 
                                className="w-full p-6 bg-[#f0f7ed] border border-green-100 rounded-3xl outline-none font-body text-emerald-900 text-xl font-bold transition-all focus:bg-white focus:ring-4 focus:ring-green-50 shadow-inner" 
                                placeholder="Ex: Blanquette de veau..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} 
                            />
                        </div>

                        {/* AUTHENTIC VS ECONOMICAL TOGGLE */}
                        <div className="flex gap-2 p-1 bg-green-50 rounded-2xl border border-green-100">
                             <button
                                onClick={() => setSearchType('authentic')}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                    searchType === 'authentic' 
                                    ? 'bg-white text-yellow-700 shadow-md border border-green-100' 
                                    : 'text-emerald-700/40 hover:text-emerald-700/60'
                                }`}
                             >
                                 <PremiumMedal size={16} /> Authentique
                             </button>
                             <button
                                onClick={() => setSearchType('economical')}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                    searchType === 'economical' 
                                    ? 'bg-white text-chef-green shadow-md border border-green-100' 
                                    : 'text-emerald-700/40 hover:text-emerald-700/60'
                                }`}
                             >
                                 <PremiumEuro size={16} /> Économique
                             </button>
                        </div>
                        </div>
                    )}
                    <button onClick={handleGenerate} disabled={status === 'loading' || (mode === 'create' ? !ingredients : !searchQuery)} className={`w-full mt-8 py-5 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-3 font-display text-2xl disabled:opacity-50 active:scale-95 ${chefMode === 'patisserie' ? 'bg-pink-500 text-white shadow-pink-100 hover:bg-pink-600' : 'bg-chef-green text-white shadow-green-100 hover:bg-green-600'}`}>
                        {status === 'loading' ? (<><Loader2 className="animate-spin" /> {loadingStep || 'Réflexion...'}</>) : (<>{mode === 'create' ? <PremiumChefHat size={24}/> : <PremiumSearch size={24}/>} {mode === 'create' ? (chefMode === 'patisserie' ? 'Créer le Dessert' : 'Créer le Plat') : 'Lancer la recherche'}</>)}
                    </button>
                </div>
            </div>
        </div>
        )}
      </div>

      {status === 'error' && (
        <div className="mt-8 p-6 bg-red-50 border border-red-100 text-red-600 rounded-3xl text-center font-bold shadow-sm animate-fade-in">
          Une erreur est survenue lors de la création de la recette. Veuillez réessayer.
        </div>
      )}

      {/* RECIPE DISPLAY */}
      {recipe && (
        <div id="recipe-pdf-container" className="animate-fade-in mt-2 pb-10">
          
          {/* 1. HERO SECTION */}
          <div className="bg-white rounded-[3rem] shadow-2xl border border-green-50 overflow-hidden mb-8 relative group">
            <div className="w-full h-64 md:h-96 bg-green-50 relative overflow-hidden">
                {imageStatus === 'loading' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50/50 text-emerald-700/40">
                        <Loader2 size={40} className={`animate-spin mb-3 text-chef-green`} />
                        <span className="font-display text-xl text-emerald-700/60">Préparation de la photo...</span>
                    </div>
                )}
                {generatedImage ? (
                    <>
                        <img src={generatedImage} alt="Plat final" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute bottom-6 right-6 z-10">
                             <div className="bg-emerald-900/60 backdrop-blur-xl text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-white/20"><PremiumSparkles size={14} /> MiamChef IA Excellence {currentYear}</div>
                        </div>
                    </>
                ) : imageStatus !== 'loading' && (
                     <div className="w-full h-full flex items-center justify-center bg-green-50/50">
                        <ImageIcon size={64} className="text-green-100" />
                     </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12 pointer-events-none">
                    <h1 className="text-4xl md:text-6xl font-display text-white mb-2 leading-none drop-shadow-lg">
                        {recipe.match(/^#\s+(.+)$/m)?.[1] || "Recette du Chef"}
                    </h1>
                </div>
            </div>

            <div className="px-8 py-6 flex flex-wrap justify-between items-center gap-4 bg-white border-t border-green-50">
                <button onClick={() => { setRecipe(''); setGeneratedImage(null); }} className="p-3 hover:bg-green-50 rounded-full text-emerald-700/40 transition-colors border border-transparent hover:border-green-100"><ChevronLeft size={28}/></button>
                <div className="flex gap-4">
                     <button onClick={startImmersiveMode} className="bg-chef-green text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95">
                        <PremiumPlay size={20} className="text-white" /> <span className="font-display text-xl">Cuisiner</span>
                     </button>
                     <button onClick={handleSaveToBook} disabled={isSaved} className={`px-5 py-3 rounded-2xl font-bold flex items-center gap-3 text-sm border transition-all ${isSaved ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-emerald-700/60 border-green-100 hover:border-chef-green hover:text-chef-green hover:shadow-md'}`}>
                        {isSaved ? <Check size={20} /> : <GourmetBook size={20} />} {isSaved ? 'Enregistré' : 'Sauvegarder'}
                     </button>
                     <button onClick={handleDownloadPDF} className="p-3 text-emerald-700/40 hover:text-emerald-900 hover:bg-green-50 rounded-2xl transition-colors border border-transparent hover:border-green-100">
                        <PremiumDownload size={24} />
                     </button>
                </div>
            </div>
          </div>

          {/* 2. MACRO DASHBOARD */}
          {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-[2rem] border border-green-50 flex flex-col justify-center items-center text-center shadow-sm">
                      <div className="text-[10px] font-black text-emerald-700/40 uppercase tracking-widest mb-2">Apport Calorique</div>
                      <div className="text-4xl font-display text-emerald-900">{metrics.caloriesPerPerson}</div>
                      <div className="text-xs font-bold text-emerald-700/40 mt-1">Kcal par convive</div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-green-50 md:col-span-3 grid grid-cols-3 items-center justify-items-center shadow-sm">
                       <MacroDonut value={metrics.proteins} label="Protéines" color="#3b82f6" total={metrics.proteins + metrics.carbohydrates + metrics.fats} />
                       <MacroDonut value={metrics.carbohydrates} label="Glucides" color="#eab308" total={metrics.proteins + metrics.carbohydrates + metrics.fats} />
                       <MacroDonut value={metrics.fats} label="Lipides" color="#ef4444" total={metrics.proteins + metrics.carbohydrates + metrics.fats} />
                  </div>
              </div>
          )}

          {/* 3. SMART TWISTS */}
          <div className="mb-10 overflow-x-auto pb-4 scrollbar-hide px-2">
              <div className="flex gap-4">
                  <div className="flex items-center gap-3 px-6 py-4 bg-green-100/50 rounded-2xl text-emerald-700 font-bold text-xs uppercase tracking-widest whitespace-nowrap border border-green-200/50 backdrop-blur-sm"><Wand2 size={16}/> Twist instantané :</div>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version Végétarienne")} className="px-6 py-4 bg-white border border-green-200 text-green-600 rounded-2xl text-xs font-black hover:bg-green-50 transition-all whitespace-nowrap uppercase tracking-widest shadow-sm">Vegan</button>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version Très Épicée")} className="px-6 py-4 bg-white border border-red-200 text-red-600 rounded-2xl text-xs font-black hover:bg-red-50 transition-all whitespace-nowrap uppercase tracking-widest shadow-sm">Épicé</button>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version adaptée aux Enfants")} className="px-6 py-4 bg-white border border-blue-200 text-blue-600 rounded-2xl text-xs font-black hover:bg-blue-50 transition-all whitespace-nowrap uppercase tracking-widest shadow-sm">Enfant</button>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version Express (-15 min)")} className="px-6 py-4 bg-white border border-yellow-200 text-yellow-700 rounded-2xl text-xs font-black hover:bg-yellow-50 transition-all whitespace-nowrap uppercase tracking-widest shadow-sm">Express</button>
              </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
              {/* 4. INGREDIENTS LIST */}
              <div className="md:col-span-4 space-y-8">
                 <div className="bg-white p-8 rounded-[2.5rem] border border-green-50 shadow-sm relative">
                     <h3 className="font-display text-3xl text-emerald-900 mb-6 border-b border-green-50 pb-4 flex justify-between items-center">
                         Marché
                         {checkedIngredients.size > 0 && (
                            <span className={`text-xs bg-chef-green text-white px-3 py-1 rounded-full font-bold shadow-md`}>{checkedIngredients.size}</span>
                         )}
                     </h3>
                     
                     <ul className="space-y-4">
                        {ingredientsList.map((line, idx) => {
                            const isChecked = checkedIngredients.has(idx);
                            const cleanText = line.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
                            const isServingLine = cleanText.toLowerCase().startsWith('pour ') && (cleanText.toLowerCase().includes('personne') || cleanText.toLowerCase().includes('convive'));
                            
                            if (isServingLine) return <li key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-green-50 border border-green-100"><PremiumUsers size={16} /><span className="text-sm font-black text-emerald-700/60 uppercase tracking-widest">{cleanText}</span></li>;

                            return (
                                <li 
                                    key={idx} 
                                    className={`flex items-start gap-4 p-4 rounded-2xl transition-all cursor-pointer group border ${isChecked ? 'bg-green-50 border-green-100 opacity-60' : 'bg-white border-transparent hover:border-green-100 hover:shadow-md'}`}
                                    onClick={() => toggleIngredientCheck(idx)}
                                >
                                    <div className={`mt-0.5 relative flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${isChecked ? 'bg-chef-green border-chef-green shadow-sm' : 'border-green-100 bg-white'}`}>
                                        {isChecked && <Check size={16} className="text-white" strokeWidth={4} />}
                                    </div>
                                    <span className={`text-lg leading-tight transition-all select-none flex-1 font-medium ${isChecked ? 'text-emerald-700/40 line-through' : 'text-emerald-900'}`}>{cleanText}</span>
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenDriveModal(cleanText); }} className="p-2 rounded-xl text-green-200 hover:text-blue-500 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"><PremiumShoppingCart size={18} /></button>
                                </li>
                            );
                        })}
                     </ul>

                     <button
                        onClick={handleAddSelectedToShoppingList}
                        disabled={checkedIngredients.size === 0 || addedToList}
                        className={`w-full mt-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all text-lg shadow-lg ${addedToList ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-emerald-900 text-white hover:bg-emerald-950 shadow-emerald-900/10 active:scale-95'}`}
                     >
                        {addedToList ? <><Check size={20} strokeWidth={3} /> Liste à jour !</> : <><PremiumPlus size={20} /> Ajouter à ma liste</>}
                     </button>
                 </div>
              </div>

              {/* 5. PREPARATION STEPS */}
              <div className="md:col-span-8 space-y-8">
                 <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-green-50 shadow-sm">
                     <h3 className="font-display text-4xl text-emerald-900 mb-10 border-b border-green-50 pb-6">Méthode & Dressage</h3>
                     <div className="space-y-12">
                         {instructionsList.map((step, idx) => {
                             const cleanStep = step.replace(/^\d+\.\s*/, '').replace(/[*_]/g, '');
                             return (
                                 <div key={idx} className="flex gap-6 group">
                                     <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-green-50 text-emerald-900 font-display text-2xl font-bold flex items-center justify-center mt-1 border border-green-100 transition-all group-hover:bg-chef-green group-hover:text-white group-hover:border-chef-green group-hover:shadow-lg group-hover:shadow-green-100">
                                         {idx + 1}
                                     </div>
                                     <div className="pt-1">
                                         <p className="text-emerald-800/80 leading-relaxed text-xl font-medium">{cleanStep}</p>
                                     </div>
                                 </div>
                             )
                         })}
                     </div>
                 </div>
              </div>
          </div>
        </div>
      )}

      {/* IMMERSIVE MODE OVERLAY */}
      {immersiveMode && (
        <div className="fixed inset-0 z-[100] bg-white text-emerald-900 flex flex-col immersive-enter">
            <div className="p-6 flex justify-between items-center border-b border-green-50">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-50 rounded-2xl"><PremiumChefHat size={28} /></div>
                    <span className="font-display text-2xl text-emerald-900">Pas à Pas Gourmand</span>
                </div>
                <button onClick={() => setImmersiveMode(false)} className="p-3 bg-green-50 rounded-full hover:bg-green-100 transition-colors border border-green-100 shadow-sm"><PremiumX size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center">
                <p className="text-emerald-700/40 font-black text-sm uppercase tracking-[0.2em] mb-6">Étape {currentStep + 1} sur {parsedSteps.length}</p>
                <div className="w-full max-w-3xl mb-10 aspect-video bg-green-50 rounded-[2.5rem] flex items-center justify-center overflow-hidden border border-green-100 relative shadow-2xl">
                    {videoLoading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="animate-spin text-chef-green mb-4" size={48} />
                            <span className="text-lg font-bold text-emerald-700/60 animate-pulse">L'IA prépare votre visuel...</span>
                        </div>
                    ) : stepVideo ? (
                        <video src={stepVideo} controls autoPlay loop className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-8">
                            <button 
                                onClick={handleGenerateVideo}
                                className="bg-white hover:bg-green-50 text-emerald-900 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 mx-auto transition-all border border-green-100 mb-8 shadow-lg hover:-translate-y-1"
                            >
                                <PremiumVideo size={24} /> 
                                <span className="font-display text-xl">Visualiser l'étape (IA)</span>
                            </button>
                            <div className="font-display text-2xl md:text-4xl text-emerald-700/30 leading-tight px-6 line-clamp-3 italic">
                                "{parsedSteps[currentStep]}"
                            </div>
                        </div>
                    )}
                </div>
                 <div className="font-medium text-2xl md:text-4xl leading-tight mb-24 px-8 text-center max-w-4xl text-emerald-900">
                     {parsedSteps[currentStep]}
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-6">
                 <div className="bg-white border border-green-100 rounded-[2rem] p-3 flex items-center justify-between shadow-2xl">
                    <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="p-6 rounded-2xl hover:bg-green-50 disabled:opacity-20 transition-all border border-transparent hover:border-green-100"><ChevronLeft size={36} /></button>
                    <button onClick={() => speakStep(parsedSteps[currentStep])} className="p-8 bg-emerald-900 text-white rounded-3xl shadow-xl hover:scale-110 transition-transform active:scale-95"><PremiumVolume size={40}/></button>
                    <button onClick={() => setCurrentStep(Math.min(parsedSteps.length - 1, currentStep + 1))} disabled={currentStep === parsedSteps.length - 1} className="p-6 rounded-2xl hover:bg-green-50 disabled:opacity-20 transition-all border border-transparent hover:border-green-100"><ChevronRight size={36} /></button>
                 </div>
            </div>
        </div>
      )}

      {/* DRIVE LOCATOR MODAL */}
      {showDriveModal && (
          <div className="fixed inset-0 z-[80] bg-emerald-950/40 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="bg-white rounded-[3rem] w-full max-w-md p-8 shadow-2xl relative animate-fade-in border border-white">
                  <button onClick={() => setShowDriveModal(false)} className="absolute top-6 right-6 p-2 hover:bg-green-50 rounded-full transition-colors border border-transparent hover:border-green-100"><PremiumX size={20} className="text-green-200"/></button>
                  <h3 className="font-display text-3xl text-emerald-900 mb-2">Choisir un Drive</h3>
                  <p className="text-sm text-emerald-700/60 mb-8 font-medium">Pour commander : <strong className="text-emerald-900">{selectedIngredientForDrive}</strong></p>
                  <div className="mb-8">
                      <label className="block text-[10px] font-black text-emerald-700/40 uppercase tracking-widest mb-3 flex items-center gap-2"><PremiumMapPin size={12} /> Localisation</label>
                      <input type="text" value={userCity} onChange={handleCityChange} placeholder="Ex: Lyon, Paris 15..." className="w-full p-4 bg-green-50 border border-green-100 rounded-2xl outline-none font-bold text-emerald-900 focus:bg-white focus:ring-4 focus:ring-emerald-50 transition-all"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      {supermarketBrands.map((brand) => (
                          <button key={brand.name} onClick={() => findDrive(brand.name)} className={`p-4 rounded-2xl text-white font-bold text-sm shadow-lg hover:scale-105 transition-all flex flex-col items-center justify-center gap-2 ${brand.color}`}>
                              <PremiumStore size={24} /> 
                              <span className="text-[10px] uppercase tracking-widest">{brand.name}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default RecipeCreator;
