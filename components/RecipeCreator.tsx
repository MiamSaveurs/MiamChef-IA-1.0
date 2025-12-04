import React, { useState, useEffect, useRef } from 'react';
import { generateChefRecipe, searchChefsRecipe, generateRecipeImage, modifyChefRecipe, generateStepVideo } from '../services/geminiService';
import { saveRecipeToBook, addToShoppingList } from '../services/storageService';
import { LoadingState, GroundingChunk, RecipeMetrics } from '../types';
import { ChefHat, Utensils, Users, Leaf, Loader2, Sparkles, Search, ExternalLink, Download, Clock, Info, Euro, Activity, Droplet, Wheat, Dumbbell, Book, Check, Image as ImageIcon, Wand2, Play, X, ChevronRight, ChevronLeft, Volume2, Flame, Baby, Vegan, Soup, Hammer, Scissors, Video, Square, CheckSquare, BarChart, ShoppingCart, ShoppingBag, Plus, Globe2, Layers, ShieldAlert, ChevronDown, MapPin, Store, Mic, MicOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// VOTRE TAG PARTENAIRE AMAZON OFFICIEL
const AMAZON_TAG = 'miamsaveurs-21';

// DRIVE / SUPERMARKET LOGIC
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

const MacroDonut = ({ value, label, color, total }: { value: number, label: string, color: string, total: number }) => {
  // Approx percentage calculation for visual loop
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
      <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 flex items-center justify-center rounded-full mb-2" 
               style={{ background: `conic-gradient(${color} ${percentage}%, #e5e7eb 0)` }}>
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                 <span className="text-sm font-bold text-gray-700">{value}g</span>
              </div>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
  )
};

