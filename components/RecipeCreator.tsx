import React, { useState } from 'react';
import { RecipeMetrics, SavedRecipe } from "../types";
import { generateChefRecipe, generateRecipeImage, generateRecipeVideo, adjustRecipe } from '../services/geminiService';
import { saveRecipeToBook, getUserProfile } from '../services/storageService';
import { 
    Loader2, ChevronRight, Sparkles, ChefHat, XCircle, Video, Save, Book, Share2, 
    Wand2, Minus, Plus, Users, Leaf, Clock, Euro, Zap, Check, ChevronDown, Send, Flame
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PremiumChefHat } from './Icons';

interface RecipeCreatorProps {
    persistentState: {
        text: string;
        metrics: RecipeMetrics | null;
        utensils: string[];
        ingredients: string[];
        ingredientsWithQuantities?: string[];
        steps?: string[];
        storageAdvice?: string;
        image: string | null;
        videoUrl?: string | null;
    } | null;
    setPersistentState: (state: any) => void;
}

const RecipeCreator: React.FC<RecipeCreatorProps> = ({ persistentState, setPersistentState }) => {
    // Inputs
    const [userConfig, setUserConfig] = useState('');
    const [people, setPeople] = useState(2);
    const [chefMode, setChefMode] = useState<'cuisine' | 'patisserie'>('cuisine');
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');
    const [cost, setCost] = useState<'authentic' | 'budget'>('authentic');
    
    // Status
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [videoStatus, setVideoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [isSaved, setIsSaved] = useState(false);
    const [adjustmentPrompt, setAdjustmentPrompt] = useState('');
    const [showAdjustment, setShowAdjustment] = useState(false);

    // Derived from persistent state
    const result = persistentState?.text || '';
    const generatedImage = persistentState?.image || null;
    const videoUrl = persistentState?.videoUrl || null;
    const metrics = persistentState?.metrics || null;

    const handleGenerate = async () => {
        if (!userConfig.trim()) return;
        setStatus('loading');
        try {
            const profile = getUserProfile();
            // Defaults for simplified UI
            const mealTime = "Dîner";
            const cuisineStyle = "Gastronomique";
            const isBatchCooking = false;
            
            const response = await generateChefRecipe(
                userConfig,
                people,
                profile.diet,
                mealTime,
                cuisineStyle,
                isBatchCooking,
                chefMode,
                cost,
                difficulty,
                profile.smartDevices
            );

            // Set initial state without image
            const newState = {
                text: response.text,
                metrics: response.metrics || null,
                utensils: response.utensils || [],
                ingredients: response.ingredients || [],
                ingredientsWithQuantities: response.ingredientsWithQuantities || [],
                steps: response.steps || [],
                storageAdvice: response.storageAdvice,
                image: null,
                videoUrl: null
            };
            setPersistentState(newState);
            setStatus('success');

            // Generate Image in background
            try {
                const titleMatch = response.text.match(/^#\s+(.+)$/m);
                const title = titleMatch ? titleMatch[1] : userConfig;
                const img = await generateRecipeImage(title, "Professional food photography, michelin star plating");
                setPersistentState({ ...newState, image: img });
            } catch (imgErr) {
                console.error("Image generation failed", imgErr);
            }

        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    const handleGenerateVideo = async () => {
        if (!persistentState) return;
        setVideoStatus('loading');
        
        // Check API Key for Veo
        if ((window as any).aistudio) {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (!hasKey) {
                try {
                    await (window as any).aistudio.openSelectKey();
                } catch (e) {
                    console.error("Key selection failed", e);
                    setVideoStatus('error');
                    return;
                }
            }
        }

        try {
             const titleMatch = persistentState.text.match(/^#\s+(.+)$/m);
             const title = titleMatch ? titleMatch[1] : "Plat gastronomique";
             const vid = await generateRecipeVideo(title, "Cinematic, slow motion, 4k");
             setPersistentState({ ...persistentState, videoUrl: vid });
             setVideoStatus('success');
        } catch (e) {
            console.error("Video generation failed", e);
            setVideoStatus('error');
        }
    };

    const handleClearRecipe = () => {
        setPersistentState(null);
        setStatus('idle');
        setVideoStatus('idle');
        setUserConfig('');
        setIsSaved(false);
    };

    const handleSave = async () => {
        if (!persistentState) return;
        const titleMatch = persistentState.text.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : "Recette du Chef";
        
        const recipeToSave: SavedRecipe = {
            id: Date.now().toString(),
            title: title,
            markdownContent: persistentState.text,
            date: new Date().toLocaleDateString('fr-FR'),
            metrics: persistentState.metrics || undefined,
            image: persistentState.image || undefined,
            utensils: persistentState.utensils,
            ingredients: persistentState.ingredients,
            ingredientsWithQuantities: persistentState.ingredientsWithQuantities,
            steps: persistentState.steps,
            storageAdvice: persistentState.storageAdvice
        };
        
        await saveRecipeToBook(recipeToSave);
        setIsSaved(true);
    };

    const handleAdjust = async () => {
        if (!persistentState || !adjustmentPrompt.trim()) return;
        setStatus('loading');
        setShowAdjustment(false);
        try {
            const response = await adjustRecipe(persistentState.text, adjustmentPrompt);
            // Merge response with existing state
             const newState = {
                ...persistentState,
                text: response.text,
                metrics: response.metrics || persistentState.metrics,
                ingredients: response.ingredients || persistentState.ingredients,
                ingredientsWithQuantities: response.ingredientsWithQuantities || persistentState.ingredientsWithQuantities,
                steps: response.steps || persistentState.steps,
            };
            setPersistentState(newState);
            setStatus('success');
            setAdjustmentPrompt('');
        } catch (e) {
            setStatus('error');
        }
    };

    if (result) {
        return (
             <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
                {/* HERO HEADER IMAGE (OU VIDEO SI GENEREE) */}
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
                    {/* Gradient overlay for readability */}
                    {!videoUrl && <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]"></div>}
                    
                    {/* Back / Clear Button */}
                    <button 
                        onClick={handleClearRecipe} 
                        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-full text-white border border-white/10 backdrop-blur-md transition-all shadow-lg"
                    >
                          <XCircle size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Fermer</span>
                    </button>

                    {/* BOUTON GENERER VIDEO (SI PAS ENCORE FAIT) */}
                    {!videoUrl && (
                        <button 
                            onClick={handleGenerateVideo}
                            disabled={videoStatus === 'loading'}
                            className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg group disabled:opacity-50"
                        >
                            {videoStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} className="text-red-500 group-hover:scale-110 transition-transform"/>}
                            {videoStatus === 'loading' ? 'GÉNÉRATION...' : 'GÉNÉRER LA VIDÉO'}
                        </button>
                    )}
                </div>
                
                <div className="relative z-10 -mt-10 px-6 max-w-4xl mx-auto">
                     {/* CONTENT BODY */}
                     <div className="bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-2xl space-y-8">
                        
                        {/* Header Info */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                            <div className="flex gap-2">
                                <button onClick={handleSave} disabled={isSaved} className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${isSaved ? 'bg-green-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                    {isSaved ? <Check size={16}/> : <Save size={16}/>} {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
                                </button>
                                <button onClick={() => setShowAdjustment(!showAdjustment)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 border border-purple-500/30 transition-colors">
                                    <Wand2 size={16}/> {showAdjustment ? 'Annuler' : 'Revisiter'}
                                </button>
                            </div>
                            
                            {/* Metrics Badge Row */}
                            {metrics && (
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><Clock size={12} className="text-blue-400"/> 30min</span>
                                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded"><Flame size={12} className="text-orange-400"/> {metrics.caloriesPerPerson} Kcal</span>
                                    <span className={`px-2 py-1 rounded font-bold text-white bg-${metrics.nutriScore === 'A' ? 'green' : metrics.nutriScore === 'B' ? 'lime' : 'yellow'}-600`}>Nutri-Score {metrics.nutriScore}</span>
                                </div>
                            )}
                        </div>

                        {/* Adjustment Input */}
                        {showAdjustment && (
                            <div className="animate-fade-in bg-purple-900/10 border border-purple-500/30 rounded-xl p-4">
                                <label className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-2 block">Comment modifier cette recette ?</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={adjustmentPrompt}
                                        onChange={(e) => setAdjustmentPrompt(e.target.value)}
                                        placeholder="Ex: Moins salé, Version Vegan, Plus épicé..."
                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                                    />
                                    <button onClick={handleAdjust} disabled={status === 'loading'} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-purple-500 transition-colors">
                                        {status === 'loading' ? <Loader2 className="animate-spin"/> : <Send size={16}/>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Ingredients List */}
                        {persistentState && persistentState.ingredientsWithQuantities && (
                            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                <h3 className="font-display text-lg text-green-400 mb-4 flex items-center gap-2">
                                    <Leaf size={18} /> Ingrédients
                                </h3>
                                <ul className="space-y-2">
                                    {persistentState.ingredientsWithQuantities.map((ing, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-green-500"></span>
                                            {ing}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                         {/* Markdown Content */}
                         <div className="markdown-prose prose-invert text-gray-300 leading-relaxed space-y-4">
                            <ReactMarkdown
                                components={{
                                    h1: ({node, ...props}) => <h1 className="text-3xl font-display text-white mb-6" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-green-400 mt-8 mb-4 flex items-center gap-2 border-b border-white/10 pb-2" {...props} />,
                                    strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                                    li: ({node, ...props}) => <li className="mb-2" {...props} />
                                }}
                            >
                                {persistentState?.text || ''}
                            </ReactMarkdown>
                         </div>

                     </div>
                </div>
             </div>
        );
    }

    // INPUT VIEW
    return (
        <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
             {/* Background */}
             <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-30 fixed"
                  alt="Kitchen Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#0a1a0a]/80 to-black fixed"></div>
             </div>

             <div className="relative z-10 max-w-2xl mx-auto px-6 pt-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-900 shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-4 border border-green-500/30">
                        <PremiumChefHat size={32} className="text-green-100" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display text-green-500 mb-2 drop-shadow-md">
                        Cuisine du Chef
                    </h1>
                    <p className="text-green-200/60 text-sm font-light tracking-widest uppercase">
                        Création sur-mesure
                    </p>
                </div>

                {/* Input Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-1.5 shadow-2xl mb-10">
                    <div className="bg-black/40 rounded-[1.7rem] p-6 border border-white/5 space-y-6">
                        
                        {/* Prompt Input */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-widest mb-3">
                                <Sparkles size={12} /> Votre envie du moment
                            </label>
                            <textarea 
                                value={userConfig}
                                onChange={(e) => setUserConfig(e.target.value)}
                                placeholder="Ex: J'ai du saumon et des épinards, fais-moi un plat étoilé..."
                                className="w-full h-32 bg-[#151515] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-green-500/50 outline-none transition-colors resize-none text-sm placeholder:text-gray-600"
                            />
                        </div>

                        {/* Controls Row */}
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    <Users size={12} /> Convives
                                </label>
                                <div className="flex items-center bg-[#151515] rounded-xl border border-white/10 px-3 py-2">
                                    <button onClick={() => setPeople(Math.max(1, people - 1))} className="p-1 hover:text-white text-gray-500"><Minus size={16}/></button>
                                    <span className="flex-1 text-center font-bold text-sm">{people}</span>
                                    <button onClick={() => setPeople(Math.min(12, people + 1))} className="p-1 hover:text-white text-gray-500"><Plus size={16}/></button>
                                </div>
                             </div>

                             <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    <ChefHat size={12} /> Mode
                                </label>
                                <button 
                                    onClick={() => setChefMode(chefMode === 'cuisine' ? 'patisserie' : 'cuisine')}
                                    className="w-full bg-[#151515] rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-gray-200 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                                >
                                    {chefMode === 'cuisine' ? '🍳 Cuisine' : '🍰 Pâtisserie'}
                                </button>
                             </div>
                        </div>
                        
                        {/* More Options Toggles */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    <Zap size={12} /> Difficulté
                                </label>
                                <div className="relative group">
                                    <select 
                                        value={difficulty} 
                                        onChange={(e) => setDifficulty(e.target.value as any)}
                                        className="w-full bg-[#151515] text-white text-xs font-bold uppercase py-2.5 px-3 rounded-xl border border-white/10 outline-none appearance-none"
                                    >
                                        <option value="beginner">Débutant</option>
                                        <option value="intermediate">Intermédiaire</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    <Euro size={12} /> Budget
                                </label>
                                <button 
                                    onClick={() => setCost(cost === 'authentic' ? 'budget' : 'authentic')}
                                    className="w-full bg-[#151515] rounded-xl border border-white/10 px-3 py-2 text-xs font-bold uppercase text-gray-200 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                                >
                                    {cost === 'authentic' ? '💎 Authentique' : '💰 Économique'}
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={status === 'loading' || !userConfig}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-700 to-[#0f2e1b] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-green-900/40 hover:shadow-green-700/60 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
                        >
                            {status === 'loading' ? <Loader2 className="animate-spin" /> : <>Invoquer le Chef <ChevronRight size={16}/></>}
                        </button>
                    </div>
                </div>

             </div>
        </div>
    );
};

export default RecipeCreator;