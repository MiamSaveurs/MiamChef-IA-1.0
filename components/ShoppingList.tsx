
import React, { useState, useEffect } from 'react';
import { getShoppingList, toggleShoppingItem, deleteShoppingItem, clearShoppingList } from '../services/storageService';
import { ShoppingItem } from '../types';
import { ShoppingCart, Trash2, Check, Leaf, Share2, Store, X, Search, ClipboardList } from 'lucide-react';

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
      data.sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1));
      setItems(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleToggle = async (item: ShoppingItem) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i).sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1)));
    await toggleShoppingItem(item);
    loadItems();
  };

  const handleDelete = async (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    await deleteShoppingItem(id);
  };

  const handleClear = async (e: React.MouseEvent) => {
    // SUPPRESSION RADICALE ET IMMÉDIATE
    e.preventDefault();
    e.stopPropagation();
    
    // 1. Mise à jour de l'affichage tout de suite
    setItems([]); 
    
    // 2. Nettoyage base de données en arrière-plan
    await clearShoppingList();
  };

  const handleShare = async () => {
    const text = `📝 Ma liste de courses MiamChef IA :\n\n${items.filter(i => !i.checked).map(i => `- ${i.text}`).join('\n')}`;
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
      return text.replace(/^[\d.,]+\s*(g|kg|ml|cl|l|mg|c\.à\.s|c\.à\.c|cuillères?|tranches?|morceaux?|bottes?|sachets?|boites?|pots?|verres?|tasses?|pincées?|têtes?|gousses?|feuilles?|brins?|filets?|pavés?|escalopes?)?(\s+(d'|de\s+))?/i, '').replace(/^\d+\s+/, '').trim();
  };

  const handleDirectSearch = (itemText: string) => {
      if (!selectedRetailer) {
          alert("Sélectionnez d'abord un magasin.");
          setDriveStep('retailers');
          return;
      }
      // Nettoyage agressif avant recherche
      const clean = cleanSearchTerm(itemText);
      const url = `${selectedRetailer.urlPattern}${encodeURIComponent(clean)}`;
      
      // Sécurité URL
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
        <div className="flex gap-3">
             <button onClick={handleShare} disabled={items.length === 0} className="flex-1 bg-white border border-gray-200 text-chef-dark font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50">
                 <Share2 size={18} /> Partager
             </button>
             <button onClick={() => { setDriveStep('retailers'); setShowDriveModal(true); }} disabled={items.length === 0} className="flex-1 bg-chef-green text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600 flex items-center justify-center gap-2 disabled:opacity-50">
                 <Store size={18} /> Commander au Drive
             </button>
        </div>
      </header>

      {loading ? <div className="flex justify-center py-20"><div className="animate-spin text-chef-green"><Store /></div></div> : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <Leaf size={48} className="mx-auto text-green-200 mb-4" />
             <p className="text-gray-400 font-display text-xl">Votre liste est vide.</p>
          </div>
      ) : (
          <div className="bg-white rounded-[2rem] shadow-card border border-gray-100 overflow-hidden mb-8">
             {items.map((item) => (
                 <div key={item.id} className={`flex items-center gap-4 p-4 border-b border-gray-50 last:border-none ${item.checked ? 'bg-gray-50' : ''}`}>
                    <div onClick={() => handleToggle(item)} className={`cursor-pointer w-6 h-6 rounded-lg border-2 flex items-center justify-center ${item.checked ? 'bg-chef-green border-chef-green' : 'border-gray-300'}`}>
                        {item.checked && <Check size={14} className="text-white" />}
                    </div>
                    <span onClick={() => handleToggle(item)} className={`flex-1 font-body text-lg cursor-pointer ${item.checked ? 'text-gray-400 line-through' : 'text-chef-dark'}`}>{item.text}</span>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                 </div>
             ))}
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
