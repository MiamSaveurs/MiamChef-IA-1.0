
import React, { useState, useEffect } from 'react';
import { getSavedRecipes, deleteRecipeFromBook } from '../services/storageService';
import { SavedRecipe } from '../types';
import { Trash2, ChevronLeft, Calendar, Activity, Sparkles, Hammer, BarChart, Search, Snowflake, Leaf, X, Lock, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GourmetBook, PremiumChefHat, PremiumUtensils } from './Icons';
import InAppMessageModal from './InAppMessageModal';

const NutriBadge = ({ score }: { score: string }) => {
  const colors = { 
      'A': '#008148', // Vert foncé
      'B': '#8ac53e', // Vert clair
      'C': '#fecb02', // Jaune
      'D': '#ee8100', // Orange
      'E': '#e63e11'  // Rouge
  };
  const color = colors[score as keyof typeof colors] || '#ccc';
  return (
    <span className="font-bold text-white text-[10px] px-2 py-0.5 rounded shadow-sm border border-white/20" style={{ backgroundColor: color }}>
      {score}
    </span>
  );
};

const RecipeBook: React.FC<{ onBack: () => void, isTrialExpired?: boolean }> = ({ onBack, isTrialExpired }) => {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, title: string, message: string, actionLabel?: string, onAction?: () => void } | null>(null);

  // Thème Orange/Ambre
  const themeGradient = 'from-amber-700 to-amber-900';

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
    setModalConfig({
      isOpen: true,
      title: "Supprimer la recette",
      message: "Voulez-vous vraiment supprimer cette recette de votre carnet ?",
      actionLabel: "Supprimer",
      onAction: async () => {
        try {
          await deleteRecipeFromBook(id);
          setRecipes(prev => prev.filter(r => r.id !== id));
          if (selectedRecipe?.id === id) setSelectedRecipe(null);
        } catch {
          console.error("Erreur lors de la suppression:");
          setModalConfig({
            isOpen: true,
            title: "Erreur",
            message: "Impossible de supprimer la recette."
          });
        }
      }
    });
  };

  const handleShare = async (e: React.MouseEvent, recipe: SavedRecipe) => {
    e.stopPropagation();
    
    // Formatage de la recette pour le partage
    const ingredients = recipe.ingredientsWithQuantities?.join('\n- ') || recipe.ingredients?.join('\n- ') || '';
    const shareText = `🍳 Découvrez cette recette sur MiamChef : ${recipe.title}\n\n📝 Ingrédients :\n- ${ingredients}\n\n📖 Préparation :\n${recipe.markdownContent.replace(/#+ /g, '')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Découvrez cette recette sur MiamChef : ${recipe.title}`,
          url: window.location.href,
        });
      } catch {
        // Si l'utilisateur annule ou si ça échoue, on tente le presse-papier
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setModalConfig({
        isOpen: true,
        title: "Recette Partagée !",
        message: "La recette complète a été copiée dans votre presse-papier. Vous pouvez maintenant la coller où vous le souhaitez !"
      });
    } catch {
      setModalConfig({
        isOpen: true,
        title: "Oups",
        message: "Impossible de copier la recette automatiquement."
      });
    }
  };

  // Fonction pour ignorer les accents et la casse (Ex: "bœuf" == "boeuf")
  const normalizeText = (text: string) => 
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredRecipes = recipes.filter(r => {
      if (!searchTerm.trim()) return true;
      
      const term = normalizeText(searchTerm);
      
      // Recherche dans le titre
      const matchesTitle = normalizeText(r.title).includes(term);
      
      // Recherche dans les ingrédients (Panier)
      const matchesIngredients = r.ingredients?.some(i => normalizeText(i).includes(term)) || false;
      
      // Recherche dans les ingrédients détaillés (Cuisine)
      const matchesQtyIngredients = r.ingredientsWithQuantities?.some(i => normalizeText(i).includes(term)) || false;
      
      return matchesTitle || matchesIngredients || matchesQtyIngredients;
  });

  return (
    <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-30 fixed"
                alt="Book Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1a0f05]/80 to-black fixed"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10">
            
            {/* ALERT BANNER IF EXPIRED */}
            {isTrialExpired && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6 flex items-center justify-center gap-3 animate-fade-in backdrop-blur-md">
                    <Lock size={16} className="text-red-400" />
                    <p className="text-xs text-red-200 font-bold uppercase tracking-wide">Mode Lecture Seule - Abonnement requis pour créer</p>
                </div>
            )}

            {/* Header / Navigation */}
            <div className="mb-8 flex justify-between items-center">
                {selectedRecipe ? (
                    <>
                        <button 
                            onClick={() => setSelectedRecipe(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 border border-white/10 transition-colors backdrop-blur-md"
                        >
                            <ChevronLeft size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Retour</span>
                        </button>
                        <div className="flex gap-2">
                            <button 
                                onClick={(e) => handleShare(e, selectedRecipe)}
                                className="p-2.5 bg-white/10 backdrop-blur-md text-white hover:bg-amber-500/80 transition-colors rounded-full border border-white/10"
                                title="Partager la recette"
                            >
                                <Share2 size={18} />
                            </button>
                            <button 
                                onClick={(e) => handleDelete(e, selectedRecipe.id)}
                                className="p-2.5 bg-white/10 backdrop-blur-md text-white hover:bg-red-500/80 transition-colors rounded-full border border-white/10"
                                title="Supprimer la recette"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    // Si on est en mode expiré, on affiche un bouton "Retour aux offres" spécial
                    isTrialExpired ? (
                        <button 
                            onClick={onBack}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/80 rounded-full text-white hover:bg-red-600 border border-red-400/30 transition-colors backdrop-blur-md shadow-lg"
                        >
                            <ChevronLeft size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Débloquer l'app</span>
                        </button>
                    ) : (
                        // Sinon c'est le header standard (ou bouton retour standard si on venait d'ailleurs)
                        <button 
                            onClick={onBack}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white hover:bg-white/20 border border-white/10 transition-colors backdrop-blur-md"
                        >
                            <ChevronLeft size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Accueil</span>
                        </button>
                    )
                )}
            </div>

            {!selectedRecipe && (
                 <div className="text-center mb-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${themeGradient} shadow-[0_0_30px_rgba(245,158,11,0.3)] mb-4 border border-amber-500/30`}>
                        <GourmetBook size={32} className="text-amber-100" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display text-amber-500 mb-2 drop-shadow-md">
                        Mon Carnet
                    </h1>
                    <p className="text-amber-200/60 text-sm font-light tracking-widest uppercase">
                        Mes recettes sauvegardées
                    </p>
                </div>
            )}

            {selectedRecipe ? (
                /* VUE DÉTAILLÉE */
                <div className="animate-fade-in space-y-6 pb-20">
                    <div className="relative bg-[#121212] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                        
                        {/* Image Header */}
                        <div className="h-64 md:h-80 relative group">
                            {selectedRecipe.image ? (
                                <img src={selectedRecipe.image} className="w-full h-full object-cover" alt={selectedRecipe.title} />
                            ) : (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                    <PremiumChefHat size={48} className="opacity-20 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="p-8 relative">
                             
                             {/* Informations Recette (Sous la photo) */}
                             <div className="mb-8 border-b border-white/10 pb-6">
                                <h2 className="text-3xl md:text-4xl font-display text-white mb-4 leading-tight">{selectedRecipe.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                        <Calendar size={14} className="text-amber-500"/> {selectedRecipe.date}
                                    </span>
                                    {selectedRecipe.metrics && (
                                        <>
                                            <span className="flex items-center gap-2 font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                                <Activity size={14} className="text-amber-500"/> {selectedRecipe.metrics.caloriesPerPerson} Kcal
                                            </span>
                                            <span className="flex items-center gap-2 font-bold bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                                <BarChart size={14} className="text-amber-500"/> {selectedRecipe.metrics.proteins || 0}g Prot.
                                            </span>
                                            <div className="scale-110 flex items-center gap-2">
                                                <NutriBadge score={selectedRecipe.metrics.nutriScore} />
                                                {selectedRecipe.servings && (
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                                        {selectedRecipe.servings} Pers.
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                             </div>

                             {/* Storage Advice */}
                             {selectedRecipe.storageAdvice && (
                                <div className="mb-6 p-4 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-start gap-3">
                                    <div className="bg-blue-500/20 p-2 rounded-full text-blue-300">
                                        <Snowflake size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Conservation</h3>
                                        <p className="text-sm text-blue-100/90 leading-relaxed">{selectedRecipe.storageAdvice}</p>
                                    </div>
                                </div>
                             )}

                             {/* INGREDIENTS WITH QUANTITIES BLOCK */}
                             {selectedRecipe.ingredientsWithQuantities && selectedRecipe.ingredientsWithQuantities.length > 0 && (
                                <div className="mb-6 p-5 rounded-2xl border border-dashed border-white/10 bg-white/5 relative overflow-hidden">
                                     <h3 className="font-display text-lg text-amber-500 mb-4 flex items-center gap-2">
                                        <Leaf size={18} /> Ingrédients & Dosages
                                    </h3>
                                    <ul className="space-y-2">
                                        {selectedRecipe.ingredientsWithQuantities.map((ing, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-amber-500"></span>
                                                <span>{ing}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                             {/* Ustensiles */}
                             {selectedRecipe.utensils && selectedRecipe.utensils.length > 0 && (
                                <div className="mb-8 p-5 rounded-2xl border border-dashed border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden">
                                    <h3 className="font-display text-lg text-amber-500 mb-3 flex items-center gap-2">
                                        <PremiumUtensils size={18}/> Matériel Requis
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRecipe.utensils.map((utensil, idx) => (
                                            <div key={idx} className="bg-[#1a1a1a] text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-white/10 flex items-center gap-2 shadow-sm">
                                                <Hammer size={10} className="opacity-50" />
                                                {utensil}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Markdown Content */}
                            <div className="markdown-prose prose-invert text-gray-300 leading-relaxed space-y-4">
                                <ReactMarkdown 
                                components={{
                                    h1: ({ ...props }) => <h1 className="hidden" {...props} />, // On cache le titre H1 car déjà affiché en haut
                                    h2: ({ ...props }) => <h2 className="text-lg font-bold text-white mb-3 mt-8 border-b border-white/10 pb-2 flex items-center gap-2 text-amber-500" {...props} />,
                                    strong: ({ ...props }) => <strong className="text-amber-400" {...props} />,
                                    li: ({ ...props }) => <li className="flex items-start gap-2 mb-2" {...props}><span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-amber-500"></span><span className="flex-1">{props.children}</span></li>
                                }}
                                >
                                {selectedRecipe.markdownContent}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* VUE LISTE (GRILLE) */
                <>
                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mb-8 relative flex items-center">
                        <input 
                            type="text"
                            placeholder="Rechercher (Titre ou Ingrédient)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    (e.target as HTMLInputElement).blur();
                                }
                            }}
                            className="w-full bg-[#151515] text-white pl-5 pr-14 py-4 rounded-xl border border-white/10 focus:border-amber-500/50 focus:ring-0 outline-none transition-colors text-sm placeholder:text-gray-600 shadow-md"
                        />
                        
                        <div className="absolute right-2 flex items-center gap-1">
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="p-2 text-gray-500 hover:text-white transition-colors rounded-full"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <button 
                                className="p-2.5 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-white transition-all shadow-sm active:scale-95"
                                onClick={() => {
                                    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                                    input?.blur();
                                }}
                            >
                                <Search size={18} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin text-amber-500"><Sparkles size={32} /></div></div>
                    ) : filteredRecipes.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10 backdrop-blur-md animate-fade-in">
                            <GourmetBook size={48} className="mx-auto text-white/20 mb-4" />
                            <p className="text-gray-400 font-display text-xl">
                                {searchTerm ? "Aucun résultat pour cette recherche." : "Votre carnet est vide."}
                            </p>
                            <p className="text-gray-600 text-sm mt-2">
                                {searchTerm ? "Essayez un autre mot clé." : "Commencez par créer une recette !"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {filteredRecipes.map((recipe) => (
                                <div 
                                    key={recipe.id}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    className="bg-[#121212] rounded-3xl shadow-lg border border-white/10 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all cursor-pointer group relative overflow-hidden flex flex-col h-full"
                                >
                                    {/* Card Image */}
                                    <div className="h-48 relative overflow-hidden bg-gray-900">
                                        {recipe.image ? (
                                            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] text-gray-700">
                                                <PremiumChefHat size={32} />
                                            </div>
                                        )}
                                        
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-80"></div>
                                        
                                        {/* Boutons Actions - Sur l'image (discret) */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => handleShare(e, recipe)}
                                                className="p-2 bg-black/60 text-gray-400 hover:text-amber-400 rounded-full backdrop-blur-md transition-colors border border-white/10"
                                                title="Partager"
                                            >
                                                <Share2 size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(e, recipe.id)}
                                                className="p-2 bg-black/60 text-gray-400 hover:text-red-400 rounded-full backdrop-blur-md transition-colors border border-white/10"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col -mt-10 relative z-10">
                                        <h3 className="font-display text-xl text-gray-100 mb-2 group-hover:text-amber-500 transition-colors line-clamp-2 leading-tight drop-shadow-sm">
                                            {recipe.title}
                                        </h3>
                                        
                                        <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap justify-between items-center text-xs text-gray-500 gap-y-2">
                                            <span className="flex items-center gap-1.5"><Calendar size={12} /> {recipe.date}</span>
                                            {recipe.metrics && (
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1 font-bold text-amber-500"><Activity size={12}/> {recipe.metrics.caloriesPerPerson}</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <NutriBadge score={recipe.metrics.nutriScore} />
                                                        {recipe.servings && (
                                                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                                                {recipe.servings}P
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>

        {modalConfig && (
            <InAppMessageModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(null)}
                title={modalConfig.title}
                message={modalConfig.message}
                actionLabel={modalConfig.actionLabel}
                onAction={modalConfig.onAction}
            />
        )}
    </div>
  );
};

export default RecipeBook;
