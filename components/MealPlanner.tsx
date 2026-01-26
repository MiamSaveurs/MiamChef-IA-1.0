
import React, { useState, useEffect } from 'react';
import { generateWeeklyMenu } from '../services/geminiService';
import { saveWeeklyPlan, getWeeklyPlan, addToShoppingList, deleteWeeklyPlan } from '../services/storageService';
import { WeeklyPlan, LoadingState } from '../types';
import { Calendar, Sparkles, Loader2, ShoppingCart, Check, Trash2, Download, Clock, ChefHat, Soup, ChevronDown, Utensils, AlertCircle, Coffee, Croissant } from 'lucide-react';

const MealPlanner: React.FC = () => {
    const [plan, setPlan] = useState<WeeklyPlan | null>(null);
    const [status, setStatus] = useState<LoadingState>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [dietary, setDietary] = useState('Équilibré (Classique)');
    const [people, setPeople] = useState(2);
    const [addedToList, setAddedToList] = useState(false);

    useEffect(() => { loadPlan(); }, []);

    const loadPlan = async () => {
        const saved = await getWeeklyPlan();
        if (saved) setPlan(saved);
    };

    const handleGenerate = async () => {
        setStatus('loading');
        setErrorMessage('');
        setAddedToList(false);
        try {
            const newPlan = await generateWeeklyMenu(dietary, people);
            if (!newPlan) throw new Error("L'IA n'a pas renvoyé de planning valide.");
            
            setPlan(newPlan);
            await saveWeeklyPlan(newPlan);
            setStatus('success');
        } catch (e: any) {
            console.error("Erreur planning:", e);
            setStatus('error');
            setErrorMessage(e.message || "Erreur de connexion à l'IA. Vérifiez votre clé API.");
            alert(`Erreur : ${e.message || "Vérifiez votre clé API ou votre connexion."}`);
        }
    };

    const handleDeletePlan = async (e: React.MouseEvent) => {
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

    const handleDownloadPDF = () => {
        const element = document.getElementById('meal-plan-container');
        if (!element) return;
        
        const elementToPrint = element.cloneNode(true) as HTMLElement;
        elementToPrint.classList.add('pdf-layout');
        document.body.appendChild(elementToPrint);

        const opt = {
          margin: 5,
          filename: `miamchef-planning-${new Date().toISOString().slice(0, 10)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        
        // @ts-ignore
        if (window.html2pdf) {
          // @ts-ignore
          window.html2pdf().set(opt).from(elementToPrint).save().then(() => {
              document.body.removeChild(elementToPrint);
          });
        }
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

    return (
        <div className="pb-32 px-4 pt-6 max-w-6xl mx-auto min-h-screen font-body">
             <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-2xl"><Calendar className="text-purple-600" size={28} /></div>
                    <div>
                        <h2 className="text-3xl font-display text-chef-dark leading-none">Semainier IA</h2>
                        <p className="text-gray-500 text-sm font-body">Laissez MiamChef IA Planifier & Organiser votre semaine</p>
                    </div>
                </div>
                {plan && (
                    <div className="flex gap-2">
                        <button onClick={handleDownloadPDF} className="bg-purple-50 text-purple-600 p-3 rounded-full hover:bg-purple-100 transition-colors shadow-sm"><Download size={20} /></button>
                        <button onClick={handleDeletePlan} className="bg-red-50 text-red-500 p-3 rounded-full hover:bg-red-100 transition-colors shadow-sm cursor-pointer border border-red-100"><Trash2 size={20} /></button>
                    </div>
                )}
            </header>

            {status === 'error' && errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 font-bold animate-pulse">
                    <AlertCircle size={24} />
                    <span>{errorMessage}</span>
                </div>
            )}

            {!plan ? (
                <div className="animate-fade-in max-w-3xl mx-auto">
                    
                    {/* SECTION 1: BATCH COOKING PREVIEW (ALWAYS VISIBLE) */}
                    <div className="bg-orange-50 border-2 border-orange-100 p-6 rounded-[2rem] mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-orange-200 text-orange-900 text-[10px] px-3 py-1 rounded-bl-xl font-bold uppercase tracking-wider">
                            Étape 1
                        </div>
                        <h3 className="font-display text-2xl text-orange-900 mb-2 flex items-center gap-2">
                            <Utensils size={24} className="text-orange-600" /> Préparation (Batch Cooking)
                        </h3>
                        <p className="text-orange-800/70 text-sm mb-4">
                            L'IA générera ici vos instructions de préparation du dimanche pour gagner 2h par jour en semaine.
                        </p>
                        <div className="flex gap-2 opacity-60">
                            <span className="bg-white/50 px-3 py-1.5 rounded-lg border border-orange-200 text-xs text-orange-800 font-medium">Ex: Cuisson du riz pour 3 jours</span>
                            <span className="bg-white/50 px-3 py-1.5 rounded-lg border border-orange-200 text-xs text-orange-800 font-medium">Ex: Découpe des légumes</span>
                        </div>
                    </div>

                    {/* CONFIGURATION FORM */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-card border border-gray-100 text-center relative z-10">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="mb-6">
                                <Sparkles size={48} className="text-purple-300 mx-auto mb-4" />
                                <h3 className="font-display text-2xl text-chef-dark mb-2">Générer votre Menu</h3>
                                <p className="text-gray-500 text-sm">Création de menus complets (Petit-déj, Déjeuner, En-cas, Dîner) + Liste de courses</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Régime</label>
                                    <div className="relative">
                                        <select value={dietary} onChange={(e) => setDietary(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none cursor-pointer appearance-none">
                                            <option value="Équilibré (Classique)">Équilibré</option>
                                            <option value="Régime Méditerranéen">Régime Méditerranéen (80/20)</option>
                                            <option value="Végétarien">Végétarien</option>
                                            <option value="Vegan">Vegan</option>
                                            <option value="Halal">Halal</option>
                                            <option value="Casher">Casher</option>
                                            <option value="Sans Gluten">Sans Gluten</option>
                                            <option value="Sans Porc">Sans Porc</option>
                                            <option value="Keto">Keto</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Personnes</label>
                                    <div className="relative">
                                        <select value={people} onChange={(e) => setPeople(parseInt(e.target.value))} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none cursor-pointer appearance-none">
                                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleGenerate} disabled={status === 'loading'} className="w-full bg-chef-green text-white font-display text-xl py-4 rounded-2xl shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                                {status === 'loading' ? <Loader2 className="animate-spin" /> : <Sparkles />} {status === 'loading' ? 'L\'IA réfléchit...' : 'Générer ma semaine'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-fade-in pb-12" id="meal-plan-container">
                    
                    {/* SECTION 1: BATCH COOKING RESULTS */}
                    <div className="bg-orange-50 border-2 border-orange-100 p-6 rounded-[2rem] relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 bg-orange-200 text-orange-900 text-[10px] px-3 py-1 rounded-bl-xl font-bold uppercase tracking-wider">
                            Étape 1 : Organisation
                        </div>
                        <h4 className="font-display text-2xl text-orange-900 mb-4 flex items-center gap-2">
                            <Utensils size={28} className="text-orange-600" /> 
                            Préparation (Batch Cooking)
                        </h4>
                        
                        {plan.batchCookingTips && plan.batchCookingTips.length > 0 ? (
                            <ul className="grid md:grid-cols-2 gap-4">
                                {plan.batchCookingTips.map((tip, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-orange-900 bg-white p-4 rounded-xl border border-orange-100 shadow-sm items-start">
                                        <Clock size={20} className="shrink-0 mt-0.5 text-orange-500" /> 
                                        <span className="font-medium leading-relaxed">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-orange-800 italic">Aucune astuce générée pour cette semaine.</p>
                        )}
                    </div>

                    <div className="w-full h-px bg-gray-200 my-8"></div>

                    {/* SECTION 2: MEAL PLAN GRID */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Calendar size={24}/></div>
                            <h3 className="font-display text-3xl text-chef-dark">Votre Menu Semaine</h3>
                        </div>

                        {/* Stats Dashboard */}
                        <div className="bg-white p-6 rounded-3xl shadow-card border border-purple-100 mb-6">
                            <div className="grid grid-cols-4 gap-4 text-center divide-x divide-gray-100">
                                <div><div className="text-2xl font-display text-chef-dark">{stats.calories}</div><div className="text-[10px] text-gray-400 font-bold uppercase">Kcal/j (Total)</div></div>
                                <div><div className="text-xl font-display text-blue-500">{stats.proteins}g</div><div className="text-[10px] text-gray-400 font-bold uppercase">Protéines</div></div>
                                <div><div className="text-xl font-display text-yellow-500">{stats.carbs}g</div><div className="text-[10px] text-gray-400 font-bold uppercase">Glucides</div></div>
                                <div><div className="text-xl font-display text-red-500">{stats.fats}g</div><div className="text-[10px] text-gray-400 font-bold uppercase">Lipides</div></div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 grid-days">
                            {plan.days.map((day, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                                    <h4 className="font-display text-xl text-chef-dark mb-4 pb-2 border-b border-gray-50 text-purple-700 flex justify-between items-center">
                                        {day.day}
                                    </h4>
                                    <div className="space-y-3 flex-1">
                                        {/* Breakfast */}
                                        {day.breakfast && (
                                            <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-100">
                                                <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-wide mb-1 block flex items-center gap-1"><Coffee size={12}/> Petit-Déj</span>
                                                <p className="font-bold text-gray-800 line-clamp-2 leading-tight text-xs">{day.breakfast.name}</p>
                                                <div className="mt-1 text-[9px] text-gray-400">{day.breakfast.calories} Kcal</div>
                                            </div>
                                        )}

                                        {/* Lunch */}
                                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1 block flex items-center gap-1"><ChefHat size={12}/> Midi</span>
                                            <p className="font-bold text-gray-800 line-clamp-3 leading-tight text-sm">{day.lunch.name}</p>
                                            <div className="mt-1 text-[9px] text-gray-400">{day.lunch.calories} Kcal</div>
                                        </div>

                                        {/* Snack */}
                                        {day.snack && (
                                            <div className="bg-green-50 p-3 rounded-2xl border border-green-100">
                                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1 block flex items-center gap-1"><Croissant size={12}/> En-cas</span>
                                                <p className="font-bold text-gray-800 line-clamp-2 leading-tight text-xs">{day.snack.name}</p>
                                                <div className="mt-1 text-[9px] text-gray-400">{day.snack.calories} Kcal</div>
                                            </div>
                                        )}

                                        {/* Dinner */}
                                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1 block flex items-center gap-1"><Soup size={12}/> Soir</span>
                                            <p className="font-bold text-gray-800 line-clamp-3 leading-tight text-sm">{day.dinner.name}</p>
                                            <div className="mt-1 text-[9px] text-gray-400">{day.dinner.calories} Kcal</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fixed bottom-24 left-0 w-full px-4 md:px-0 z-40 pointer-events-none print:hidden" data-html2canvas-ignore="true">
                         <div className="max-w-md mx-auto pointer-events-auto">
                            <button onClick={handleExportToShoppingList} disabled={addedToList} className={`w-full py-4 rounded-2xl shadow-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${addedToList ? 'bg-green-700 text-white' : 'bg-chef-green text-white hover:scale-105'}`}>
                                {addedToList ? <><Check /> Liste générée !</> : <><ShoppingCart /> Tout ajouter à ma liste</>}
                            </button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealPlanner;
