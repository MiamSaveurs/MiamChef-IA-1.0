
import React, { useState, useEffect, useRef } from 'react';
import { generateChefRecipe, searchChefsRecipe, generateRecipeImage } from '../services/geminiService';
import { saveRecipeToBook } from '../services/storageService';
import { LoadingState, GroundingChunk, RecipeMetrics } from '../types';
import { 
  ChevronLeft, 
  ChevronDown, 
  Users, 
  Timer, 
  Globe2, 
  Leaf, 
  Utensils, 
  Sparkles, 
  Search, 
  Plus, 
  Check, 
  Book,
  Camera,
  Layers,
  Flame
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  GourmetBook, 
  PremiumChefHat, 
  PremiumCake, 
  PremiumCroissant,
  PremiumSparkles
} from './Icons';

const RecipeCreator: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'search'>('create');
  const [chefMode, setChefMode] = useState<'cuisine' | 'patisserie'>('cuisine');
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('Équilibré');
  const [mealTime, setMealTime] = useState('Dîner');
  const [cuisineStyle, setCuisineStyle] = useState('Cuisine Française'); 
  const [isBatchCooking, setIsBatchCooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'economical' | 'authentic'>('economical');
  const [people, setPeople] = useState(2);
  
  const [recipe, setRecipe] = useState('');
  const [metrics, setMetrics] = useState<RecipeMetrics | null>(null);
  const [utensils, setUtensils] = useState<string[]>([]);
  const [status, setStatus] = useState<LoadingState>('idle');
  const [loadingStep, setLoadingStep] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'loading') {
      const steps = ["Mise en place...", "Analyse des saveurs...", "Dressage virtuel...", "Calcul nutritionnel...", "Finalisation..."];
      let i = 0;
      setLoadingStep(steps[0]);
      interval = setInterval(() => {
        i++;
        if (i < steps.length) setLoadingStep(steps[i]);
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleGenerate = async () => {
    if (mode === 'create' && !ingredients.trim()) return;
    if (mode === 'search' && !searchQuery.trim()) return;
    
    setStatus('loading');
    setRecipe('');
    setGeneratedImage(null);
    
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
      setStatus('success');
      
      // Generation d'image en arrière-plan
      const titleMatch = result.text.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Plat';
      const img = await generateRecipeImage(title, ingredients || searchQuery);
      setGeneratedImage(img);
      
    } catch (e: any) {
      console.error(e);
      setStatus('error');
    }
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
      utensils: utensils
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="pb-32 px-4 pt-6 max-w-4xl mx-auto min-h-screen bg-[#050505] text-white">
      
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="p-3 bg-[#509f2a]/10 rounded-2xl border border-[#509f2a]/20">
                  <PremiumChefHat size={32} className="text-[#509f2a]" />
              </div>
              <div>
                <h2 className="text-3xl font-display text-white leading-none">Atelier du Chef</h2>
                <p className="text-[#509f2a] text-[10px] font-bold tracking-widest uppercase mt-1">Création Haute Couture</p>
              </div>
          </div>
          
          {recipe && (
              <button onClick={() => setRecipe('')} className="p-3 bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                  <ChevronLeft size={24} />
              </button>
          )}
      </header>

      {!recipe ? (
        <div className="space-y-6 animate-fade-in">
          
          {/* Mode Tabs */}
          <div className="bg-white/5 p-1.5 rounded-2xl flex gap-1">
              <button 
                onClick={() => setMode('create')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${mode === 'create' ? 'bg-[#509f2a] text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}
              >
                  <Sparkles size={16} /> Créer
              </button>
              <button 
                onClick={() => setMode('search')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${mode === 'search' ? 'bg-[#509f2a] text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}
              >
                  <Search size={16} /> Rechercher
              </button>
          </div>

          {/* Chef Persona Switch */}
          {mode === 'create' && (
              <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setChefMode('cuisine')}
                    className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${chefMode === 'cuisine' ? 'border-[#509f2a] bg-[#509f2a]/10' : 'border-white/5 bg-white/5 opacity-40'}`}
                  >
                      <Utensils size={24} className={chefMode === 'cuisine' ? 'text-[#509f2a]' : ''} />
                      <span className="font-display text-lg">Cuisinier</span>
                  </button>
                  <button 
                    onClick={() => setChefMode('patisserie')}
                    className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${chefMode === 'patisserie' ? 'border-[#509f2a] bg-[#509f2a]/10' : 'border-white/5 bg-white/5 opacity-40'}`}
                  >
                      <PremiumCake size={32} />
                      <span className="font-display text-lg">Pâtissier</span>
                  </button>
              </div>
          )}

          {/* Input Area */}
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
              <label className="block text-xs font-bold text-[#509f2a] uppercase tracking-widest mb-3">
                  {mode === 'create' ? 'Quels ingrédients avez-vous ?' : 'Quel plat recherchez-vous ?'}
              </label>
              <textarea 
                className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none resize-none min-h-[120px] text-lg text-white focus:border-[#509f2a]/50 transition-all"
                placeholder={mode === 'create' ? "Ex: 2 escalopes de poulet, crème, champignons..." : "Ex: Tarte tatin, Blanquette de veau..."}
                value={mode === 'create' ? ingredients : searchQuery}
                onChange={(e) => mode === 'create' ? setIngredients(e.target.value) : setSearchQuery(e.target.value)}
              />
          </div>

          {/* Advanced Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/60">
                          <Users size={16} />
                          <span className="text-xs font-bold uppercase">Convives</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">-</button>
                          <span className="font-display text-xl w-6 text-center">{people}</span>
                          <button onClick={() => setPeople(people + 1)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">+</button>
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/60">
                          <Leaf size={16} />
                          <span className="text-xs font-bold uppercase">Régime</span>
                      </div>
                      <select 
                        value={dietary} 
                        onChange={(e) => setDietary(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-sm outline-none appearance-none"
                      >
                          <option value="Équilibré">Équilibré (Standard)</option>
                          <option value="Végétarien">Végétarien</option>
                          <option value="Vegan">Vegan</option>
                          <option value="Sans Gluten">Sans Gluten</option>
                          <option value="Keto">Keto</option>
                          <option value="Régime Méditerranéen">Méditerranéen</option>
                      </select>
                  </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                  <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/60">
                          <Globe2 size={16} />
                          <span className="text-xs font-bold uppercase">Style</span>
                      </div>
                      <select 
                        value={cuisineStyle} 
                        onChange={(e) => setCuisineStyle(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-sm outline-none appearance-none"
                      >
                          <option value="Cuisine Française">Cuisine Française</option>
                          <option value="Italien">Italien</option>
                          <option value="Asiatique">Asiatique</option>
                          <option value="Méditerranéen">Méditerranéen</option>
                          <option value="Mexicain">Mexicain</option>
                          <option value="Moderne / Créatif">Moderne & Créatif</option>
                      </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-white/60">
                          <Layers size={16} />
                          <span className="text-xs font-bold uppercase">Batch Cooking</span>
                      </div>
                      <button 
                        onClick={() => setIsBatchCooking(!isBatchCooking)}
                        className={`w-12 h-6 rounded-full transition-all relative ${isBatchCooking ? 'bg-[#509f2a]' : 'bg-white/10'}`}
                      >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isBatchCooking ? 'left-7' : 'left-1'}`}></div>
                      </button>
                  </div>
              </div>

          </div>

          <button 
            onClick={handleGenerate}
            disabled={status === 'loading' || (mode === 'create' ? !ingredients : !searchQuery)}
            className="w-full py-5 bg-[#509f2a] text-white rounded-[2rem] font-display text-2xl shadow-xl shadow-[#509f2a]/10 hover:bg-green-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
              {status === 'loading' ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xl italic opacity-80">{loadingStep}</span>
                  </>
              ) : (
                  <>
                    <PremiumSparkles size={24} />
                    <span>Inspirer le Chef</span>
                  </>
              )}
          </button>
        </div>
      ) : (
        <div className="animate-fade-in space-y-8 pb-20">
            {/* Action Bar */}
            <div className="flex gap-3 sticky top-4 z-40">
                <button 
                    onClick={handleSaveToBook} 
                    disabled={isSaved}
                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isSaved ? 'bg-white/10 text-[#509f2a] border border-[#509f2a]/30' : 'bg-[#509f2a] text-white shadow-lg'}`}
                >
                    {isSaved ? <Check size={20} /> : <Book size={20} />}
                    {isSaved ? 'Enregistré' : 'Enregistrer au carnet'}
                </button>
            </div>

            {/* Recipe Content */}
            <div className="bg-[#111] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                {generatedImage ? (
                    <div className="w-full h-64 md:h-80 relative">
                        <img src={generatedImage} className="w-full h-full object-cover" alt="Plat" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                    </div>
                ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-white/5 border-b border-white/5">
                        <div className="flex items-center gap-3 text-white/20 animate-pulse">
                            <Camera size={24} />
                            <span className="font-bold text-xs uppercase tracking-widest">Génération de la photo...</span>
                        </div>
                    </div>
                )}

                <div className="p-8 md:p-12">
                    {/* Metrics Bar */}
                    {metrics && (
                        <div className="grid grid-cols-4 gap-4 mb-10 pb-8 border-b border-white/5 text-center">
                            <div>
                                <p className="text-[#509f2a] font-display text-2xl">{metrics.nutriScore}</p>
                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Nutri</p>
                            </div>
                            <div>
                                <p className="text-white font-display text-xl">{metrics.caloriesPerPerson}</p>
                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Kcal</p>
                            </div>
                            <div>
                                <p className="text-white font-display text-xl">{metrics.difficulty}</p>
                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Difficulté</p>
                            </div>
                            <div>
                                <p className="text-white font-display text-xl">{metrics.pricePerPerson}€</p>
                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Prix/Pers</p>
                            </div>
                        </div>
                    )}

                    <div className="markdown-prose prose-invert">
                        <ReactMarkdown>{recipe}</ReactMarkdown>
                    </div>

                    {/* Utensils */}
                    {utensils.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <h4 className="font-display text-xl text-[#509f2a] mb-4 flex items-center gap-2">
                                <Flame size={18} /> Matériel nécessaire
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {utensils.map((u, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/60">
                                        {u}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCreator;