const RecipeCreator: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'search'>('create');
  
  // Creation state
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [cuisineStyle, setCuisineStyle] = useState('Bistrot Français'); // New: Cultural Style
  const [isBatchCooking, setIsBatchCooking] = useState(false); // New: Batch Cooking
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);

  // Shared state
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

  // Ingredient Checklist State
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  // Image Generation State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState<LoadingState>('idle');

  // Immersive Mode State
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [parsedSteps, setParsedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepVideo, setStepVideo] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // Drive Locator State
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [userCity, setUserCity] = useState(localStorage.getItem('miamchef_city') || '');
  const [selectedIngredientForDrive, setSelectedIngredientForDrive] = useState('');

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [listeningTarget, setListeningTarget] = useState<'ingredients' | 'search' | null>(null);

  // Effect to cycle through loading messages
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'loading') {
      // Don't overwrite text if we are twisting
      if (isTwistingRef.current) return;

      const steps = mode === 'create' 
        ? ["Analyse des ingrédients...", "Invention de la recette...", "Adaptation culturelle...", "Calculs nutritionnels...", "Choix des ustensiles...", "Astuces du Chef...", "Finalisation..."]
        : ["Recherche sur le web...", "Adaptation MiamChef...", "Analyse diététique...", "Calcul du prix...", "Finalisation..."];
      
      let i = 0;
      setLoadingStep(steps[0]);
      
      interval = setInterval(() => {
        i = (i + 1);
        if (i < steps.length) {
             setLoadingStep(steps[i]);
        }
      }, 2500); // Change text every 2.5s
    } else {
        isTwistingRef.current = false;
    }
    return () => clearInterval(interval);
  }, [status, mode]);

  const handleGenerate = async () => {
    // FORCE BUTTON UNLOCK if key is missing or something goes wrong, we want to try anyway
    // Use try/catch to display alerts if it fails
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
    setCheckedIngredients(new Set()); // Reset checks

    try {
      let result;
      if (mode === 'create') {
        result = await generateChefRecipe(ingredients, people, dietary, mealTime, cuisineStyle, isBatchCooking);
      } else {
        result = await searchChefsRecipe(searchQuery, people);
      }
      
      setRecipe(result.text);
      setMetrics(result.metrics || null);
      setUtensils(result.utensils || []);
      setSeoData({title: result.seoTitle, description: result.seoDescription});
      if (mode === 'search') setSources(result.groundingChunks || []);
      
      setStatus('success');

      // Trigger Image Generation
      triggerImageGeneration(result.text, mode === 'create' ? `${ingredients} style ${cuisineStyle}` : searchQuery);

    } catch (e: any) {
      console.error(e);
      setStatus('error');
      // Visual feedback if API key issue suspected
      alert(`Erreur lors de la génération. Vérifiez votre connexion ou la clé API.\nDétails: ${e.message}`);
    }
  };

  const handleSmartTwist = async (twist: string) => {
    if (!recipe) return;
    
    isTwistingRef.current = true;
    setStatus('loading');
    setLoadingStep(`Application du Twist : ${twist}...`);
    setCheckedIngredients(new Set()); // Reset checks on twist
    
    try {
        const result = await modifyChefRecipe(recipe, twist);
        setRecipe(result.text);
        setMetrics(result.metrics || null);
        setUtensils(result.utensils || []);
        setSeoData({title: result.seoTitle, description: result.seoDescription});
        setStatus('success');
    } catch (e) {
        setStatus('error');
    }
  };

  const triggerImageGeneration = async (recipeText: string, context: string) => {
    setImageStatus('loading');
    try {
      const titleMatch = recipeText.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : (mode === 'search' ? searchQuery : 'Plat Gastronomique');
      
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
      filename:     `miamchef-recette-${new Date().toISOString().slice(0, 10)}.pdf`,
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
    // Robust parsing for steps
    const lines = recipe.split('\n');
    const steps: string[] = [];
    let isCapture = false;
    
    for (const line of lines) {
        // More flexible regex to detect Preparation/Instructions header (case insensitive)
        if (line.match(/^#+\s*(Préparation|Instructions|Étapes|Recette|Méthode)/i)) {
            isCapture = true;
            continue;
        }
        if (isCapture) {
             // Stop capturing if we hit a new major header (Level 1 or 2)
             if (line.match(/^#{1,2}\s/)) isCapture = false;
             else if (line.trim().length > 5) {
                 const cleanLine = line.replace(/[*_]/g, '').trim();
                 // Remove list numbers or bullets
                 const finalLine = cleanLine.replace(/^(\d+\.|-)\s*/, '');
                 if (finalLine.length > 3) steps.push(finalLine);
             }
        }
    }

    if (steps.length === 0) {
        steps.push("Lisez bien la recette avant de commencer.");
        // Fallback: try to grab non-empty paragraphs from the middle
        const paragraphs = recipe.split('\n\n').filter(p => p.length > 20 && !p.startsWith('#')).map(p => p.replace(/[*_#]/g, '').trim());
        if(paragraphs.length > 0) steps.push(...paragraphs.slice(1));
    }

    setParsedSteps(steps);
    setCurrentStep(0);
    setStepVideo(null); // Reset video
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
        setStepVideo(null); // Clear previous video when step changes
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
          // Fallback UI or toast could go here
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

  // Helper to extract Ingredients and Instructions from markdown specifically for display
  const getRecipeSection = (type: 'ingredients' | 'instructions') => {
      const lines = recipe.split('\n');
      let capture = false;
      const content: string[] = [];
      for (const line of lines) {
          const lower = line.toLowerCase();
          const trimmed = line.trim();
          
          // Detect Start with Flexible matching
          if (!capture) {
             // Look for header lines specifically
             if (type === 'ingredients' && (lower.includes('ingrédients') || lower.includes('courses')) && trimmed.startsWith('#')) {
                 capture = true; continue;
             }
             if (type === 'instructions' && (lower.includes('préparation') || lower.includes('étapes') || lower.includes('instructions')) && trimmed.startsWith('#')) {
                 capture = true; continue;
             }
             continue;
          }
          
          // Detect End (Next Main Header)
          if (capture) {
              // Stop only if we hit a Level 1 or Level 2 header, which usually denotes a new main section (e.g., ## Dressage)
              // We ALLOW Level 3 (###) headers as they often denote steps.
              if (trimmed.match(/^#{1,2}\s/)) { capture = false; break; }
              
              if (trimmed.length > 2) content.push(line);
          }
      }
      return content;
  }

  const ingredientsList = getRecipeSection('ingredients');
  const instructionsList = getRecipeSection('instructions');

  // CLEANING FUNCTION FOR INGREDIENTS
  const cleanIngredientName = (text: string) => {
      // 1. Remove Markdown (*, -, etc)
      let clean = text.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
      
      // 2. Remove anything inside parentheses (Quantity is now usually here due to prompt)
      // Ex: "Beurre doux (40g)" -> "Beurre doux"
      clean = clean.replace(/\s*\(.*?\)/g, '');

      // 3. Robust clean of leading numbers/units IF user didn't follow prompt
      // Ex: "40g de beurre" -> "beurre"
      clean = clean.replace(/^[\d\s.,/]+(g|kg|ml|cl|l|mg|c\.à\.s|c\.à\.c|cuillères?|tranches?|morceaux?|bottes?|sachets?|boites?|pots?|verres?|tasses?|pincées?|têtes?|gousses?|feuilles?|brins?|filets?|pavés?|escalopes?|poignées?)?(\s+(d'|de|du|des)\s+)?/i, '');
      
      // 4. Cleanup trailing numbers if any left
      clean = clean.replace(/^\d+\s+/, '').trim();
      
      // 5. Capitalize
      return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  const handleAddSelectedToShoppingList = async () => {
      if (checkedIngredients.size === 0) return;
      
      const selectedItems: string[] = [];
      ingredientsList.forEach((line, idx) => {
          if (checkedIngredients.has(idx)) {
              const cleanText = cleanIngredientName(line);
              
              // Do not add servings lines
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
      // Use strict cleaning for modal
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
      // Open Google Maps search for the Drive in the user's city
      const query = `Drive ${brandName} ${userCity}`;
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
  };

  // VOICE INPUT LOGIC - REINFORCED
  const startListening = (target: 'ingredients' | 'search') => {
      // Compatibility check
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
          alert("Désolé, votre navigateur ne supporte pas la reconnaissance vocale native. Essayez avec Chrome sur Android ou Desktop.");
          return;
      }

      try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'fr-FR';
          recognition.continuous = false;
          recognition.interimResults = false;

          recognition.onstart = () => {
              setListeningTarget(target);
              setIsListening(true);
          };

          recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              if (target === 'ingredients') {
                  setIngredients(prev => {
                      const spacer = prev.trim().length > 0 ? ' ' : '';
                      return prev + spacer + transcript;
                  });
              } else {
                  setSearchQuery(transcript);
              }
          };

          recognition.onerror = (event: any) => {
              console.error("Speech Recognition Error", event.error);
              setIsListening(false);
              setListeningTarget(null);
              if (event.error === 'not-allowed') {
                  alert("Accès au micro refusé. Veuillez vérifier les permissions de votre navigateur (Cadenas à côté de l'URL).");
              } else if (event.error === 'network') {
                  alert("Erreur réseau : La reconnaissance vocale nécessite une connexion internet et un site sécurisé (HTTPS).");
              }
          };

          recognition.onend = () => {
              setIsListening(false);
              setListeningTarget(null);
          };

          recognition.start();
      } catch (e) {
          console.error("Speech Start Error", e);
          alert("Impossible de démarrer le micro.");
      }
  };

  return (
    <div className="pb-32 px-4 pt-6 max-w-5xl mx-auto min-h-screen font-body">
      
      {/* HEADER & INPUT SECTION (Hidden when printing) */}
      <div className="print:hidden">
        <header className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-2xl">
            <ChefHat className="text-chef-green" size={28} />
            </div>
            <div>
            <h2 className="text-3xl font-display text-chef-dark leading-none">Atelier du Chef</h2>
            <p className="text-gray-500 text-sm font-body">
                Vos Créations Uniques
            </p>
            </div>
        </header>

        {/* Mode Switcher */}
        {!recipe && (
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex mb-6 mx-auto max-w-md">
            <button
            onClick={() => { setMode('create'); setRecipe(''); setMetrics(null); setUtensils([]); setGeneratedImage(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'create' ? 'bg-chef-green text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
            >
            <Sparkles size={16} /> Créer
            </button>
            <button
            onClick={() => { setMode('search'); setRecipe(''); setMetrics(null); setUtensils([]); setGeneratedImage(null); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'search' ? 'bg-chef-green text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
            >
            <Search size={16} /> Rechercher
            </button>
        </div>
        )}

        {/* INPUT FORM (Collapsed when recipe exists) */}
        {!recipe && (
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
            {/* Configuration */}
            <div className="md:col-span-1 space-y-4">
                <div className="bg-white p-5 rounded-3xl shadow-card border border-gray-100">
                    <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Users size={14} /> Configuration
                    </h3>
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-bold text-chef-dark mb-1">Convives</label>
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1 border border-gray-200">
                            <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-chef-green font-bold hover:bg-gray-50">-</button>
                            <span className="font-display text-xl text-chef-dark w-8 text-center">{people}</span>
                            <button onClick={() => setPeople(Math.min(12, people + 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-chef-green font-bold hover:bg-gray-50">+</button>
                        </div>
                        </div>
                        {mode === 'create' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-chef-dark mb-1">Diététique</label>
                                <div className="relative">
                                    <Leaf size={16} className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
                                    <select 
                                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chef-green text-sm appearance-none cursor-pointer"
                                        value={dietary}
                                        onChange={(e) => setDietary(e.target.value)}
                                    >
                                        <option value="">Classique (Aucun)</option>
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
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            
                            {/* Cultural Style Selector with Chevron */}
                            <div>
                                <label className="block text-sm font-bold text-chef-dark mb-1 flex items-center gap-2"><Globe2 size={14} className="text-blue-500"/> Voyage / Style</label>
                                <div className="relative">
                                    <select 
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chef-green text-sm appearance-none cursor-pointer pr-10"
                                        value={cuisineStyle}
                                        onChange={(e) => setCuisineStyle(e.target.value)}
                                    >
                                        <option value="Bistrot Français">🇫🇷 Bistrot Français</option>
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
                                <label className="block text-sm font-bold text-chef-dark mb-1">Moment du repas</label>
                                <div className="relative">
                                    <Clock size={16} className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
                                    <select 
                                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-chef-green text-sm appearance-none cursor-pointer"
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
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Batch Cooking Toggle */}
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                                <div 
                                    onClick={() => setIsBatchCooking(!isBatchCooking)}
                                    className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${isBatchCooking ? 'bg-blue-600 border-blue-600' : 'bg-white border-blue-300'}`}
                                >
                                    {isBatchCooking && <Check size={14} className="text-white" />}
                                </div>
                                <div onClick={() => setIsBatchCooking(!isBatchCooking)} className="cursor-pointer">
                                    <span className="block text-xs font-bold text-blue-800 flex items-center gap-1"><Layers size={12}/> Batch Cooking</span>
                                    <span className="block text-[10px] text-blue-600">Cuisiner pour la semaine</span>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-card border border-gray-100 relative">
                    {mode === 'create' ? (
                        <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-bold text-chef-dark flex items-center gap-2"><Utensils size={18} className="text-chef-green" /> Ingrédients Disponibles</label>
                            {isListening && listeningTarget === 'ingredients' && <span className="text-xs text-red-500 font-bold animate-pulse">En écoute...</span>}
                        </div>
                        <div className="relative">
                            <textarea 
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-chef-green focus:bg-white outline-none resize-none font-body transition-all min-h-[140px]" 
                                placeholder="Ex: J'ai du poulet, deux courgettes un peu tristes, de la crème et du citron..." 
                                value={ingredients} 
                                onChange={(e) => setIngredients(e.target.value)} 
                            />
                            {/* MIC BUTTON FOR INGREDIENTS */}
                            <button 
                                onClick={() => startListening('ingredients')}
                                className={`absolute bottom-3 right-3 px-4 py-2 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm font-bold ${
                                    isListening && listeningTarget === 'ingredients' 
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : 'bg-chef-green text-white hover:bg-green-600'
                                }`}
                                title="Dicter les ingrédients"
                            >
                                {isListening && listeningTarget === 'ingredients' ? <><MicOff size={16} /> Stop</> : <><Mic size={16} /> Dicter</>}
                            </button>
                        </div>
                        </div>
                    ) : (
                        <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-bold text-chef-dark flex items-center gap-2"><Search size={18} className="text-chef-green" /> Nom de la recette</label>
                            {isListening && listeningTarget === 'search' && <span className="text-xs text-red-500 font-bold animate-pulse">En écoute...</span>}
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                className="w-full p-4 pr-32 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-chef-green focus:bg-white outline-none font-body transition-all" 
                                placeholder="Ex: Blanquette de veau, Risotto aux champignons..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} 
                            />
                            {/* MIC BUTTON FOR SEARCH */}
                            <button 
                                onClick={() => startListening('search')}
                                className={`absolute top-1/2 -translate-y-1/2 right-2 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-xs font-bold ${
                                    isListening && listeningTarget === 'search' 
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : 'bg-chef-green text-white hover:bg-green-600'
                                }`}
                                title="Dicter la recherche"
                            >
                                {isListening && listeningTarget === 'search' ? <><MicOff size={14} /> Stop</> : <><Mic size={14} /> Dicter</>}
                            </button>
                        </div>
                        </div>
                    )}
                    <button onClick={handleGenerate} disabled={status === 'loading' || (mode === 'create' ? !ingredients : !searchQuery)} className="w-full mt-4 bg-chef-green text-white font-display text-xl py-3 rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none min-h-[56px]">
                        {status === 'loading' ? (<><Loader2 className="animate-spin" /> {loadingStep || 'Réflexion...'}</>) : (<>{mode === 'create' ? <Sparkles size={20} /> : <Search size={20} />} {mode === 'create' ? 'Création de la recette' : 'Trouver la Recette'}</>)}
                    </button>
                </div>
            </div>
        </div>
        )}
      </div>

      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-center font-bold">
          Une erreur est survenue en cuisine. Veuillez réessayer.
        </div>
      )}

      {/* RECIPE DISPLAY */}
      {recipe && (
        <div id="recipe-pdf-container" className="animate-fade-in mt-2 pb-10">
          
          {/* 1. HERO SECTION: Image & Title */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-6 relative">
            {/* Image (Generated or Loading) */}
            <div className="w-full h-64 md:h-96 bg-gray-100 relative group">
                {imageStatus === 'loading' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                        <Loader2 size={40} className="animate-spin text-chef-green mb-3" />
                        <span className="font-display text-lg">Préparation de la photo...</span>
                    </div>
                )}
                {generatedImage ? (
                    <>
                        <img src={generatedImage} alt="Plat final" className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 right-4 z-10">
                             <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Sparkles size={12} className="text-chef-green" /> MiamSaveurs</div>
                        </div>
                    </>
                ) : imageStatus !== 'loading' && (
                     <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ImageIcon size={48} className="text-gray-300" />
                     </div>
                )}
                
                {/* Overlay Title on Image (Desktop) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 md:p-10 pointer-events-none">
                    <h1 className="text-3xl md:text-5xl font-display text-white mb-2 leading-tight drop-shadow-md">
                        {recipe.match(/^#\s+(.+)$/m)?.[1] || "Recette du Chef"}
                    </h1>
                </div>
            </div>

            {/* Metrics Bar (Moved below image) */}
            <div className="px-6 py-4 bg-white border-b border-gray-50 flex flex-wrap items-center gap-3 text-sm font-bold">
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 border border-gray-200"><Clock size={16}/> 25 min</span>
                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 border border-gray-200"><Euro size={16}/> {metrics?.pricePerPerson} / pers</span>
                {metrics && (
                  <>
                    <span className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border ${metrics.nutriScore === 'A' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'}`}>Nutri-Score {metrics.nutriScore}</span>
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg flex items-center gap-2 border border-purple-200"><BarChart size={16}/> {metrics.difficulty || 'Moyen'}</span>
                  </>
                )}
            </div>
            
            {/* Action Bar */}
            <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4 bg-white">
                <button onClick={() => { setRecipe(''); setGeneratedImage(null); }} className="text-gray-400 hover:text-chef-dark flex items-center gap-2 text-sm font-bold"><ChevronLeft size={16}/> Retour</button>
                <div className="flex gap-2">
                     <button onClick={startImmersiveMode} className="bg-chef-green text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-600 transition-colors">
                        <Play size={16} fill="white" /> <span className="hidden sm:inline">Cuisiner (Immersif)</span>
                     </button>
                     <button onClick={handleSaveToBook} disabled={isSaved} className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl transition-colors border ${isSaved ? 'bg-green-50 text-green-700 border-green-200' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                        {isSaved ? <Check size={18} /> : <Book size={18} />} {isSaved ? 'Enregistré' : 'Ajouter à mon carnet'}
                     </button>
                     <button onClick={handleDownloadPDF} className="flex items-center gap-2 text-gray-600 hover:text-chef-green font-bold text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-green-50 transition-colors">
                        <Download size={18} />
                     </button>
                </div>
            </div>
          </div>

          {/* 2. MACRO DASHBOARD (Donut Charts) */}
          {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-5 rounded-3xl shadow-soft border border-gray-100 flex flex-col justify-center items-center text-center md:col-span-1">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Calories</div>
                      <div className="text-3xl font-display text-chef-dark">{metrics.caloriesPerPerson}</div>
                      <div className="text-xs text-gray-400">Kcal / personne</div>
                      {/* Safety Disclaimer */}
                      <div className="mt-3 flex items-center gap-1 text-[9px] text-gray-400 bg-gray-50 px-2 py-1 rounded">
                          <ShieldAlert size={10} /> Données indicatives (IA)
                      </div>
                  </div>
                  <div className="bg-white p-5 rounded-3xl shadow-soft border border-gray-100 md:col-span-3 grid grid-cols-3 items-center justify-items-center">
                       <MacroDonut value={metrics.proteins} label="Protéines" color="#3b82f6" total={metrics.proteins + metrics.carbohydrates + metrics.fats} />
                       <MacroDonut value={metrics.carbohydrates} label="Glucides" color="#eab308" total={metrics.proteins + metrics.carbohydrates + metrics.fats} />
                       <MacroDonut value={metrics.fats} label="Lipides" color="#ef4444" total={metrics.proteins + metrics.carbohydrates + metrics.fats} />
                  </div>
              </div>
          )}

          {/* 3. SMART TWISTS (Horizontal Scroll) */}
          <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-500 font-bold text-xs uppercase tracking-wide whitespace-nowrap"><Wand2 size={14}/> Adapter la recette :</div>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version Végétarienne")} className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 bg-white border border-gray-200 text-gray-700 hover:border-green-300 hover:text-green-700 hover:bg-green-50">Vegan</button>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version Très Épicée")} className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50">Épicé</button>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version adaptée aux Enfants")} className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50">Enfant</button>
                  <button disabled={status === 'loading'} onClick={() => handleSmartTwist("Version Express (-15 min)")} className="px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 bg-white border border-gray-200 text-gray-700 hover:border-yellow-300 hover:text-yellow-700 hover:bg-yellow-50">Express</button>
              </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
              {/* 4. INGREDIENTS LIST & UTENSILS (Left Column) */}
              <div className="md:col-span-4 space-y-6">
                 
                 {/* UTENSILS SECTION - AMAZON AFFILIATE INTEGRATION */}
                 {utensils && utensils.length > 0 && (
                    <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 right-0 bg-orange-100/50 text-orange-800 text-[9px] px-2 py-1 rounded-bl-lg font-bold">
                            Liens partenaires
                         </div>
                         <h3 className="font-display text-xl text-orange-800 mb-4 flex items-center gap-2">
                             <Soup size={20}/> Ustensiles
                         </h3>
                         <div className="flex flex-col gap-2">
                             {utensils.map((utensil, idx) => (
                                 <a 
                                    key={idx} 
                                    href={`https://www.amazon.fr/s?k=${encodeURIComponent(utensil)}&tag=${AMAZON_TAG}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-orange-700 px-3 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center justify-between border border-orange-100 hover:shadow-md hover:border-orange-300 transition-all group"
                                 >
                                    <div className="flex items-center gap-2">
                                        <Hammer size={12} className="opacity-50" />
                                        {utensil}
                                    </div>
                                    <ShoppingBag size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
                                 </a>
                             ))}
                         </div>
                         <p className="text-[10px] text-orange-400 mt-3 text-center leading-tight">
                            En tant que Partenaire Amazon, MiamChef IA réalise un bénéfice sur les achats remplissant les conditions requises. <strong>Cela ne change absolument rien au prix pour vous.</strong>
                         </p>
                    </div>
                 )}

                 <div className="bg-white p-6 rounded-[2rem] shadow-card border border-gray-100">
                     <h3 className="font-display text-2xl text-chef-dark mb-4 border-b border-gray-100 pb-2 flex justify-between items-center">
                         Ingrédients
                         {checkedIngredients.size > 0 && (
                            <span className="text-xs bg-chef-green text-white px-2 py-1 rounded-full">{checkedIngredients.size}</span>
                         )}
                     </h3>
                     <p className="text-xs text-gray-400 mb-3 italic">Sélectionnez les ingrédients manquants pour les ajouter à votre liste.</p>
                     
                     <ul className="space-y-3">
                        {ingredientsList.map((line, idx) => {
                            const isChecked = checkedIngredients.has(idx);
                            // Cleanup: Remove bullets, markdown bold/italic
                            const cleanText = line.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '').trim();
                            
                            // Check if this line is a serving indication
                            const isServingLine = cleanText.toLowerCase().startsWith('pour ') && (cleanText.toLowerCase().includes('personne') || cleanText.toLowerCase().includes('convive'));
                            
                            if (isServingLine) {
                                return (
                                    <li key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50">
                                        <div className="mt-1 min-w-[20px] h-[20px] flex items-center justify-center">
                                            <Users size={14} className="text-chef-green" />
                                        </div>
                                        <span className="text-sm font-bold text-chef-dark flex-1">
                                            {cleanText}
                                        </span>
                                        <div className="w-[28px]"></div> {/* Spacer for alignment */}
                                    </li>
                                );
                            }

                            // Using the new Drive Modal instead of direct Shopping Link
                            return (
                                <li 
                                    key={idx} 
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors group ${isChecked ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                                >
                                    <div 
                                        onClick={() => toggleIngredientCheck(idx)}
                                        className={`cursor-pointer mt-1 min-w-[20px] h-[20px] rounded border transition-colors flex items-center justify-center ${isChecked ? 'bg-chef-green border-chef-green' : 'border-gray-300 bg-white group-hover:border-chef-green'}`}
                                    >
                                        {isChecked && <Check size={14} className="text-white" />}
                                    </div>
                                    <span 
                                        onClick={() => toggleIngredientCheck(idx)}
                                        className={`cursor-pointer text-sm font-medium leading-tight transition-all flex-1 ${isChecked ? 'text-chef-green font-bold' : 'text-gray-700'}`}
                                    >
                                        {cleanText}
                                    </span>
                                    <button 
                                        onClick={() => handleOpenDriveModal(cleanText)}
                                        title="Trouver au Drive"
                                        className="p-1.5 rounded-full text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <ShoppingCart size={14} />
                                    </button>
                                </li>
                            );
                        })}
                     </ul>

                     {/* ADD TO SHOPPING LIST BUTTON */}
                     <button
                        onClick={handleAddSelectedToShoppingList}
                        disabled={checkedIngredients.size === 0 || addedToList}
                        className={`w-full mt-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                            addedToList 
                            ? 'bg-chef-green text-white' 
                            : checkedIngredients.size > 0 
                                ? 'bg-chef-green text-white hover:bg-green-600' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                        }`}
                     >
                        {addedToList ? (
                            <><Check size={18} /> Ajouté à la liste !</>
                        ) : (
                            <><Plus size={18} /> Ajouter à ma liste de courses</>
                        )}
                     </button>
                 </div>

                 {mode === 'search' && sources.length > 0 && (
                     <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-200">
                         <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3">Sources Web</h4>
                         <div className="flex flex-col gap-2">
                             {sources.map((s, i) => (
                                 <a key={i} href={s.web?.uri} target="_blank" className="text-xs text-blue-600 truncate hover:underline flex items-center gap-1"><ExternalLink size={10}/> {s.web?.title}</a>
                             ))}
                         </div>
                     </div>
                 )}
              </div>

              {/* 5. PREPARATION STEPS (Right Column) */}
              <div className="md:col-span-8 space-y-6">
                 <div className="bg-white p-8 rounded-[2rem] shadow-card border border-gray-100">
                     <h3 className="font-display text-2xl text-chef-dark mb-6 border-b border-gray-100 pb-2">Préparation</h3>
                     
                     <div className="space-y-8">
                         {instructionsList.map((step, idx) => {
                             const cleanStep = step.replace(/^\d+\.\s*/, '').replace(/[*_]/g, '');
                             return (
                                 <div key={idx} className="flex gap-4">
                                     <div className="flex-shrink-0 w-10 h-10 rounded-full bg-chef-green/10 text-chef-green font-display text-xl flex items-center justify-center border border-green-100 shadow-sm">
                                         {idx + 1}
                                     </div>
                                     <div className="pt-1">
                                         <p className="text-gray-700 leading-relaxed text-lg">{cleanStep}</p>
                                     </div>
                                 </div>
                             )
                         })}
                         {instructionsList.length === 0 && (
                             <p className="text-gray-400 italic">Génération des étapes en cours ou format non reconnu...</p>
                         )}
                     </div>
                     
                     {/* Fallback for other sections (Intro, Chef's word) */}
                     <div className="markdown-prose mt-10 pt-10 border-t border-dashed border-gray-200">
                         <ReactMarkdown>{recipe.split(/#+\s*(?:Préparation|Instructions|Ingrédients|Courses)/i)[0]}</ReactMarkdown>
                     </div>
                 </div>
              </div>
          </div>
        </div>
      )}

      {/* IMMERSIVE MODE OVERLAY */}
      {immersiveMode && (
        <div className="fixed inset-0 z-[100] bg-chef-dark text-white flex flex-col immersive-enter">
            <div className="p-6 flex justify-between items-center bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-chef-green rounded-lg"><ChefHat size={20} /></div>
                    <span className="font-display text-xl">Mode Cuisine</span>
                </div>
                <button onClick={() => setImmersiveMode(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={24}/></button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
                <p className="text-chef-green font-bold text-sm uppercase tracking-widest mb-4">Étape {currentStep + 1} / {parsedSteps.length}</p>
                
                {/* Video Player or Generation Area */}
                <div className="w-full max-w-2xl mb-6 aspect-video bg-black/40 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 relative group shrink-0">
                    {videoLoading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="animate-spin text-chef-green mb-2" size={40} />
                            <span className="text-sm font-bold animate-pulse">Tournage de la scène en cours...</span>
                            <span className="text-xs text-gray-500 mt-1">Cela peut prendre quelques minutes</span>
                        </div>
                    ) : stepVideo ? (
                        <video src={stepVideo} controls autoPlay loop className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <button 
                                onClick={handleGenerateVideo}
                                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 mx-auto transition-all border border-white/20 hover:border-chef-green/50 mb-4"
                            >
                                <Video size={20} className="text-chef-green" /> 
                                <span>Visualiser l'étape (Veo)</span>
                            </button>
                            <div className="font-display text-2xl md:text-3xl leading-tight px-4 line-clamp-4">
                                {parsedSteps[currentStep]}
                            </div>
                        </div>
                    )}
                </div>

                 {/* Text always visible below video/placeholder */}
                 <div className="font-display text-xl md:text-2xl leading-tight mb-20 px-4 text-center max-w-3xl">
                     {parsedSteps[currentStep]}
                </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4">
                 <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center justify-between shadow-2xl">
                    <button 
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} 
                        disabled={currentStep === 0}
                        className="p-4 rounded-xl hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <button 
                        onClick={() => speakStep(parsedSteps[currentStep])} 
                        className="p-4 bg-chef-green text-white rounded-xl shadow-glow hover:bg-green-500 transition-transform hover:scale-105"
                    >
                        <Volume2 size={28}/>
                    </button>

                    <button 
                        onClick={() => setCurrentStep(Math.min(parsedSteps.length - 1, currentStep + 1))} 
                        disabled={currentStep === parsedSteps.length - 1}
                        className="p-4 rounded-xl hover:bg-white/10 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight size={28} />
                    </button>
                 </div>
            </div>
        </div>
      )}

      {/* DRIVE LOCATOR MODAL */}
      {showDriveModal && (
          <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-[2rem] w-full max-w-md p-6 shadow-2xl relative animate-fade-in">
                  <button onClick={() => setShowDriveModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-gray-500"/></button>
                  
                  <h3 className="font-display text-2xl text-chef-dark mb-1">Trouver un Drive</h3>
                  <p className="text-sm text-gray-500 mb-6">Pour acheter : <strong className="text-chef-dark">{selectedIngredientForDrive}</strong></p>

                  <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <MapPin size={12} /> Votre Ville
                      </label>
                      <input 
                        type="text" 
                        value={userCity} 
                        onChange={handleCityChange}
                        placeholder="Ex: Lyon, Paris 15..." 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                      {supermarketBrands.map((brand) => (
                          <button
                            key={brand.name}
                            onClick={() => findDrive(brand.name)}
                            className={`p-3 rounded-xl text-white font-bold text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${brand.color}`}
                          >
                              <Store size={16} /> {brand.name}
                          </button>
                      ))}
                  </div>
                  
                  <p className="text-[10px] text-gray-400 text-center mt-6">
                      Vous serez redirigé vers Google Maps pour localiser le drive le plus proche de chez vous.
                  </p>
              </div>
          </div>
      )}
    </div>
  );
};

export default RecipeCreator;