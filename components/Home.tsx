
import React from 'react';
import { AppView } from '../types';
import { ChefHat, Camera, Wine, ArrowRight, Book, Crown, Fingerprint, Euro, HeartPulse, ShoppingCart, Briefcase, Calendar } from 'lucide-react';

interface HomeProps {
  setView: (view: AppView) => void;
  isOnline?: boolean;
}

const Home: React.FC<HomeProps> = ({ setView, isOnline = true }) => {
  
  const handleProtectedAction = (view: AppView) => {
      if (isOnline) {
          setView(view);
      } else {
          alert("Cette fonctionnalité nécessite une connexion internet pour utiliser l'Intelligence Artificielle.");
      }
  };

  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="relative min-h-screen font-body bg-[#111111] text-white overflow-x-hidden pb-40">
      
      {/* --- HEADER --- */}
      <div className="px-6 pt-6 flex justify-between items-start">
          <div className="flex items-center gap-2">
              <div className="bg-[#509f2a] p-1.5 rounded-lg shadow-lg">
                  <ChefHat size={18} className="text-white" />
              </div>
              <div>
                  <h1 className="font-display text-xl text-white leading-none tracking-tight">MiamChef IA</h1>
                  <p className="text-[#666] text-[9px] uppercase font-bold tracking-[0.15em] mt-0.5">
                      {formattedDate}
                  </p>
              </div>
          </div>
          <button 
            onClick={() => setView(AppView.SUBSCRIPTION)}
            className="flex items-center gap-1.5 bg-[#252525] border border-[#333] px-3 py-1 rounded-lg hover:bg-[#333] transition-colors"
          >
              <Crown size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Premium</span>
          </button>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="px-6 pt-8 pb-6">
          <div className="inline-flex items-center gap-2 bg-[#252525] px-2.5 py-1 rounded-md mb-6 border border-[#333]">
               <Briefcase size={10} className="text-[#666]" />
               <span className="text-[8px] font-bold uppercase tracking-wider text-[#666]">Pour Particuliers & Professionnels</span>
          </div>

          <h2 className="text-[38px] font-display text-white leading-[1.05] mb-1">
              Créez des recettes
          </h2>
          <h2 className="text-[38px] font-display text-white leading-[1.05] mb-1">
              uniques
          </h2>
          <h2 className="text-[38px] font-display text-[#509f2a] leading-[1.05] mb-5">
              avec ce que vous avez.
          </h2>
          <p className="text-[#888] text-sm font-medium leading-tight max-w-[280px] mb-8">
              Le premier livre de cuisine <span className="text-white font-bold">infini</span>. Le Couteau Suisse culinaire français indispensable.
          </p>

          {/* Boutons Hero (Carnet / Liste) */}
          <div className="grid grid-cols-2 gap-3 mb-8">
              <button 
                  onClick={() => setView(AppView.RECIPE_BOOK)}
                  className="bg-[#1a1a1a] p-3.5 rounded-xl flex items-center gap-3 hover:bg-[#222] transition-colors border border-[#252525]"
              >
                  <div className="w-9 h-9 rounded-lg bg-[#f0b12b] flex items-center justify-center text-white shrink-0">
                      <Book size={18} />
                  </div>
                  <div className="text-left">
                      <span className="block text-white font-bold text-[10px] uppercase tracking-wide">Mon Carnet</span>
                      <span className="block text-[#555] text-[9px]">Mes Recettes</span>
                  </div>
              </button>

              <button 
                  onClick={() => setView(AppView.SHOPPING_LIST)}
                  className="bg-[#1a1a1a] p-3.5 rounded-xl flex items-center gap-3 hover:bg-[#222] transition-colors border border-[#252525]"
              >
                  <div className="w-9 h-9 rounded-lg bg-[#3b82f6] flex items-center justify-center text-white shrink-0">
                      <ShoppingCart size={18} />
                  </div>
                  <div className="text-left">
                      <span className="block text-white font-bold text-[10px] uppercase tracking-wide">Ma Liste</span>
                      <span className="block text-[#555] text-[9px]">Mes Courses</span>
                  </div>
              </button>
          </div>
      </div>

      {/* --- WHITE CARD (SUR-MESURE) --- */}
      <div className="px-6 mb-12">
          <div className="bg-white rounded-[2rem] p-7 shadow-2xl text-center">
              <div className="flex justify-around items-center mb-6 px-2">
                  <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#f4fcf0] text-[#509f2a] flex items-center justify-center border border-[#e8f5e3]">
                          <Fingerprint size={20} />
                      </div>
                      <span className="text-[9px] font-bold text-[#666] uppercase tracking-wider">Sur-Mesure</span>
                  </div>
                  <div className="w-[1px] h-8 bg-gray-100"></div>
                  <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#fff5f5] text-[#eb5757] flex items-center justify-center border border-[#ffebeb]">
                          <HeartPulse size={20} />
                      </div>
                      <span className="text-[9px] font-bold text-[#666] uppercase tracking-wider">Santé</span>
                  </div>
                  <div className="w-[1px] h-8 bg-gray-100"></div>
                  <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#f0f7ff] text-[#2d9cdb] flex items-center justify-center border border-[#e3f0ff]">
                          <Euro size={20} />
                      </div>
                      <span className="text-[9px] font-bold text-[#666] uppercase tracking-wider">Économies</span>
                  </div>
              </div>
              <button 
                  onClick={() => setView(AppView.VALUE_PROPOSITION)}
                  className="w-full border border-gray-100 text-[#444] font-bold text-[10px] py-3 rounded-xl uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                  Découvrir nos solutions <ArrowRight size={12} className="text-[#509f2a]" />
              </button>
          </div>
      </div>

      {/* --- FEATURE CARDS SECTION --- */}
      <div className="px-6 space-y-10">
          
          {/* 1. ATELIER DU CHEF */}
          <div>
              <div className="flex justify-between items-end mb-3">
                  <h3 className="font-display text-lg text-white">Atelier du Chef</h3>
                  <span className="bg-[#1e1e1e] text-[#509f2a] text-[8px] font-bold px-2 py-0.5 rounded border border-[#333] uppercase tracking-wider">CRÉATIONS UNIQUES</span>
              </div>
              <div 
                  onClick={() => handleProtectedAction(AppView.RECIPE_CREATOR)}
                  className={`bg-[#064e3b] rounded-[2rem] p-8 relative overflow-hidden h-56 cursor-pointer border border-[#065f46] group transition-all active:scale-[0.98] ${!isOnline ? 'opacity-50 grayscale' : ''}`}
              >
                  {/* Image de fond (Chef comme sur l'image) */}
                  <img 
                    src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=800&q=80" 
                    className="absolute right-0 top-0 h-full w-[60%] object-cover z-0 opacity-80 transition-transform duration-700 group-hover:scale-105" 
                    alt="Chef" 
                  />
                  
                  {/* Overlay Dégradé pour le texte */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#064e3b] via-[#064e3b]/90 to-transparent z-10"></div>
                  
                  <div className="relative z-20 h-full flex flex-col justify-center">
                      <div className="text-[#509f2a] text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50">Chef</div>
                      <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                              <ChefHat size={28} className="text-white" />
                          </div>
                          <h4 className="font-display text-2xl text-white leading-tight">Création de<br/>Recette</h4>
                      </div>
                      <p className="text-[#a7f3d0] text-xs leading-relaxed font-medium max-w-[200px]">
                          Créez des recettes uniques avec ce que vous avez, adaptées à votre style.
                      </p>
                  </div>
              </div>
          </div>

          {/* 2. SEMAINIER */}
          <div>
              <div className="flex justify-between items-end mb-3">
                  <h3 className="font-display text-lg text-white">Votre Semaine</h3>
                  <span className="bg-[#1e1e1e] text-purple-400 text-[8px] font-bold px-2 py-0.5 rounded border border-[#333] uppercase tracking-wider">CHARGE MENTALE : ZÉRO</span>
              </div>
              <div 
                  onClick={() => handleProtectedAction(AppView.PLANNING)}
                  className={`bg-[#2e1a47] rounded-[2rem] p-8 relative overflow-hidden h-56 cursor-pointer border border-[#3e2361] group transition-all active:scale-[0.98] ${!isOnline ? 'opacity-50 grayscale' : ''}`}
              >
                  <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80" className="absolute right-0 top-0 h-full w-[60%] object-cover z-0 opacity-80 transition-transform duration-700 group-hover:scale-105" alt="Planning" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2e1a47] via-[#2e1a47]/90 to-transparent z-10"></div>
                  
                  <div className="relative z-20 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4 text-white">
                          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                             <Calendar size={28} className="text-white" />
                          </div>
                          <h4 className="font-display text-2xl leading-tight">Organisateur<br/>Semainier</h4>
                      </div>
                      <p className="text-[#ddd6fe] text-xs leading-relaxed font-medium max-w-[200px]">
                          L'IA génère vos menus du Lundi au Dimanche et remplit votre liste de courses.
                      </p>
                  </div>
              </div>
          </div>

          {/* 3. SCAN FRIGO */}
          <div>
              <div className="flex justify-between items-end mb-3">
                  <h3 className="font-display text-lg text-white">Stop au Gaspillage</h3>
                  <span className="bg-[#1e1e1e] text-blue-400 text-[8px] font-bold px-2 py-0.5 rounded border border-[#333] uppercase tracking-wider">RENTABILISÉ EN 2 JOURS</span>
              </div>
              <div 
                  onClick={() => handleProtectedAction(AppView.SCAN_FRIDGE)}
                  className={`bg-[#1a3b5c] rounded-[2rem] p-8 relative overflow-hidden h-56 cursor-pointer border border-[#1e40af] group transition-all active:scale-[0.98] ${!isOnline ? 'opacity-50 grayscale' : ''}`}
              >
                  <img src="https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=800&q=80" className="absolute right-0 top-0 h-full w-[60%] object-cover z-0 opacity-80 transition-transform duration-700 group-hover:scale-105" alt="Fridge" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a3b5c] via-[#1a3b5c]/90 to-transparent z-10"></div>
                  
                  <div className="relative z-20 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4 text-white">
                          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                             <Camera size={28} className="text-white" />
                          </div>
                          <h4 className="font-display text-2xl leading-tight">Scan Frigo IA</h4>
                      </div>
                      <p className="text-[#bfdbfe] text-xs leading-relaxed font-medium max-w-[200px]">
                          Prenez une photo, l'IA crée une recette culinaire avec vos restes.
                      </p>
                  </div>
              </div>
          </div>

          {/* 4. SOMMELIER */}
          <div>
              <div className="flex justify-between items-end mb-3">
                  <h3 className="font-display text-lg text-white">L'Accord Parfait</h3>
                  <span className="bg-[#1e1e1e] text-red-400 text-[8px] font-bold px-2 py-0.5 rounded border border-[#333] uppercase tracking-wider">AMATEURS & PROS</span>
              </div>
              <div 
                  onClick={() => handleProtectedAction(AppView.SOMMELIER)}
                  className={`bg-[#4a1a1a] rounded-[2rem] p-8 relative overflow-hidden h-56 cursor-pointer border border-[#991b1b] group transition-all active:scale-[0.98] ${!isOnline ? 'opacity-50 grayscale' : ''}`}
              >
                  <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80" className="absolute right-0 top-0 h-full w-[60%] object-cover z-0 opacity-80 transition-transform duration-700 group-hover:scale-105" alt="Wine" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4a1a1a] via-[#4a1a1a]/90 to-transparent z-10"></div>
                  
                  <div className="relative z-20 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4 text-white">
                          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                             <Wine size={28} className="text-white" />
                          </div>
                          <h4 className="font-display text-2xl leading-tight">Sommelier IA</h4>
                      </div>
                      <p className="text-[#fecaca] text-xs leading-relaxed font-medium max-w-[200px]">
                          Pour vos dîners ou vos clients. L'accord mets & vins idéal instantané.
                      </p>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};

export default Home;
