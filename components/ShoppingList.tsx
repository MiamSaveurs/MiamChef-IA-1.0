
import React, { useState, useEffect } from 'react';
import { getShoppingList, toggleShoppingItem, deleteShoppingItem, clearShoppingList } from '../services/storageService';
import { ShoppingItem } from '../types';
import { ShoppingCart, Trash2, Check, Leaf, Share2, Store, X, Search, ClipboardList, Layers, Beef, Milk, Wheat, Coffee, Droplet, Package } from 'lucide-react';

// --- LOGIQUE DE CATÉGORISATION (RAYONS) ---

const CATEGORIES = {
  PRODUCE: { id: 'produce', label: 'Fruits & Légumes', icon: Leaf, color: 'text-green-600', bg: 'bg-green-100', keywords: ['pomme', 'poire', 'banane', 'carotte', 'salade', 'oignon', 'ail', 'citron', 'courgette', 'tomate', 'légume', 'fruit', 'avocat', 'poivron', 'champignon', 'concombre', 'aubergine', 'chou', 'épinard', 'herbe', 'persil', 'basilic', 'coriandre', 'menthe', 'orange', 'fraise', 'framboise', 'melon', 'pastèque', 'patate', 'terre', 'radis'] },
  PROTEIN: { id: 'protein', label: 'Viandes & Poissons', icon: Beef, color: 'text-red-600', bg: 'bg-red-100', keywords: ['poulet', 'boeuf', 'steak', 'viande', 'poisson', 'saumon', 'thon', 'jambon', 'lardon', 'saucisse', 'dinde', 'porc', 'veau', 'crevette', 'moule', 'cabillaud', 'haché', 'merguez', 'chipolata', 'rôti', 'filet', 'escalope'] },
  DAIRY: { id: 'dairy', label: 'Frais & Crèmerie', icon: Milk, color: 'text-blue-500', bg: 'bg-blue-100', keywords: ['lait', 'beurre', 'crème', 'yaourt', 'fromage', 'oeuf', 'emmental', 'comté', 'cheddar', 'mozzarella', 'parmesan', 'chèvre', 'feta', 'blanc', 'skyr', 'dessert'] },
  GROCERY: { id: 'grocery', label: 'Épicerie', icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-100', keywords: ['riz', 'pâte', 'farine', 'sucre', 'huile', 'sel', 'poivre', 'conserve', 'sauce', 'pain', 'biscotte', 'céréale', 'biscuit', 'gâteau', 'chocolat', 'miel', 'confiture', 'café', 'thé', 'épice', 'vinaigre', 'moutarde', 'mayonnaise', 'ketchup', 'bouillon', 'cube', 'levure', 'vanille', 'amande', 'noix', 'chips', 'apéro'] },
  DRINKS: { id: 'drinks', label: 'Boissons', icon: Coffee, color: 'text-cyan-600', bg: 'bg-cyan-100', keywords: ['eau', 'jus', 'vin', 'bière', 'soda', 'coca', 'sirop', 'boisson', 'alcool', 'cidre', 'limonade'] },
  HOME: { id: 'home', label: 'Hygiène & Maison', icon: Droplet, color: 'text-purple-600', bg: 'bg-purple-100', keywords: ['savon', 'papier', 'dentifrice', 'shampoing', 'gel', 'douche', 'lessive', 'vaisselle', 'éponge', 'sac', 'poubelle', 'mouchoir', 'nettoyant'] },
  OTHER: { id: 'other', label: 'Divers', icon: Package, color: 'text-gray-500', bg: 'bg-gray-100', keywords: [] }
};

const getCategory = (itemText: string) => {
    const clean = itemText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    for (const key in CATEGORIES) {
        // @ts-ignore
        const cat = CATEGORIES[key];
        if (cat.id === 'other') continue;
        if (cat.keywords.some((k: string) => clean.includes(k))) {
            return key;
        }
    }
    return 'OTHER';
};

// --- FIN LOGIQUE CATÉGORISATION ---

const ShoppingList: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveStep, setDriveStep] = useState<'retailers' | 'ingredients'>('retailers');
  const [userCity, setUserCity] = useState(localStorage.getItem('miamchef_city') || '');
  
  // Persist Retailer
  const [selectedRetailer, setSelectedRetailer] = useState<{name: string, urlPattern: string} | null>(() => {
      const saved = localStorage.getItem('miamchef_retailer');
      return saved ? JSON.parse(saved) : null;
  });

  const retailers = [
    { name: 'E.Leclerc Drive', color: 'bg-blue-600', urlPattern: 'https://www.leclercdrive.fr/recherche.aspx?txtRecherche=' },
    { name: 'Carrefour Drive', color: 'bg-blue-500', urlPattern: 'https://www.carrefour.fr/s?q=' },
    { name: 'Intermarché', color: 'bg-red-600', urlPattern: 'https://www.intermarche.com/recherche/' },
    { name: 'Auchan Drive', color: 'bg-red-500', urlPattern: 'https://www.auchan.fr/recherche?text=' },
    { name: 'Courses U', color: 'bg-cyan-500', urlPattern: 'https://www.coursesu.com/search?q=' },
    { name: 'Chronodrive', color: 'bg-green-600', urlPattern: 'https://www.chronodrive.com/search/result?keywords=' },
    { name: 'Casino Drive', color: 'bg-green-700', urlPattern: 'https://www.casino.fr/recherche/produits?q=' },
    { name: 'Lidl', color: 'bg-yellow-500', urlPattern: 'https://www.lidl.fr/q/search?q=' }
  ];

  useEffect(() => { loadItems(); }, []);

  const loadItems = async () => {
    try {
      const data = await getShoppingList();
      // On garde le tri checked/unchecked pour la logique interne, mais l'affichage sera géré par les catégories
      setItems(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleToggle = async (item: ShoppingItem) => {
    // Optimistic update
    const updatedItems = items.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i);
    setItems(updatedItems);
    await toggleShoppingItem(item);
    loadItems(); // Refresh to be sure
  };

  const handleDelete = async (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    await deleteShoppingItem(id);
  };

  const handleClear = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setItems([]); 
    await clearShoppingList();
  };

  const handleShare = async () => {
    const text = `📝 Ma liste de courses MiamChef IA :\n\n${items.filter(i => !i.checked).map(i => `- ${cleanSearchTerm(i.text)}`).join('\n')}`;
    if (navigator.share) {
        try { await navigator.share({ title: 'Ma liste', text: text }); } catch (err) {}
    } else {
        copyToClipboard(text);
        alert("Copié !");
    }
  };

  const copyToClipboard = (text: string) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
  };

  const handleRetailerSelect = (retailer: any) => {
      setSelectedRetailer(retailer);
      localStorage.setItem('miamchef_retailer', JSON.stringify(retailer));
      
      if (userCity.trim()) {
          window.open(`https://www.google.com/maps/search/${encodeURIComponent(`Drive ${retailer.name} ${userCity}`)}`, '_blank');
      }
      setDriveStep('ingredients');
  };

  const cleanSearchTerm = (text: string) => {
      let clean = text.replace(/^[-*•]\s*/, '').trim(); 
      clean = clean.replace(/\s*\(.*?\)/g, '');
      clean = clean.replace(/^[\d\s.,/]+(g|kg|ml|cl|l|mg|c\.à\.s|c\.à\.c|cuillères?|tranches?|morceaux?|bottes?|sachets?|boites?|pots?|verres?|tasses?|pincées?|têtes?|gousses?|feuilles?|brins?|filets?|pavés?|escalopes?|poignées?)?(\s+(d'|de|du|des)\s+)?/i, '');
      clean = clean.replace(/^\d+\s+/, '');
      return clean.charAt(0).toUpperCase() + clean.slice(1).trim();
  };

  const handleDirectSearch = (itemText: string) => {
      if (!selectedRetailer) {
          alert("Sélectionnez d'abord un magasin.");
          setDriveStep('retailers');
          return;
      }
      const clean = cleanSearchTerm(itemText);
      const url = `${selectedRetailer.urlPattern}${encodeURIComponent(clean)}`;
      if (selectedRetailer.urlPattern) {
          window.open(url, '_blank');
      } else {
          alert("Erreur de lien magasin. Veuillez réessayer.");
      }
  };

  const handleCopyAll = () => {
      const allText = items.map(i => cleanSearchTerm(i.text)).join(', ');
      copyToClipboard(allText);
      alert("Liste complète copiée !");
  };

  // --- GROUPING LOGIC ---
  const activeItems = items.filter(i => !i.checked);
  const checkedItems = items.filter(i => i.checked);

  // Group active items by category
  const groupedItems: Record<string, ShoppingItem[]> = {};
  activeItems.forEach(item => {
      const catKey = getCategory(item.text);
      if (!groupedItems[catKey]) groupedItems[catKey] = [];
      groupedItems[catKey].push(item);
  });

  return (
    <div className="pb-32 px-4 pt-6 max-w-2xl mx-auto min-h-screen font-body">
       <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl"><ShoppingCart className="text-blue-500" size={28} /></div>
                <div>
                    <h2 className="text-3xl font-display text-chef-dark leading-none">Liste de Courses</h2>
                    <p className="text-gray-500 text-sm font-body">Zéro papier, Zéro oubli</p>
                </div>
            </div>
            {items.length > 0 && (
                <button 
                    onClick={handleClear} 
                    className="flex items-center gap-2 text-red-400 hover:text-red-600 bg-white border border-red-100 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-bold text-xs shadow-sm z-10 cursor-pointer"
                >
                    <Trash2 size={16} /> Vider
                </button>
            )}
        </div>
        
        {/* BARRE D'AJOUT RAPIDE */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-2">
             <div className="relative flex-1">
                 <input 
                    type="text" 
                    placeholder="Ajouter (ex: Lait, Oeufs)..." 
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-chef-green outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            if (val.trim()) {
                                import('../services/storageService').then(mod => {
                                    mod.addToShoppingList([cleanSearchTerm(val)]).then(() => {
                                        (e.target as HTMLInputElement).value = '';
                                        loadItems();
                                    });
                                });
                            }
                        }
                    }}
                 />
                 <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
             </div>
        </div>

        <div className="flex gap-3">
             <button onClick={handleShare} disabled={items.length === 0} className="flex-1 bg-white border border-gray-200 text-chef-dark font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50">
                 <Share2 size={18} /> Partager
             </button>
             <button onClick={() => { setDriveStep('retailers'); setShowDriveModal(true); }} disabled={items.length === 0} className="flex-1 bg-chef-green text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600 flex items-center justify-center gap-2 disabled:opacity-50">
                 <Store size={18} /> Commander au Drive
             </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin text-chef-green"><Store /></div></div>
      ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <Leaf size={48} className="mx-auto text-green-200 mb-4" />
             <p className="text-gray-400 font-display text-xl">Votre liste est vide.</p>
          </div>
      ) : (
          <div className="space-y-6">
             
             {/* 1. DISPLAY ACTIVE ITEMS BY CATEGORY */}
             {Object.keys(CATEGORIES).map(catKey => {
                 // @ts-ignore
                 const categoryInfo = CATEGORIES[catKey];
                 const catItems = groupedItems[catKey];
                 
                 if (!catItems || catItems.length === 0) return null;

                 const Icon = categoryInfo.icon;

                 return (
                     <div key={catKey} className="bg-white rounded-[2rem] shadow-card border border-gray-100 overflow-hidden">
                        <div className={`px-4 py-3 border-b border-gray-50 flex items-center gap-2 ${categoryInfo.bg}`}>
                            <Icon size={18} className={categoryInfo.color} />
                            <h3 className={`font-bold text-sm uppercase tracking-wide ${categoryInfo.color}`}>{categoryInfo.label}</h3>
                            <span className="ml-auto text-xs font-bold opacity-50 bg-white px-2 py-0.5 rounded-full">{catItems.length}</span>
                        </div>
                        <div>
                             {catItems.map((item) => (
                                 <div key={item.id} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-none">
                                    <div onClick={() => handleToggle(item)} className="cursor-pointer w-6 h-6 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-chef-green transition-colors">
                                    </div>
                                    <span onClick={() => handleToggle(item)} className="flex-1 font-body text-lg cursor-pointer text-chef-dark">
                                        {cleanSearchTerm(item.text)}
                                    </span>
                                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                                 </div>
                             ))}
                        </div>
                     </div>
                 );
             })}

             {/* 2. COMPLETED ITEMS (ALWAYS AT BOTTOM) */}
             {checkedItems.length > 0 && (
                 <div className="mt-8">
                     <div className="flex items-center gap-2 mb-3 px-2 opacity-50">
                         <Check size={16} />
                         <span className="text-xs font-bold uppercase tracking-widest">Déjà dans le panier ({checkedItems.length})</span>
                     </div>
                     <div className="bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden opacity-70">
                        {checkedItems.map((item) => (
                             <div key={item.id} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-none">
                                <div onClick={() => handleToggle(item)} className="cursor-pointer w-6 h-6 rounded-lg border-2 border-chef-green bg-chef-green flex items-center justify-center">
                                    <Check size={14} className="text-white" />
                                </div>
                                <span onClick={() => handleToggle(item)} className="flex-1 font-body text-lg cursor-pointer text-gray-400 line-through decoration-gray-400">
                                    {cleanSearchTerm(item.text)}
                                </span>
                                <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                             </div>
                        ))}
                     </div>
                 </div>
             )}
          </div>
      )}
      
      {showDriveModal && (
          <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-[2rem] w-full max-w-md p-6 shadow-2xl relative animate-fade-in flex flex-col max-h-[85vh]">
                  <button onClick={() => setShowDriveModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full"><X size={20}/></button>
                  <h3 className="font-display text-2xl text-chef-dark mb-1">{driveStep === 'retailers' ? 'Choisir votre Drive' : 'Remplissage Express'}</h3>
                  
                  {driveStep === 'retailers' ? (
                      <div className="grid grid-cols-2 gap-3 mt-4 overflow-y-auto">
                          {retailers.map((r) => (
                              <button key={r.name} onClick={() => handleRetailerSelect(r)} className={`p-4 rounded-xl text-white font-bold text-sm shadow-sm flex flex-col items-center justify-center gap-2 ${r.color} ${selectedRetailer?.name === r.name ? 'ring-4 ring-offset-2 ring-chef-green' : ''}`}>
                                  <Store size={20} /> {r.name}
                              </button>
                          ))}
                      </div>
                  ) : (
                      <div className="flex flex-col gap-2 mt-4 overflow-y-auto flex-1">
                           <button onClick={handleCopyAll} className="mb-2 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-sm flex items-center justify-center gap-2">
                               <ClipboardList size={16}/> Copier toute la liste
                           </button>
                           <p className="text-xs text-gray-400 text-center mb-2">Cliquez sur <Search size={10} className="inline"/> pour chercher l'article sur le site du Drive.</p>
                           {items.filter(i => !i.checked).map((item) => (
                               <button key={item.id} onClick={() => handleDirectSearch(item.text)} className="text-left px-4 py-3 rounded-xl border-2 border-gray-100 bg-white hover:border-chef-green flex justify-between group">
                                   <span className="font-medium text-gray-800">{cleanSearchTerm(item.text)}</span>
                                   <div className="bg-gray-100 p-1.5 rounded-full group-hover:bg-chef-green group-hover:text-white"><Search size={14} /></div>
                               </button>
                           ))}
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default ShoppingList;
