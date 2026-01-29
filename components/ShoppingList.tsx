
import React, { useState, useEffect } from 'react';
import { getShoppingList, toggleShoppingItem, deleteShoppingItem, clearShoppingList } from '../services/storageService';
import { t } from '../services/translationService'; // Import translation
import { ShoppingItem } from '../types';
import { Trash2, Check, Leaf, Share2, Store, X, Search, ClipboardList, Beef, Milk, Wheat, Coffee, Droplet, Package, Snowflake, Candy, ChevronLeft } from 'lucide-react';
import { WickerBasket } from './Icons';

const getCategories = () => ({
  FRESH_PRODUCE: { id: 'produce', label: t('sl_cat_produce'), icon: Leaf, color: 'text-green-400', keywords: ['pomme', 'poire', 'banane', 'carotte', 'salade', 'oignon', 'ail', 'citron', 'courgette', 'tomate', 'legume', 'fruit', 'avocat', 'poivron', 'champignon', 'concombre', 'aubergine', 'chou', 'epinard', 'herbe', 'persil', 'basilic', 'coriandre', 'menthe', 'orange', 'fraise', 'framboise', 'melon', 'pasteque', 'patate', 'terre', 'radis', 'navet', 'poireau', 'clementine', 'mandarine', 'raisin', 'brocoli', 'apple', 'pear', 'banana', 'carrot', 'salad', 'onion', 'garlic', 'lemon', 'zucchini', 'tomato', 'vegetable', 'fruit', 'avocado', 'pepper', 'mushroom', 'cucumber', 'eggplant', 'cabbage', 'spinach', 'herb', 'parsley', 'basil', 'coriander', 'mint', 'orange', 'strawberry', 'raspberry', 'melon', 'watermelon', 'potato', 'radish', 'turnip', 'leek', 'tangerine', 'grape', 'broccoli'] },
  FRESH_MARKET: { id: 'market', label: t('sl_cat_market'), icon: Beef, color: 'text-red-400', keywords: ['poulet', 'boeuf', 'steak', 'viande', 'poisson', 'saumon', 'jambon', 'lardon', 'saucisse', 'dinde', 'porc', 'veau', 'crevette', 'moule', 'cabillaud', 'hache', 'merguez', 'chipolata', 'roti', 'filet', 'escalope', 'canard', 'bacon', 'charcuterie', 'salami', 'pave', 'truite', 'bar', 'daurade', 'chicken', 'beef', 'steak', 'meat', 'fish', 'salmon', 'ham', 'sausage', 'turkey', 'pork', 'veal', 'shrimp', 'mussel', 'cod', 'mince', 'roast', 'fillet', 'cutlet', 'duck', 'bacon', 'salami', 'trout', 'seabass', 'bream'] },
  DAIRY: { id: 'dairy', label: t('sl_cat_dairy'), icon: Milk, color: 'text-blue-400', keywords: ['lait', 'beurre', 'creme', 'yaourt', 'fromage', 'oeuf', 'emmental', 'comte', 'cheddar', 'mozzarella', 'parmesan', 'chevre', 'feta', 'blanc', 'skyr', 'dessert', 'gruyere', 'roquefort', 'camembert', 'brie', 'ricotta', 'mascarpone', 'grec', 'milk', 'butter', 'cream', 'yogurt', 'cheese', 'egg', 'cheddar', 'mozzarella', 'parmesan', 'goat', 'feta', 'white', 'skyr', 'dessert', 'brie', 'ricotta', 'mascarpone', 'greek'] },
  GROCERY_SAVORY: { id: 'grocery_savory', label: t('sl_cat_grocery_savory'), icon: Wheat, color: 'text-amber-400', keywords: ['pate', 'riz', 'semoule', 'puree', 'huile', 'vinaigre', 'sel', 'poivre', 'epice', 'moutarde', 'mayonnaise', 'ketchup', 'sauce', 'conserve', 'boite', 'bocal', 'thon', 'sardine', 'maquereau', 'haricot', 'pois', 'lentille', 'mais', 'cornichon', 'olive', 'boulgour', 'quinoa', 'couscous', 'chips', 'apero', 'cacahuete', 'bouillon', 'cube', 'soupe', 'crouton', 'tapenade', 'pesto', 'pasta', 'rice', 'semolina', 'mash', 'oil', 'vinegar', 'salt', 'pepper', 'spice', 'mustard', 'mayonnaise', 'ketchup', 'sauce', 'can', 'jar', 'tuna', 'sardine', 'mackerel', 'bean', 'pea', 'lentil', 'corn', 'pickle', 'olive', 'bulgur', 'quinoa', 'couscous', 'chips', 'peanut', 'stock', 'cube', 'soup', 'crouton', 'pesto'] },
  GROCERY_SWEET: { id: 'grocery_sweet', label: t('sl_cat_grocery_sweet'), icon: Candy, color: 'text-pink-400', keywords: ['sucre', 'farine', 'chocolat', 'biscuit', 'gateau', 'cereale', 'muesli', 'confiture', 'miel', 'pate a tartiner', 'nutella', 'bonbon', 'compote', 'sirop', 'vanille', 'levure', 'cacao', 'cafe', 'the', 'tisane', 'capsule', 'dosette', 'pain', 'biscotte', 'brioche', 'madeleine', 'speculoos', 'sugar', 'flour', 'chocolate', 'biscuit', 'cake', 'cereal', 'muesli', 'jam', 'honey', 'spread', 'candy', 'compote', 'syrup', 'vanilla', 'yeast', 'cocoa', 'coffee', 'tea', 'herbal', 'pod', 'bread', 'toast', 'brioche', 'madeleine'] },
  FROZEN: { id: 'frozen', label: t('sl_cat_frozen'), icon: Snowflake, color: 'text-cyan-400', keywords: ['surgele', 'congele', 'glace', 'sorbet', 'frite', 'pizza', 'nugget', 'frozen', 'ice', 'sorbet', 'fries', 'pizza', 'nugget'] },
  DRINKS: { id: 'drinks', label: t('sl_cat_drinks'), icon: Coffee, color: 'text-indigo-400', keywords: ['eau', 'jus', 'vin', 'biere', 'soda', 'coca', 'boisson', 'alcool', 'cidre', 'limonade', 'whisky', 'vodka', 'rhum', 'champagne', 'volvic', 'evian', 'perrier', 'water', 'juice', 'wine', 'beer', 'soda', 'coke', 'drink', 'alcohol', 'cider', 'lemonade', 'whisky', 'vodka', 'rum', 'champagne'] },
  HOME: { id: 'home', label: t('sl_cat_home'), icon: Droplet, color: 'text-purple-400', keywords: ['savon', 'papier', 'dentifrice', 'shampoing', 'gel', 'douche', 'lessive', 'vaisselle', 'eponge', 'sac', 'poubelle', 'mouchoir', 'nettoyant', 'sopalin', 'aluminium', 'film', 'rasoir', 'deodorant', 'couche', 'lingette', 'soap', 'paper', 'toothpaste', 'shampoo', 'gel', 'shower', 'laundry', 'dish', 'sponge', 'bag', 'bin', 'tissue', 'cleaner', 'foil', 'film', 'razor', 'deodorant', 'diaper', 'wipe'] },
  OTHER: { id: 'other', label: t('sl_cat_other'), icon: Package, color: 'text-gray-400', keywords: [] }
});

