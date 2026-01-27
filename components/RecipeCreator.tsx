
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
      const steps = ["Activation...", "Analyse...", "Dressage...", "Calibration...", "Finalisation..."];
      let i = 0;
      setLoadingStep(steps[0]);
      interval = setInterval(() => {
        i = (i + 1);
        if (i < steps.length) {
             setLoadingStep(steps[i]);
        }
      }, 2500); 
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleGenerate = async () => {
    if (mode === 'create' && !ingredients.trim()) return;
    if (mode === 'search' && !searchQuery.trim()) return;
    setStatus('loading');
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
      setStatus('success');
      triggerImageGeneration(result.text, mode === 'create' ? `${ingredients}` : searchQuery);
    } catch (e: any) {
      setStatus('error');
    }
  };

  const triggerImageGeneration = async (recipeText: string, context: string) => {
    setImageStatus('loading');
    try {
      const titleMatch = recipeText.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Plat';
      const imageUrl = await generateRecipeImage(title, context);
      setGeneratedImage(imageUrl);
      setImageStatus('success');
    } catch (e) {
      setImageStatus('error');
    }
  };

  const handleSaveToBook = async () => {
    if (!recipe) return;
    const titleMatch = recipe.match(/^#\s+(.+)$/m);
    await saveRecipeToBook({
      id: Date.now().toString(),
      title: titleMatch ? titleMatch[1] : "Recette",
      markdownContent: recipe,
      date: new Date().toLocaleDateString('fr-FR'),
      metrics: metrics || undefined,
      image: generatedImage || undefined,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // FIX: isChecked was not defined. It should check if idx exists in checkedIngredients.
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
          if (!capture) {
             if (type === 'ingredients' && (lower.includes('ingrédients')) && line.startsWith('#')) { capture = true; continue; }
             if (type === 'instructions' && (lower.includes('préparation')) && line.startsWith('#')) { capture = true; continue; }
             continue;
          }
          if (capture) {
              if (line.startsWith('#')) { capture = false; break; }
              if (line.trim().length > 2) content.push(line);
          }
      }
      return content;
  }

  const ingredientsList = getRecipeSection('ingredients');
  const instructionsList = getRecipeSection('instructions');

  return (
    <div className="pb-32 px-4 pt-6 max-w-5xl mx-auto min-h-screen font-body text-emerald-900 bg-[#f4fcf0]">
      <header className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-2xl border border-green-200">
              <PremiumChefHat size={32} className="text-[#509f2a]" />
          </div>
          <div>
            <h2 className="text-3xl font-display text-emerald-900 leading-none">Nouvelle Recette</h2>
            <p className="text-[#509f2a] text-[10px] font-bold tracking-widest uppercase mt-1">Assistant Culinaire</p>
          </div>
      </header>

      {!recipe && (
        <div className="bg-white p-6 rounded-[2.5rem] border border-green-50 shadow-sm relative overflow-hidden">
            <textarea 
                className="w-full p-6 bg-[#f0f7ed] border border-green-100 rounded-3xl outline-none resize-none min-h-[180px] text-xl transition-all focus:bg-white focus:ring-4 focus:ring-green-50" 
                placeholder="Dites-moi ce que vous avez..." 
                value={ingredients} 
                onChange={(e) => setIngredients(e.target.value)} 
            />
            <button onClick={handleGenerate} disabled={status === 'loading' || !ingredients} className="w-full mt-6 py-5 rounded-2xl bg-[#509f2a] text-white font-display text-2xl transition-all hover:bg-green-600">
                {status === 'loading' ? 'En cours...' : 'Générer'}
            </button>
        </div>
      )}

      {recipe && (
        <div className="animate-fade-in mt-2 pb-10">
          <div className="bg-white rounded-[3rem] shadow-2xl border border-green-50 overflow-hidden mb-8">
            <div className="px-8 py-6 flex justify-between items-center bg-white border-t border-green-50">
                <button onClick={() => setRecipe('')} className="p-3 hover:bg-green-50 rounded-full text-[#509f2a]"><ChevronLeft size={28}/></button>
                <div className="flex gap-4">
                     <button onClick={handleSaveToBook} className="bg-[#509f2a] text-white px-6 py-3 rounded-2xl font-bold">Enregistrer</button>
                </div>
            </div>
            <div className="p-8 md:p-12 markdown-prose">
                <ReactMarkdown>{recipe}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCreator;
