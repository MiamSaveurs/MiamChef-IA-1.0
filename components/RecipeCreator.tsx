
import React, { useState, useEffect, useRef } from 'react';
import { generateChefRecipe, searchChefsRecipe, generateRecipeImage } from '../services/geminiService';
import { saveRecipeToBook } from '../services/storageService';
import { LoadingState, GroundingChunk, RecipeMetrics } from '../types';
import { 
  ChevronLeft, 
  ChevronDown, 
  Camera,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  GourmetBook, 
  PremiumChefHat, 
  PremiumCake, 
  PremiumSparkles,
  PremiumSearch,
  PremiumUtensils,
  PremiumUsers,
  PremiumHeart,
  PremiumGlobe,
  PremiumLayers,
  PremiumFlame,
  PremiumCheck,
  PremiumMedal,
  PremiumTimer
} from './Icons';

const RecipeCreator: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'search'>('create');
  const [chefMode, setChefMode] = useState<'cuisine' | 'patisserie'>('cuisine');
  const [complexity, setComplexity] = useState<'authentic' | 'fast'>('authentic');
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('Équilibré');
  const [mealTime, setMealTime] = useState('Dîner');
  const [cuisineStyle, setCuisineStyle] = useState('Cuisine Familiale'); 
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

  // Thème dynamique
  const isPatissier = chefMode === 'patisserie';
  const themeColor = isPatissier ? '#ec4899' : '#509f2a';
  const themeBg = isPatissier ? 'bg-[#ec4899]' : 'bg-[#509f2a]';
  const themeBorder = isPatissier ? 'border-[#ec4899]' : 'border-[#509f2a]';
  const themeText = isPatissier ? 'text-[#ec4899]' : 'text-[#509f2a]';
  const themeShadow = isPatissier ? 'shadow-[#ec4899]/20' : 'shadow-[#509f2a]/20';
  const themeSelection = isPatissier ? 'selection:bg-[#ec4899]' : 'selection:bg-[#509f2a]';

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'loading') {
      const steps = ["Préparation...", "Mélange des saveurs...", "Mise en plat...", "Finalisation..."];
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
        result = await generateChefRecipe(ingredients, people, dietary, mealTime, cuisineStyle, isBatchCooking, chefMode, complexity);
      } else {
        result = await searchChefsRecipe(searchQuery, people, searchType);
      }
      
      setRecipe(result.text);
      setMetrics(result.metrics || null);
      setUtensils(result.utensils || []);
      setStatus('success');
      
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
    <div className={`pb-32 px-4 pt-6 max-w-4xl mx-auto min-h-screen bg-[#050505] text-white ${themeSelection} transition-colors duration-500`}>
      
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl border transition-all duration-500`} style={{ backgroundColor: `${themeColor}10`, borderColor: `${themeColor}20` }}>
                  {isPatissier ? (
                    <PremiumCake size={32} style={{ color: themeColor }} />
                  ) : (
                    <PremiumChefHat size={32} style={{ color: themeColor }} />
                  )}
              </div>
              <div>
                <h2 className="text-3xl font-display text-white leading-none">La Cuisine du Chef</h2>
                <p className={`text-[10px] font-bold tracking-widest uppercase mt-1 transition-colors duration-500`} style={{ color: themeColor }}>
                  {isPatissier ? "Pâtisser avec plaisir" : "Bons petits plats maison"}
                </p>
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
          <div className="bg-white/5 p-1.5 rounded-2xl flex gap-1 border border-white/5">
              <button 
                onClick={() => setMode('create')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${mode === 'create' ? themeBg + ' text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}
              >
                  <PremiumSparkles size={18} className={mode === 'create' ? 'text-white' : 'text-white/40'} /> Créer
              </button>
              <button 
                onClick={() => setMode('search')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${mode === 'search' ? themeBg + ' text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}
              >
                  <PremiumSearch size={18} className={mode === 'search' ? 'text-white' : 'text-white/40'} /> Rechercher
              </button>
          </div>

          {/* Chef Persona Switch */}
          {mode === 'create' && (
              <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setChefMode('cuisine')}
                    className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all duration-500 ${chefMode === 'cuisine' ? 'border-[#509f2a] bg-[#509f2a]/10 shadow-[0_0_20px_rgba(80,159,42,0.1)]' : 'border-white/5 bg-white/5 opacity-40'}`}
                  >
                      <PremiumUtensils size={32} className={chefMode === 'cuisine' ? 'text-[#509f2a]' : 'text-white'} />
                      <span className="font-display text-lg">Cuisinier</span>
                  </button>
                  <button 
                    onClick={() => setChefMode('patisserie')}
                    className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all duration-500 ${chefMode === 'patisserie' ? 'border-[#ec4899] bg-[#ec4899]/10 shadow-[0_0_20px_rgba(236,72,153,0.1)]' : 'border-white/5 bg-white/5 opacity-40'}`}
                  >
                      <PremiumCake size={32} className={chefMode === 'patisserie' ? 'text-[#ec4899]' : 'text-white'} />
                      <span className="font-display text-lg">Pâtissier</span>
                  </button>
              </div>
          )}

          {/* Input Area */}
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
              <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors duration-500`} style={{ color: themeColor }}>
                  {mode === 'create' ? 'Quels ingrédients avez-vous ?' : 'Quel dessert recherchez-vous ?'}
              </label>
              <textarea 
                className={`w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none resize-none min-h-[120px] text-lg text-white transition-all placeholder:text-white/20`}
                style={{ borderColor: status === 'loading' ? themeColor : '' }}
                placeholder={mode === 'create' ? (isPatissier ? "Ex: Farine, oeufs, chocolat noir, beurre..." : "Ex: 2 escalopes de poulet, crème, champignons...") : (isPatissier ? "Ex: Tarte tatin, Soufflé au chocolat..." : "Ex: Blanquette de veau...")}
                value={mode === 'create' ? ingredients : searchQuery}
                onChange={(e) => mode === 'create' ? setIngredients(e.target.value) : setSearchQuery(e.target.value)}
              />
          </div>

          {/* Complexity Signature Switch */}
          {mode === 'create' && (
              <div className="space-y-3">
                  <label className={`block text-xs font-bold uppercase tracking-widest px-1 transition-colors duration-500`} style={{ color: themeColor }}>Signature du Chef</label>
                  <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setComplexity('authentic')}
                        className={`p-4 rounded-2xl border flex items-center gap-3 transition-all duration-500 ${complexity === 'authentic' ? themeBorder + ' bg-white/5 text-white' : 'border-white/5 bg-white/5 text-white/40'}`}
                      >
                          <PremiumMedal size={20} style={{ color: complexity === 'authentic' ? themeColor : 'inherit' }} />
                          <div className="text-left">
                              <span className="block font-display text-lg leading-none">Authentique</span>
                              <span className="text-[10px] font-bold uppercase opacity-60">Fait-Maison Tradition</span>
                          </div>
                      </button>
                      <button 
                        onClick={() => setComplexity('fast')}
                        className={`p-4 rounded-2xl border flex items-center gap-3 transition-all duration-500 ${complexity === 'fast' ? themeBorder + ' bg-white/5 text-white' : 'border-white/5 bg-white/5 text-white/40'}`}
                      >
                          <PremiumTimer size={20} style={{ color: complexity === 'fast' ? themeColor : 'inherit' }} />
                          <div className="text-left">
                              <span className="block font-display text-lg leading-none">Rapide</span>
                              <span className="text-[10px] font-bold uppercase opacity-60">Prêt en un clin d'œil</span>
                          </div>
                      </button>
                  </div>
              </div>
          )}

          {/* Advanced Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/40">
                          <PremiumUsers size={18} />
                          <span className="text-xs font-bold uppercase tracking-wide">Convives</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">-</button>
                          <span className="font-display text-xl w-6 text-center">{people}</span>
                          <button onClick={() => setPeople(people + 1)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">+</button>
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/40">
                          <PremiumHeart size={18} />
                          <span className="text-xs font-bold uppercase tracking-wide">Régime</span>
                      </div>
                      <select 
                        value={dietary} 
                        onChange={(e) => setDietary(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-sm outline-none appearance-none"
                      >
                          <option value="Équilibré">Équilibré (Standard)</option>
                          <option value="Végétarien">Végétarien</option>
                          <option value="Sans Gluten">Sans Gluten</option>
                          <option value="Sans Lactose">Sans Lactose</option>
                      </select>
                  </div>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                  <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/40">
                          <PremiumGlobe size={18} />
                          <span className="text-xs font-bold uppercase tracking-wide">Style</span>
                      </div>
                      <select 
                        value={cuisineStyle} 
                        onChange={(e) => setCuisineStyle(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-sm outline-none appearance-none"
                      >
                          <option value="Classique Français">Classique Français</option>
                          <option value="Cuisine Familiale">Cuisine Familiale</option>
                          <option value="Moderne / Créatif">Moderne & Créatif</option>
                      </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-white/40">
                          <PremiumLayers size={18} />
                          <span className="text-xs font-bold uppercase tracking-wide">Batch Cooking</span>
                      </div>
                      <button 
                        onClick={() => setIsBatchCooking(!isBatchCooking)}
                        className={`w-12 h-6 rounded-full transition-all relative ${isBatchCooking ? themeBg : 'bg-white/10'}`}
                      >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isBatchCooking ? 'left-7 shadow-sm' : 'left-1'}`}></div>
                      </button>
                  </div>
              </div>

          </div>

          <button 
            onClick={handleGenerate}
            disabled={status === 'loading' || (mode === 'create' ? !ingredients : !searchQuery)}
            className={`w-full py-5 text-white rounded-[2rem] font-display text-2xl shadow-xl transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] ${themeBg} ${themeShadow} hover:brightness-110`}
          >
              {status === 'loading' ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xl italic opacity-80">{loadingStep}</span>
                  </>
              ) : (
                  <>
                    <PremiumSparkles size={24} className="text-white" />
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
                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isSaved ? 'bg-white/10 text-white/60 border border-white/10' : themeBg + ' text-white shadow-lg'}`}
                >
                    {isSaved ? <PremiumCheck size={20} className={themeText} /> : <GourmetBook size={20} />}
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
                                <p className={`font-display text-2xl transition-colors duration-500`} style={{ color: themeColor }}>{metrics.nutriScore}</p>
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

                    <div className={`markdown-prose prose-invert`}>
                        <ReactMarkdown 
                          components={{
                            h1: ({node, ...props}) => <h1 style={{color: themeColor}} {...props} />,
                            strong: ({node, ...props}) => <strong style={{color: themeColor}} {...props} />,
                          }}
                        >
                          {recipe}
                        </ReactMarkdown>
                    </div>

                    {/* Utensils */}
                    {utensils.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <h4 className={`font-display text-xl mb-4 flex items-center gap-2 transition-colors duration-500`} style={{ color: themeColor }}>
                                <PremiumFlame size={18} /> Matériel nécessaire
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
