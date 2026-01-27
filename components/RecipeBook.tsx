
import React, { useState, useEffect } from 'react';
import { getSavedRecipes, deleteRecipeFromBook } from '../services/storageService';
import { SavedRecipe } from '../types';
import { Trash2, ChevronLeft, Calendar, ChefHat, Activity, Sparkles, Soup, Hammer, BarChart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GourmetBook } from './Icons';

const RecipeBook: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        const data = await getSavedRecipes();
        setRecipes(data);
        setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Voulez-vous vraiment supprimer cette recette ?')) {
      try {
        await deleteRecipeFromBook(id);
        setRecipes(prev => prev.filter(r => r.id !== id));
        if (selectedRecipe?.id === id) setSelectedRecipe(null);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Impossible de supprimer la recette.");
      }
    }
  };

  const NutriBadge = ({ score }: { score: string }) => {
    const colors = { 'A': '#008148', 'B': '#8ac53e', 'C': '#fecb02', 'D': '#ee8100', 'E': '#e63e11' };
    const color = colors[score as keyof typeof colors] || '#ccc';
    return (
      <span className="font-bold text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm" style={{ backgroundColor: color }}>
        {score}
      </span>
    );
  };

  if (selectedRecipe) {
    return (
      <div className="pb-32 px-4 pt-6 max-w-4xl mx-auto min-h-screen">
        <button 
          onClick={() => setSelectedRecipe(null)}
          className="mb-4 flex items-center gap-2 text-gray-500 hover:text-chef-green transition-colors font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm"
        >
          <ChevronLeft size={16} /> Retour au carnet
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-card border border-gray-100 overflow-hidden animate-fade-in">
           
           {/* Detail View Header Image */}
           <div className="w-full h-64 md:h-80 relative bg-gray-100">
               {selectedRecipe.image ? (
                   <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" />
               ) : (
                   <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                       <ChefHat size={64} />
                   </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                   <h1 className="text-3xl md:text-4xl font-display text-white mb-2">{selectedRecipe.title}</h1>
                   <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {selectedRecipe.date}</span>
                        {selectedRecipe.metrics && (
                            <>
                                <span className="flex items-center gap-1"><Activity size={14}/> {selectedRecipe.metrics.caloriesPerPerson} Kcal</span>
                                <NutriBadge score={selectedRecipe.metrics.nutriScore} />
                                <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm"><BarChart size={12}/> {selectedRecipe.metrics.difficulty}</span>
                            </>
                        )}
                   </div>
               </div>
               <button 
                    onClick={(e) => handleDelete(e, selectedRecipe.id)}
                    className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-md text-white hover:bg-red-500 transition-colors rounded-full shadow-lg"
                >
                    <Trash2 size={20} />
                </button>
           </div>
           
           {/* Utensils Section in Saved View */}
           {selectedRecipe.utensils && selectedRecipe.utensils.length > 0 && (
                <div className="px-8 pt-8">
                    <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 shadow-sm">
                         <h3 className="font-display text-xl text-orange-800 mb-4 flex items-center gap-2">
                             <Soup size={20}/> Ustensiles
                         </h3>
                         <div className="flex flex-wrap gap-2">
                             {selectedRecipe.utensils.map((utensil, idx) => (
                                 <div key={idx} className="bg-white text-orange-700 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 border border-orange-100">
                                     <Hammer size={12} className="opacity-50" />
                                     {utensil}
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
           )}

           <div className="p-8 md:p-10 markdown-prose font-body text-chef-dark">
             <ReactMarkdown>{selectedRecipe.markdownContent}</ReactMarkdown>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 px-4 pt-6 max-w-6xl mx-auto min-h-screen">
      <header className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-yellow-50 rounded-2xl">
          <GourmetBook size={32} />
        </div>
        <div>
           <h2 className="text-3xl font-display text-chef-dark leading-none">Mon Carnet</h2>
           <p className="text-gray-500 text-sm font-body">Mes recettes sauvegardées</p>
        </div>
      </header>

      {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin text-chef-green"><Sparkles /></div></div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
           <ChefHat size={48} className="mx-auto text-gray-200 mb-4" />
           <p className="text-gray-400 font-display text-xl">Votre carnet est vide.</p>
           <p className="text-gray-400 text-sm mt-2">Créez des recettes pour les ajouter ici !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white rounded-3xl shadow-card border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full"
            >
              {/* Card Image */}
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                  {recipe.image ? (
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
                          <ChefHat size={32} />
                      </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                       {recipe.metrics && <NutriBadge score={recipe.metrics.nutriScore} />}
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, recipe.id)}
                    className="absolute top-3 left-3 p-2 bg-white/80 hover:bg-red-500 hover:text-white text-gray-500 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                  >
                      <Trash2 size={16} />
                  </button>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display text-xl text-chef-dark mb-2 group-hover:text-chef-green transition-colors line-clamp-2 leading-tight">
                    {recipe.title}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                     <span className="flex items-center gap-1"><Calendar size={12} /> {recipe.date}</span>
                     {recipe.metrics && (
                         <div className="flex gap-2">
                             <span className="flex items-center gap-1 font-bold text-orange-500"><Activity size={12}/> {recipe.metrics.caloriesPerPerson}</span>
                             <span className="flex items-center gap-1 font-bold text-purple-500"><BarChart size={12}/> {recipe.metrics.difficulty}</span>
                         </div>
                     )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeBook;
