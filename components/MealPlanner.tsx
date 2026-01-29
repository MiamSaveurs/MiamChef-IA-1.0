
import React, { useState, useEffect } from 'react';
import { generateWeeklyMenu } from '../services/geminiService';
import { saveWeeklyPlan, getWeeklyPlan, addToShoppingList, deleteWeeklyPlan } from '../services/storageService';
import { WeeklyPlan, LoadingState } from '../types';
import { Loader2, Users, Leaf, ChevronDown, Trash2, Calendar, ShoppingCart, Check, Carrot } from 'lucide-react';
import { 
    PremiumCalendar, 
    PremiumChefHat, 
    PremiumTimer, 
    PremiumUtensils, 
    PremiumCoffee, 
    PremiumSoup, 
    PremiumSparkles
} from './Icons';

const MealPlanner: React.FC = () => {
    const [plan, setPlan] = useState<WeeklyPlan | null>(null);
    const [status, setStatus] = useState<LoadingState>('idle');
    const [isInitializing, setIsInitializing] = useState(true); 
    const [errorMessage, setErrorMessage] = useState('');
    const [dietary, setDietary] = useState('Classique (Aucun)');
    const [people, setPeople] = useState(2);
    const [ingredients, setIngredients] = useState('');
    const [addedToList, setAddedToList] = useState(false);

    useEffect(() => { loadPlan(); }, []);

    const loadPlan = async () => {
        try {
            const saved = await getWeeklyPlan();
            if (saved) setPlan(saved);
        } catch (e) {
            console.error("Erreur chargement sauvegarde", e);
        } finally {
            setIsInitializing(false);
        }
    };

    const handleGenerate = async () => {
        setStatus('loading');
        setErrorMessage('');
        setAddedToList(false);
        try {
            const newPlan = await generateWeeklyMenu(dietary, people, ingredients);
            if (!newPlan) throw new Error("L'IA n'a pas renvoyé de planning valide.");
            if (!newPlan.id) newPlan.id = 'current';
            setPlan(newPlan);
            await saveWeeklyPlan(newPlan);
            setStatus('success');
        } catch (e: any) {
            setStatus('error');
            setErrorMessage(e.message || "Erreur de connexion à l'IA.");
        }
    };

    const handleDeletePlan = async (e: React.MouseEvent) => {
        if (!confirm("Voulez-vous vraiment effacer cette semaine et recommencer ?")) return;
        e.preventDefault();
        e.stopPropagation();
        setPlan(null); 
        await deleteWeeklyPlan();
    };

    const handleExportToShoppingList = async () => {
        if (!plan) return;
        const allIngredients: string[] = [];
        plan.days.forEach(day => {
            if (day.breakfast?.ingredients) allIngredients.push(...day.breakfast.ingredients);
            if (day.lunch.ingredients) allIngredients.push(...day.lunch.ingredients);
            if (day.snack?.ingredients) allIngredients.push(...day.snack.ingredients);
            if (day.dinner.ingredients) allIngredients.push(...day.dinner.ingredients);
        });
        
        const cleanedIngredients = allIngredients.map(text => {
             let clean = text.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').replace(/\*/g, '').trim(); 
             clean = clean.replace(/^[\d\s.,/]+(g|kg|ml|cl|l|mg|c\.à\.s|c\.à\.c|cuillères?|tranches?|morceaux?|bottes?|sachets?|boites?|pots?|verres?|tasses?|pincées?|têtes?|gousses?|feuilles?|brins?|filets?|pavés?|escalopes?|poignées?)?(\s+(d'|de|du|des)\s+)?/i, '');
             clean = clean.replace(/^\d+\s+/, '').trim();
             return clean.charAt(0).toUpperCase() + clean.slice(1);
        });

        await addToShoppingList(Array.from(new Set(cleanedIngredients)));
        setAddedToList(true);
    };

    const calculateStats = () => {
        if (!plan) return { calories: 0, proteins: 0, carbs: 0, fats: 0 };
        let totalCals = 0, totalP = 0, totalC = 0, totalF = 0;
        const count = plan.days.length || 7;
        plan.days.forEach(day => {
            totalCals += (day.breakfast?.calories || 0) + (day.lunch.calories || 0) + (day.snack?.calories || 0) + (day.dinner.calories || 0);
            totalP += (day.breakfast?.proteins || 0) + (day.lunch.proteins || 0) + (day.snack?.proteins || 0) + (day.dinner.proteins || 0);
            totalC += (day.breakfast?.carbs || 0) + (day.lunch.carbs || 0) + (day.snack?.carbs || 0) + (day.dinner.carbs || 0);
            totalF += (day.breakfast?.fats || 0) + (day.lunch.fats || 0) + (day.snack?.fats || 0) + (day.dinner.fats || 0);
        });
        return {
            calories: Math.round(totalCals / count),
            proteins: Math.round(totalP / count),
            carbs: Math.round(totalC / count),
            fats: Math.round(totalF / count)
        };
    };
    const stats = calculateStats();

    const renderIngredients = (ingredients: string[] = []) => {
        if (!ingredients || ingredients.length === 0) return '';
        const cleaned = ingredients.map(text => {
             let clean = text.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').trim(); 
             clean = clean.replace(/^[\d\s.,/]+(g|kg|ml|cl|l|mg|c\.à\.s|c\.à\.c|cuillères?|tranches?|morceaux?|bottes?|sachets?|boites?|pots?|verres?|tasses?|pincées?|têtes?|gousses?|feuilles?|brins?|filets?|pavés?|escalopes?|poignées?)?(\s+(d'|de|du|des)\s+)?/i, '');
             return clean.charAt(0).toUpperCase() + clean.slice(1);
        });
        return cleaned.slice(0, 4).join(', ') + (cleaned.length > 4 ? '...' : '');
    };

    if (isInitializing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black">
                <Loader2 className="animate-spin text-purple-500 mb-3" size={40} />
                <p className="text-purple-200 font-display text-lg animate-pulse">Synchronisation...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
             
             {/* Background Image & Overlay */}
             <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-30 fixed"
                  alt="Planning Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1a0520]/80 to-black fixed"></div>
             </div>

             <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10">
                
                {/* Header */}
                <div className="text-center mb-10 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-900 to-purple-600 shadow-[0_0_30px_rgba(147,51,234,0.3)] mb-4 border border-purple-500/30">
                        <PremiumCalendar size={32} className="text-purple-100" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display text-purple-500 mb-2 drop-shadow-md">
                        Semainier
                    </h1>
                    <p className="text-purple-200/60 text-sm font-light tracking-widest uppercase mb-6">
                        Planifiez votre semaine en un clic
                    </p>

                    {plan && (
                        <div className="flex gap-3 animate-fade-in flex-wrap justify-center">
                            <button onClick={handleDeletePlan} className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 px-6 py-3 rounded-full backdrop-blur-md border border-red-500/30 transition-all text-xs font-bold uppercase tracking-wide">
                                <Trash2 size={14} /> Effacer
                            </button>
                        </div>
                    )}
                </div>

                {!plan ? (
                    /* ETAT 1 : CONFIGURATION (STYLE SCAN - MAUVE) */
                    <div className="max-w-2xl mx-auto animate-fade-in">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-1.5 shadow-2xl mb-10">
                            <div className="bg-black/40 rounded-[1.7rem] p-8 border border-white/5">
                                
                                <div className="text-center mb-8">
                                    <PremiumSparkles size={40} className="text-purple-400 mx-auto mb-4" />
                                    <h3 className="font-display text-2xl text-white mb-2">Générer votre Menu</h3>
                                    <p className="text-gray-400 text-sm">MiamChef organise vos repas, vos courses et votre batch cooking.</p>
                                </div>

                                <div className="space-y-6">
                                    {/* Selecteurs Style Sombre */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
                                            <Leaf size={12} /> Régime Alimentaire
                                        </label>
                                        <div className="relative group">
                                            <div className="flex items-center justify-between bg-[#151515] hover:bg-[#1a1a1a] text-white px-4 py-4 rounded-xl border border-white/10 focus-within:border-purple-500/50 transition-colors">
                                                <span className="font-medium text-sm text-gray-200">{dietary}</span>
                                                <ChevronDown size={16} className="text-gray-500" />
                                            </div>
                                            <select 
                                                value={dietary}
                                                onChange={(e) => setDietary(e.target.value)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            >
                                                {["Classique (Aucun)", "Végétarien", "Vegan", "Halal", "Casher", "Sans Gluten", "Sans Lactose", "Régime Crétois", "Sportif (Protéiné)"].map(opt => 
                                                    <option key={opt} value={opt} className="bg-[#1a1a1a] text-white">{opt}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
                                            <Users size={12} /> Convives
                                        </label>
                                        <div className="relative group">
                                            <div className="flex items-center justify-between bg-[#151515] hover:bg-[#1a1a1a] text-white px-4 py-4 rounded-xl border border-white/10 focus-within:border-purple-500/50 transition-colors">
                                                <span className="font-medium text-sm text-gray-200">{people} personne{people > 1 ? 's' : ''}</span>
                                                <ChevronDown size={16} className="text-gray-500" />
                                            </div>
                                            <select 
                                                value={people}
                                                onChange={(e) => setPeople(parseInt(e.target.value))}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            >
                                                {[1,2,3,4,5,6,7,8].map(n => 
                                                    <option key={n} value={n} className="bg-[#1a1a1a] text-white">{n} personne{n > 1 ? 's' : ''}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    {/* CHAMP INGREDIENTS AJOUTÉ */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">
                                            <Carrot size={12} /> Vos ingrédients (Optionnel)
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                value={ingredients}
                                                onChange={(e) => setIngredients(e.target.value)}
                                                placeholder="Ex: J'ai 3 courgettes, des oeufs et du riz à utiliser..."
                                                className="w-full h-24 bg-[#151515] hover:bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-purple-500/50 focus:ring-0 outline-none transition-colors resize-none placeholder:text-gray-600 text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button 
                                        onClick={handleGenerate}
                                        disabled={status === 'loading'}
                                        className="w-full mt-4 py-5 rounded-xl bg-gradient-to-r from-purple-700 to-[#2e1065] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-purple-900/40 hover:shadow-purple-700/60 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
                                    >
                                        {status === 'loading' ? <Loader2 className="animate-spin" /> : <>Générer la Semaine <Calendar size={16}/></>}
                                    </button>

                                    {errorMessage && (
                                        <p className="text-red-400 text-xs text-center mt-2">{errorMessage}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ETAT 2 : RESULTAT (PLANNING) */
                    <div className="animate-fade-in space-y-8 pb-20" id="meal-plan-container">
                        
                        {/* Batch Cooking Card */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl backdrop-blur-sm">
                            <div className="absolute top-0 right-0 bg-purple-600/20 text-purple-200 text-[10px] px-4 py-2 rounded-bl-2xl font-bold uppercase tracking-wider border-l border-b border-purple-500/20">
                                Étape 1 : Dimanche
                            </div>
                            <h4 className="font-display text-2xl text-purple-200 mb-6 flex items-center gap-3">
                                <PremiumUtensils size={28} /> 
                                Préparation (Batch Cooking)
                            </h4>
                            {plan.batchCookingTips && plan.batchCookingTips.length > 0 ? (
                                <ul className="grid md:grid-cols-2 gap-4">
                                    {plan.batchCookingTips.map((tip, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5 items-start">
                                            <PremiumTimer size={20} className="shrink-0 mt-0.5 text-purple-400" /> 
                                            <span className="font-medium leading-relaxed">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-4 gap-4 bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
                            <div className="text-center border-r border-white/10 last:border-0">
                                <div className="text-xl font-display text-white">{stats.calories}</div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Kcal/j</div>
                            </div>
                            <div className="text-center border-r border-white/10 last:border-0">
                                <div className="text-xl font-display text-blue-400">{stats.proteins}g</div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Protéines</div>
                            </div>
                            <div className="text-center border-r border-white/10 last:border-0">
                                <div className="text-xl font-display text-yellow-400">{stats.carbs}g</div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Glucides</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-display text-red-400">{stats.fats}g</div>
                                <div className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Lipides</div>
                            </div>
                        </div>

                        {/* Grid Days */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {plan.days.map((day, idx) => (
                                <div key={idx} className="meal-card bg-[#121212] p-5 rounded-3xl shadow-lg border border-white/10 flex flex-col hover:border-purple-500/30 transition-colors group">
                                    <h4 className="font-display text-xl text-gray-100 mb-4 pb-2 border-b border-white/10 text-purple-400 flex justify-between items-center group-hover:text-purple-300 transition-colors">
                                        {day.day}
                                    </h4>
                                    <div className="space-y-3 flex-1">
                                        {day.breakfast && (
                                            <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                                <span className="text-[9px] font-bold text-yellow-500/80 uppercase tracking-wide mb-1 block flex items-center gap-1"><PremiumCoffee size={10}/> Petit-Déj</span>
                                                <p className="font-bold text-gray-200 line-clamp-2 leading-tight text-xs">{day.breakfast.name}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 leading-snug">{renderIngredients(day.breakfast.ingredients)}</p>
                                            </div>
                                        )}
                                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                            <span className="text-[9px] font-bold text-blue-400/80 uppercase tracking-wide mb-1 block flex items-center gap-1"><PremiumChefHat size={12}/> Midi</span>
                                            <p className="font-bold text-gray-200 line-clamp-3 leading-tight text-sm">{day.lunch.name}</p>
                                            <p className="text-[10px] text-gray-500 mt-1 leading-snug">{renderIngredients(day.lunch.ingredients)}</p>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                            <span className="text-[9px] font-bold text-purple-400/80 uppercase tracking-wide mb-1 block flex items-center gap-1"><PremiumSoup size={10}/> Soir</span>
                                            <p className="font-bold text-gray-200 line-clamp-3 leading-tight text-sm">{day.dinner.name}</p>
                                            <p className="text-[10px] text-gray-500 mt-1 leading-snug">{renderIngredients(day.dinner.ingredients)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Floating Action Button (Only in Plan View) */}
                {plan && (
                    <div className="fixed bottom-24 left-0 w-full px-6 md:px-0 z-40 pointer-events-none print:hidden flex justify-center">
                         <div className="max-w-md w-full pointer-events-auto">
                            <button 
                                onClick={handleExportToShoppingList} 
                                disabled={addedToList} 
                                className={`w-full py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10 backdrop-blur-xl ${addedToList ? 'bg-gray-900 text-gray-400' : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/50 shadow-lg'}`}
                            >
                                {addedToList ? <><Check size={18} /> Liste générée</> : <><ShoppingCart size={18} /> Ajouter à ma liste</>}
                            </button>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealPlanner;
