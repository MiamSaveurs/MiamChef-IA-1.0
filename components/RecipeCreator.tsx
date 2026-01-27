
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
          <div className="relative w-16 h-16 flex items-center justify-center rounded-full mb-2 bg-[#161816] border border-white/10">
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                    background: `conic-gradient(${color} ${percentage}%, transparent 0)`,
                    maskImage: 'radial-gradient(transparent 55%, black 56%)',
                    WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)'
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-sm font-serif font-bold text-white">{value}g</span>
              </div>
          </div>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
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
    <div className="pb-32 px-4 pt-6 max-w-5xl mx-auto min-h-screen font-body text-white">
      
      {/* HEADER & INPUT SECTION */}
      <div className="print:hidden">
        <header className="mb-8 flex items-center gap-3">
            <div className={`p-3 rounded-full border border-white/10 ${chefMode === 'patisserie' ? 'bg-pink-500/10' : 'bg-chef-green/10'}`}>
                {chefMode === 'patisserie' ? <PremiumCake size={28}/> : <PremiumChefHat size={32} />}
            </div>
            <div>
            <h2 className={`text-3xl font-serif leading-none text-white`}>
                {chefMode === 'patisserie' ? 'Atelier Pâtisserie' : 'Atelier du Chef'}
            </h2>
            <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">
                {chefMode === 'patisserie' ? 'Précision & Gourmandise' : 'Cuisine & Improvisation'}
            </p>
            </div>
        </header>

        {/* DOUBLE CERVEAU SWITCH */}
        {!recipe && (
            <div className="bg-[#161816] p-1 rounded-2xl flex mb-6 mx-auto max-w-lg border border-white/10">
                <button
                    onClick={() => setChefMode('cuisine')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${chefMode === 'cuisine' ? 'bg-chef-green text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    <PremiumChefHat size={18} /> Cuisinier
                </button>
                <button
                    onClick={() => setChefMode('patisserie')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${chefMode === 'patisserie' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                         <PremiumCroissant size={16} /> Pâtissier
                    </div>
                </button>
            </div>
        )}

        {/* Mode Switcher */}
        {!recipe && (
        <div className="bg-[#161816]/50 p-1 rounded-xl flex mb-6 mx-auto max-w-md border border-white/5">
            <button
            onClick={() => { setMode('create'); setRecipe(''); setMetrics(null); setUtensils([]); setGeneratedImage(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                mode === 'create' ? `bg-white/10 text-white` : 'text-gray-500 hover:text-gray-300'
            }`}
            >
            <PremiumSparkles size={14} /> Créer
            </button>
            <button
            onClick={() => { setMode('search'); setRecipe(''); setMetrics(null); setUtensils([]); setGeneratedImage(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                mode === 'search' ? `bg-white/10 text-white` : 'text-gray-500 hover:text-gray-300'
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
                <div className="bg-[#161816] p-5 rounded-3xl border border-white/10">
                    <h3 className="font-bold text-gray-500 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <PremiumUsers size={12} /> Configuration
                    </h3>
                    <div className="space-y-4">
                        <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">{chefMode === 'patisserie' ? 'Gourmands' : 'Convives'}</label>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-10 h-10 bg-white/5 rounded-xl font-bold text-gray-400 hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5">-</button>
                            <span className="font-serif text-2xl text-white w-8 text-center">{people}</span>
                            <button onClick={() => setPeople(Math.min(12, people + 1))} className="w-10 h-10 bg-white/5 rounded-xl font-bold text-gray-400 hover:bg-white/10 transition-colors flex items-center justify-center border border-white/5">+</button>
                        </div>
                        </div>
                        {mode === 'create' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Diététique</label>
                                <div className="relative">
                                    <PremiumLeaf size={16} className="absolute top-3 left-3 pointer-events-none" />
                                    <select 
                                        className="w-full pl-9 pr-10 py-2.5 bg-[#0a0c0a] border border-white/10 rounded-xl text-sm appearance-none cursor-pointer outline-none font-medium text-gray-300"
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
                                        <option value="Hypocalorique">Hypocalorique (Régime)</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 flex items-center gap-2"><PremiumGlobe size={12}/> Voyage / Style</label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-3 py-2.5 bg-[#0a0c0a] border border-white/10 rounded-xl text-sm appearance-none cursor-pointer pr-10 outline-none font-medium text-gray-300"
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
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1">Moment</label>
                                <div className="relative">
                                    <PremiumTimer size={16} className="absolute top-3 left-3 pointer-events-none" />
                                    <select 
                                        className="w-full pl-9 pr-10 py-2.5 bg-[#0a0c0a] border border-white/10 rounded-xl text-sm appearance-none cursor-pointer outline-none font-medium text-gray-300"
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
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            {chefMode === 'cuisine' && (
                                <div 
                                    onClick={() => setIsBatchCooking(!isBatchCooking)}
                                    className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center gap-3 ${isBatchCooking ? 'border-chef-green/50 bg-chef-green/10' : 'border-white/10 bg-[#0a0c0a] hover:bg-white/5'}`}
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isBatchCooking ? 'bg-chef-green' : 'bg-gray-700'}`}>
                                        <Check size={14} className="text-white" />
                                    </div>
                                    <span className={`text-xs font-bold ${isBatchCooking ? 'text-chef-green' : 'text-gray-500'}`}><PremiumLayers size={12} className="inline mr-1"/> Batch Cooking</span>
                                </div>
                            )}
                        </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="md:col-span-2 space-y-6">
                <div className="bg-[#161816] p-6 rounded-[2rem] border border-white/10 relative">
                    {mode === 'create' ? (
                        <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className={`block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2`}>
                                {chefMode === 'patisserie' ? <PremiumWheat size={14}/> : <PremiumUtensils size={14}/>} 
                                Ingrédients & Envies
                            </label>
                            
                            <div className="flex items-center gap-2">
                                {isListening && listeningTarget === 'ingredients' && <span className="text-xs text-red-500 font-bold animate-pulse">En écoute...</span>}
                                <button 
                                    onClick={() => startListening('ingredients')}
                                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${
                                        isListening && listeningTarget === 'ingredients' 
                                        ? 'bg-red-500/20 text-red-500' 
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                                >
                                    {isListening && listeningTarget === 'ingredients' ? <><PremiumMicOff size={14} /> Stop</> : <><PremiumMic size={14} /> Dicter</>}
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <textarea 
                                className="w-full p-4 bg-[#0a0c0a] border border-white/10 rounded-2xl outline-none resize-none font-body text-white min-h-[140px] text-lg transition-all" 
                                placeholder={chefMode === 'patisserie' ? "Ex: J'ai de la farine et des pommes, je voudrais un gâteau moelleux..." : "Ex: J'ai du poulet, du riz, et j'aimerais un plat épicé..."} 
                                value={ingredients} 
                                onChange={(e) => setIngredients(e.target.value)} 
                            />
                        </div>
                        </div>
                    ) : (
                        <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className={`block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2`}><PremiumSearch size={14} /> Nom de la recette</label>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => startListening('search')}
                                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${
                                        isListening && listeningTarget === 'search' 
                                        ? 'bg-red-500/20 text-red-500' 
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                                >
                                    {isListening && listeningTarget === 'search' ? <><PremiumMicOff size={14} /> Stop</> : <><PremiumMic size={14} /> Dicter</>}
                                </button>
                            </div>
                        </div>
                        <div className="relative mb-3">
                            <input 
                                type="text" 
                                className="w-full p-4 bg-[#0a0c0a] border border-white/10 rounded-2xl outline-none font-body text-white text-lg font-bold transition-all" 
                                placeholder="Ex: Blanquette de veau..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} 
                            />
                        </div>

                        {/* AUTHENTIC VS ECONOMICAL TOGGLE */}
                        <div className="flex gap-2 p-1 bg-[#0a0c0a] rounded-xl border border-white/10">
                             <button
                                onClick={() => setSearchType('authentic')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                                    searchType === 'authentic' 
                                    ? 'bg-[#161816] text-yellow-500 shadow-sm border border-white/10' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                             >
                                 <PremiumMedal size={14} /> Authentique
                             </button>
                             <button
                                onClick={() => setSearchType('economical')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                                    searchType === 'economical' 
                                    ? 'bg-[#161816] text-chef-green shadow-sm border border-white/10' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                             >
                                 <PremiumEuro size={14} /> Économique
                             </button>
                        </div>
                        </div>
                    )}
                    <button onClick={handleGenerate} disabled={status === 'loading' || (mode === 'create' ? !ingredients : !searchQuery)} className="w-full mt-6 bg-white text-black font-display text-xl py-4 rounded-2xl shadow-glow hover:bg-gray-200 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:translate-y-0">
                        {status === 'loading' ? (<><Loader2 className="animate-spin" /> {loadingStep || 'Réflexion...'}</>) : (<>{mode === 'create' ? <PremiumSparkles size={20}/> : <PremiumSearch size={20}/>} {mode === 'create' ? (chefMode === 'patisserie' ? 'Créer le Dessert' : 'Créer le Plat') : 'Trouver la Recette'}</>)}
                    </button>
                </div>
            </div>
        </div>
        )}
      </div>

      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded-2xl text-center font-bold">
          Une erreur est survenue. Veuillez réessayer.
        </div>
      )}

      {/* RECIPE DISPLAY */}
      {recipe && (
        <div id="recipe-pdf-container" className="animate-fade-in mt-2 pb-10">
          
          {/* 1. HERO SECTION */}
          <div className="bg-[#161816] rounded-[2.5rem] shadow-card border border-white/10 overflow-hidden mb-6 relative group">
            <div className="w-full h-64 md:h-96 bg-[#0a0c0a] relative overflow-hidden">
                {imageStatus === 'loading' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0c0a] text-gray-500">
                        <Loader2 size={40} className={`animate-spin mb-3`} />
                        <span className="font-display text-lg">Préparation de la photo...</span>
                    </div>
                )}
                {generatedImage ? (
                    <>
                        <img src={generatedImage} alt="Plat final" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-4 right-4 z-10">
                             <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><PremiumSparkles size={12} /> MiamChef IA {currentYear}</div>
                        </div>
                    </>
                ) : imageStatus !== 'loading' && (
                     <div className="w-full h-full flex items-center justify-center bg-[#0a0c0a]">
                        <ImageIcon size={48} className="text-gray-700" />
                     </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6 md:p-10 pointer-events-none">
                    <h1 className="text-3xl md:text-5xl font-serif text-white mb-2 leading-tight drop-shadow-md">
                        {recipe.match(/^#\s+(.+)$/m)?.[1] || "Recette du Chef"}
                    </h1>
                </div>
            </div>

            <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4 bg-[#161816] border-t border-white/5">
                <button onClick={() => { setRecipe(''); setGeneratedImage(null); }} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors"><ChevronLeft size={24}/></button>
                <div className="flex gap-3">
                     <button onClick={startImmersiveMode} className="bg-chef-green text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-green-400 transition-colors shadow-glow">
                        <PremiumPlay size={16} className="text-black" /> <span className="hidden sm:inline">Cuisiner</span>
                     </button>
                     <button onClick={handleSaveToBook} disabled={isSaved} className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm border transition-colors ${isSaved ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'}`}>
                        {isSaved ? <Check size={18} /> : <GourmetBook size={18} />} {isSaved ? 'Enregistré' : 'Sauvegarder'}
                     </button>
                     <button onClick={handleDownloadPDF} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                        <PremiumDownload size={20} />
                     </button>
                </div>
            </div>
          </div>

          {/* 2. MACRO DASHBOARD */}
          {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#161816] p-5 rounded-3xl border border-white/10 flex flex-col justify-center items-center text-center md:col-span-1">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Calories</div>
                      <div className="text-3xl font-serif text-white">{metrics.caloriesPerPerson}</div>
                      <div className="text-xs text-gray-500">Kcal / personne</div>
                  </div>
                  <div className="bg-[#161816] p-5 rounded-3xl border border-white/10 md:col-span-3 grid grid-cols-3 items-center justify-items-center">
                       <MacroDonut value={metrics.proteins} label="Protéines" color="#3b82f6" total={metrics.proteins + metrics.carbohydrates + metrics.fats} />
                       <MacroDonut value={metrics.carbohydrates} label="Glucides" color="#eab308" total={metrics.proteins + metrics.carbohydrates + metrics.fats} />
                       <MacroDonut value={metrics.fats} label="Lipides" color="#ef4444" total={metrics.proteins + metrics.carbohydrates + metrics.fats} />
                  </div>
              </div>
          )}

          {/* 3. SMART TWISTS */}
          <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide px-1">
              <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl text-gray-400 font-bold text-xs uppercase tracking-wide whitespace-nowrap border border-white/5"><Wand2 size={14}/> Adapter :</div>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version Végétarienne")} className="px-4 py-3 bg-[#161816] border border-green-500/30 text-green-400 rounded-xl text-xs font-bold hover:bg-green-900/10 transition-colors whitespace-nowrap uppercase tracking-wider">Vegan</button>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version Très Épicée")} className="px-4 py-3 bg-[#161816] border border-red-500/30 text-red-400 rounded-xl text-xs font-bold hover:bg-red-900/10 transition-colors whitespace-nowrap uppercase tracking-wider">Épicé</button>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version adaptée aux Enfants")} className="px-4 py-3 bg-[#161816] border border-blue-500/30 text-blue-400 rounded-xl text-xs font-bold hover:bg-blue-900/10 transition-colors whitespace-nowrap uppercase tracking-wider">Enfant</button>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version Express (-15 min)")} className="px-4 py-3 bg-[#161816] border border-yellow-500/30 text-yellow-400 rounded-xl text-xs font-bold hover:bg-yellow-900/10 transition-colors whitespace-nowrap uppercase tracking-wider">Express</button>
              </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
              {/* 4. INGREDIENTS LIST & UTENSILS */}
              <div className="md:col-span-4 space-y-6">
                 <div className="bg-[#161816] p-6 rounded-[2rem] border border-white/10 relative">
                     <h3 className="font-serif text-2xl text-white mb-4 border-b border-white/10 pb-2 flex justify-between items-center">
                         Ingrédients
                         {checkedIngredients.size > 0 && (
                            <span className={`text-xs bg-chef-green text-black px-2 py-1 rounded-full font-bold`}>{checkedIngredients.size}</span>
                         )}
                     </h3>
                     
                     <ul className="space-y-3">
                        {ingredientsList.map((line, idx) => {
                            const isChecked = checkedIngredients.has(idx);
                            const cleanText = line.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
                            const isServingLine = cleanText.toLowerCase().startsWith('pour ') && (cleanText.toLowerCase().includes('personne') || cleanText.toLowerCase().includes('convive'));
                            
                            if (isServingLine) return <li key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-white/5"><PremiumUsers size={14} /><span className="text-sm font-bold text-gray-300">{cleanText}</span></li>;

                            return (
                                <li 
                                    key={idx} 
                                    className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer group ${isChecked ? 'bg-white/5 opacity-50' : 'hover:bg-white/5'}`}
                                    onClick={() => toggleIngredientCheck(idx)}
                                >
                                    <div className={`mt-0.5 relative flex-shrink-0 w-5 h-5 rounded border transition-all flex items-center justify-center ${isChecked ? 'bg-chef-green border-chef-green' : 'border-gray-600 bg-transparent'}`}>
                                        {isChecked && <Check size={12} className="text-black" strokeWidth={3} />}
                                    </div>
                                    <span className={`text-base leading-tight transition-all select-none flex-1 ${isChecked ? 'text-gray-500 line-through' : 'text-gray-200'}`}>{cleanText}</span>
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenDriveModal(cleanText); }} className="p-2 rounded-full text-gray-500 hover:text-blue-400 hover:bg-blue-900/20 transition-colors opacity-0 group-hover:opacity-100"><PremiumShoppingCart size={16} /></button>
                                </li>
                            );
                        })}
                     </ul>

                     <button
                        onClick={handleAddSelectedToShoppingList}
                        disabled={checkedIngredients.size === 0 || addedToList}
                        className={`w-full mt-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${addedToList ? 'bg-green-900/20 text-green-400 border border-green-500/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                     >
                        {addedToList ? <><Check size={18} /> Ajouté !</> : <><PremiumPlus size={18} /> Ajouter à ma liste</>}
                     </button>
                 </div>
              </div>

              {/* 5. PREPARATION STEPS */}
              <div className="md:col-span-8 space-y-6">
                 <div className="bg-[#161816] p-8 rounded-[2rem] border border-white/10">
                     <h3 className="font-serif text-2xl text-white mb-6 border-b border-white/10 pb-2">Préparation</h3>
                     <div className="space-y-8">
                         {instructionsList.map((step, idx) => {
                             const cleanStep = step.replace(/^\d+\.\s*/, '').replace(/[*_]/g, '');
                             return (
                                 <div key={idx} className="flex gap-4">
                                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chef-green text-black font-serif text-lg font-bold flex items-center justify-center mt-1 shadow-glow">
                                         {idx + 1}
                                     </div>
                                     <div className="pt-1">
                                         <p className="text-gray-300 leading-relaxed text-lg">{cleanStep}</p>
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
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md text-white flex flex-col immersive-enter">
            <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/10 rounded-lg"><PremiumChefHat size={24} /></div>
                    <span className="font-display text-xl">Mode Cuisine</span>
                </div>
                <button onClick={() => setImmersiveMode(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><PremiumX size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-4">Étape {currentStep + 1} / {parsedSteps.length}</p>
                <div className="w-full max-w-2xl mb-6 aspect-video bg-[#1a1c1a] rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 relative shadow-2xl">
                    {videoLoading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="animate-spin text-white mb-2" size={40} />
                            <span className="text-sm font-bold animate-pulse">Génération vidéo...</span>
                        </div>
                    ) : stepVideo ? (
                        <video src={stepVideo} controls autoPlay loop className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <button 
                                onClick={handleGenerateVideo}
                                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 mx-auto transition-all border border-white/20 mb-4"
                            >
                                <PremiumVideo size={20} /> 
                                <span>Voir l'étape (IA)</span>
                            </button>
                            <div className="font-display text-2xl md:text-3xl leading-tight px-4 line-clamp-4">
                                {parsedSteps[currentStep]}
                            </div>
                        </div>
                    )}
                </div>
                 <div className="font-display text-xl md:text-2xl leading-tight mb-20 px-4 text-center max-w-3xl">
                     {parsedSteps[currentStep]}
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4">
                 <div className="bg-[#1a1c1a] border border-white/10 rounded-2xl p-2 flex items-center justify-between shadow-2xl">
                    <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="p-4 rounded-xl hover:bg-white/10 disabled:opacity-30 transition-colors"><ChevronLeft size={28} /></button>
                    <button onClick={() => speakStep(parsedSteps[currentStep])} className="p-4 bg-chef-green text-black rounded-xl shadow-lg hover:scale-105 transition-transform"><PremiumVolume size={28}/></button>
                    <button onClick={() => setCurrentStep(Math.min(parsedSteps.length - 1, currentStep + 1))} disabled={currentStep === parsedSteps.length - 1} className="p-4 rounded-xl hover:bg-white/10 disabled:opacity-30 transition-colors"><ChevronRight size={28} /></button>
                 </div>
            </div>
        </div>
      )}

      {/* DRIVE LOCATOR MODAL */}
      {showDriveModal && (
          <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#161816] rounded-[2rem] w-full max-w-md p-6 shadow-2xl relative animate-fade-in border border-white/20">
                  <button onClick={() => setShowDriveModal(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"><PremiumX size={20} className="text-gray-500 hover:text-white"/></button>
                  <h3 className="font-serif text-2xl text-white mb-1">Trouver un Drive</h3>
                  <p className="text-sm text-gray-400 mb-6">Pour acheter : <strong className="text-white">{selectedIngredientForDrive}</strong></p>
                  <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1"><PremiumMapPin size={12} /> Votre Ville</label>
                      <input type="text" value={userCity} onChange={handleCityChange} placeholder="Ex: Lyon, Paris 15..." className="w-full p-3 bg-[#0a0c0a] border border-white/10 rounded-xl outline-none font-bold text-white"/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      {supermarketBrands.map((brand) => (
                          <button key={brand.name} onClick={() => findDrive(brand.name)} className={`p-3 rounded-xl text-white font-bold text-sm shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2 ${brand.color}`}><PremiumStore size={16} /> {brand.name}</button>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default RecipeCreator;