const getCategory = (itemText: string) => {
    const clean = itemText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (clean.includes('surgele') || clean.includes('frozen') || clean.includes('congele') || clean.includes('glace')) return 'FROZEN';
    const cats = getCategories();
    for (const key in cats) {
        // @ts-ignore
        const cat = cats[key];
        if (cat.id === 'other') continue;
        if (cat.keywords.some((k: string) => clean.includes(k))) return key;
    }
    return 'OTHER';
};

const ShoppingList: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveStep, setDriveStep] = useState<'retailers' | 'ingredients'>('retailers');
  const [userCity, setUserCity] = useState(localStorage.getItem('miamchef_city') || '');
  const [selectedRetailer, setSelectedRetailer] = useState<{name: string, urlPattern: string} | null>(() => {
      const saved = localStorage.getItem('miamchef_retailer');
      return saved ? JSON.parse(saved) : null;
  });

  const themeGradient = 'from-teal-600 to-teal-900';
  const themeShadow = 'shadow-teal-900/40';

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
      setItems(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleToggle = async (item: ShoppingItem) => {
    const updatedItems = items.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i);
    setItems(updatedItems);
    await toggleShoppingItem(item);
    loadItems();
  };

  const handleDelete = async (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    await deleteShoppingItem(id);
  };

  const handleClear = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(t('sl_btn_clear') + " ?")) {
        setItems([]); 
        await clearShoppingList();
    }
  };

  const handleShare = async () => {
    const text = `📝 ${t('sl_title')} - MiamChef :\n\n${items.filter(i => !i.checked).map(i => `- ${cleanSearchTerm(i.text)}`).join('\n')}`;
    if (navigator.share) {
        try { await navigator.share({ title: 'MiamChef List', text: text }); } catch (err) {}
    } else {
        copyToClipboard(text);
        alert(t('copied'));
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
          setDriveStep('retailers');
          return;
      }
      const clean = cleanSearchTerm(itemText);
      const url = `${selectedRetailer.urlPattern}${encodeURIComponent(clean)}`;
      window.open(url, '_blank');
  };

  const handleCopyAll = () => {
      const allText = items.map(i => cleanSearchTerm(i.text)).join(', ');
      copyToClipboard(allText);
      alert(t('copied'));
  };

  const activeItems = items.filter(i => !i.checked);
  const checkedItems = items.filter(i => i.checked);
  const groupedItems: Record<string, ShoppingItem[]> = {};
  const currentCategories = getCategories();
  
  activeItems.forEach(item => {
      const catKey = getCategory(item.text);
      if (!groupedItems[catKey]) groupedItems[catKey] = [];
      groupedItems[catKey].push(item);
  });

  return (
    <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
        
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-30 fixed"
                alt="Market Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#0a2020]/80 to-black fixed"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-10">
            
            <div className="text-center mb-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${themeGradient} shadow-[0_0_30px_rgba(20,184,166,0.3)] mb-4 border border-teal-500/30`}>
                    <WickerBasket size={32} className="text-teal-100" />
                </div>
                <h1 className="text-4xl md:text-5xl font-display text-teal-400 mb-2 drop-shadow-md">
                    {t('sl_title')}
                </h1>
                <p className="text-teal-200/60 text-sm font-light tracking-widest uppercase">
                    {t('sl_sub')}
                </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-1.5 shadow-2xl mb-10">
                <div className="bg-black/40 rounded-[1.7rem] p-6 border border-white/5">
                    
                    <div className="relative mb-6">
                        <input 
                            type="text" 
                            placeholder={t('sl_placeholder')}
                            className="w-full pl-5 pr-12 py-4 bg-[#151515] text-white rounded-xl border border-white/10 outline-none focus:border-teal-500/50 focus:bg-[#1a1a1a] transition-all placeholder:text-gray-600"
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
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors">
                            <Search size={20} />
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={handleShare} 
                            disabled={items.length === 0} 
                            className="flex-1 bg-[#1a1a1a] border border-white/10 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all disabled:opacity-50"
                        >
                            <Share2 size={16} className="text-teal-400" /> {t('sl_btn_share')}
                        </button>
                        <button 
                            onClick={() => { setDriveStep('retailers'); setShowDriveModal(true); }} 
                            disabled={items.length === 0} 
                            className={`flex-1 bg-gradient-to-r ${themeGradient} text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg ${themeShadow} hover:brightness-110 transition-all disabled:opacity-50`}
                        >
                            <Store size={16} /> {t('sl_btn_drive')}
                        </button>
                    </div>

                    {items.length > 0 && (
                        <button 
                            onClick={handleClear}
                            className="w-full mt-4 py-2 text-xs font-bold text-red-400/70 hover:text-red-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <Trash2 size={12} /> {t('sl_btn_clear')}
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin text-teal-500"><Store size={32} /></div></div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10 backdrop-blur-md">
                    <WickerBasket size={48} className="mx-auto text-white/20 mb-4" />
                    <p className="text-gray-400 font-display text-xl">{t('sl_empty')}</p>
                </div>
            ) : (
                <div className="space-y-6 pb-12 animate-fade-in">
                    {Object.keys(currentCategories).map(catKey => {
                        // @ts-ignore
                        const categoryInfo = currentCategories[catKey];
                        const catItems = groupedItems[catKey];
                        if (!catItems || catItems.length === 0) return null;
                        const Icon = categoryInfo.icon;

                        return (
                            <div key={catKey} className="bg-[#121212] rounded-[1.5rem] shadow-lg border border-white/10 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                                
                                <div className="px-5 py-4 flex items-center gap-3 bg-white/5 border-b border-white/5">
                                    <Icon size={18} className={categoryInfo.color} />
                                    <h3 className={`font-bold text-xs uppercase tracking-widest ${categoryInfo.color}`}>{categoryInfo.label}</h3>
                                    <span className="ml-auto text-[10px] font-bold text-white/50 bg-white/10 px-2 py-0.5 rounded-full">{catItems.length}</span>
                                </div>
                                
                                <div>
                                    {catItems.map((item) => (
                                        <div 
                                            key={item.id} 
                                            onClick={() => handleToggle(item)}
                                            className="flex items-center gap-4 p-4 border-b border-white/5 last:border-none hover:bg-white/5 transition-colors cursor-pointer group"
                                        >
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${item.checked ? 'bg-teal-500 border-teal-500' : 'border-gray-600 group-hover:border-teal-400'}`}>
                                                {item.checked && <Check size={12} className="text-white" />}
                                            </div>
                                            <span className={`flex-1 text-sm font-medium transition-all ${item.checked ? 'text-gray-600 line-through decoration-gray-700' : 'text-gray-200'}`}>
                                                {cleanSearchTerm(item.text)}
                                            </span>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} 
                                                className="text-gray-600 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {checkedItems.length > 0 && (
                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-3 px-2 opacity-50">
                                <Check size={14} className="text-teal-400"/>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">({checkedItems.length})</span>
                            </div>
                            <div className="bg-[#121212]/50 rounded-[1.5rem] border border-white/5 overflow-hidden">
                                {checkedItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-none opacity-50 hover:opacity-100 transition-opacity">
                                        <div onClick={() => handleToggle(item)} className="cursor-pointer w-5 h-5 rounded-md bg-white/10 border border-white/10 flex items-center justify-center">
                                            <Check size={12} className="text-gray-400" />
                                        </div>
                                        <span onClick={() => handleToggle(item)} className="flex-1 text-sm text-gray-500 line-through decoration-gray-600 cursor-pointer">
                                            {cleanSearchTerm(item.text)}
                                        </span>
                                        <button onClick={() => handleDelete(item.id)} className="text-gray-600 hover:text-red-400 p-2"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {showDriveModal && (
                <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-[2rem] w-full max-w-md p-6 shadow-2xl relative animate-fade-in flex flex-col max-h-[85vh]">
                        <button onClick={() => setShowDriveModal(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} className="text-gray-400"/></button>
                        
                        <div className="mb-6 text-center">
                            <h3 className="font-display text-2xl text-white mb-1">{driveStep === 'retailers' ? t('sl_drive_title') : t('sl_drive_express')}</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">{t('sl_connect')}</p>
                        </div>
                        
                        {driveStep === 'retailers' ? (
                            <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 custom-scrollbar">
                                {retailers.map((r) => (
                                    <button key={r.name} onClick={() => handleRetailerSelect(r)} className={`p-4 rounded-xl text-white font-bold text-sm shadow-md hover:scale-105 transition-transform flex flex-col items-center justify-center gap-2 ${r.color}`}>
                                        <Store size={20} /> {r.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                                <div className="flex items-center gap-2 mb-4">
                                     <button onClick={() => setDriveStep('retailers')} className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ChevronLeft size={16}/></button>
                                     <button onClick={handleCopyAll} className="flex-1 py-3 bg-teal-500/20 text-teal-400 border border-teal-500/30 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-teal-500/30 transition-colors">
                                        <ClipboardList size={16}/> {t('sl_copy_all')}
                                     </button>
                                </div>
                                <p className="text-xs text-center text-gray-500 mb-2">{t('sl_click_drive')}</p>
                                {items.filter(i => !i.checked).map((item) => (
                                    <button key={item.id} onClick={() => handleDirectSearch(item.text)} className="text-left px-4 py-4 bg-[#252525] rounded-xl hover:bg-[#333] border border-white/5 flex justify-between group transition-all items-center">
                                        <span className="font-medium text-gray-200 text-sm">{cleanSearchTerm(item.text)}</span>
                                        <div className="bg-teal-500 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100"><Search size={12} className="text-white"/></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ShoppingList;
