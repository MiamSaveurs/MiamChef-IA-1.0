
import React from 'react';
import { AppView } from '../types';
import { ChefHat, Camera, Wine, ArrowRight, Book, Crown, Fingerprint, Euro, HeartPulse, ShoppingCart, Briefcase, Calendar, Sparkles } from 'lucide-react';

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
    <div className="relative min-h-screen font-body bg-[#111111] text-white overflow-x-hidden pb-32">
      
      {/* --- HEADER --- */}
      <div className="px-6 pt-8 flex justify-between items-start">
          <div>
              <div className="flex items-center gap-2 mb-1">
                  <div className="bg-chef-green p-1.5 rounded-lg">
                      <ChefHat size={20} className="text-white" />
                  </div>
                  <h1 className="font-display text-2xl text-white tracking-wide">MiamChef IA</h1>
              </div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                  <Calendar size={10} /> {formattedDate}
              </p>
          </div>
          <button 
            onClick={() => setView(AppView.SUBSCRIPTION)}
            className="flex items-center gap-2 bg-[#2a2a2a] border border-[#333] px-3 py-1.5 rounded-lg hover:bg-[#333] transition-colors"
          >
              <Crown size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Premium</span>
          </button>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="px-6 pt-6 pb-8">
          <div className="inline-flex items-center gap-2 bg-[#2a2a2a] px-3 py-1.5 rounded-lg mb-6 border border-[#333]">
               <Briefcase size={12} className="text-gray-400" />
               <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Pour Particuliers & Professionnels</span>
          </div>

          <h2 className="text-4xl font-display text-white leading-[1.1] mb-2">
              Créez des recettes <br/> uniques
          </h2>
          <h2 className="text-4xl font-display text-chef-green leading-[1.1] mb-4">
              avec ce que vous avez.
          </h2>
          <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm mb-8">
              Le premier livre de cuisine <span className="text-white font-bold">infini</span>. Le Couteau Suisse culinaire français indispensable.
          </p>

          {/* Boutons Hero */}
          <div className="grid grid-cols-2 gap-4">
              <button 
                  onClick={() => setView(AppView.RECIPE_BOOK)}
                  className="bg-[#1e1e1e] p-4 rounded-2xl flex items-center gap-4 hover:bg-[#252525] transition-colors border border-[#2a2a2a]"
              >
                  <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-white shrink-0">
                      <Book size={20} />
                  </div>
                  <div className="text-left">
                      <span className="block text-white font-bold text-xs uppercase tracking-wide">Mon Carnet</span>
                      <span className="block text-gray-500 text-[10px]">Mes Recettes</span>
                  </div>
              </button>

              <button 
                  onClick={() => setView(AppView.SHOPPING_LIST)}
                  className="bg-[#1e1e1e] p-4 rounded-2xl flex items-center gap-4 hover:bg-[#252525] transition-colors border border-[#2a2a2a]"
              >
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0">
                      <ShoppingCart size={20} />
                  </div>
                  <div className="text-left">
                      <span className="block text-white font-bold text-xs uppercase tracking-wide">Ma Liste</span>
                      <span className="block text-gray-500 text-[10px]">Mes Courses</span>
                  </div>
              </button>
          </div>
      </div>

      {/* --- VALUE PROPOSITION CARD (WHITE) --- */}
      <div className="px-6 mb-10 relative z-10">
          <div className="bg-white rounded-3xl p-6 shadow-xl text-center">
              <div className="flex justify-center items-center gap-8 mb-6">
                  <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-green-50 text-chef-green flex items-center justify-center border border-green-100">
                          <Fingerprint size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Sur-Mesure</span>
                  </div>
                  <div className="w-px h-10 bg-gray-100"></div>
                  <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
                          <HeartPulse size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Santé</span>
                  </div>
                  <div className="w-px h-10 bg-gray-100"></div>
                  <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
                          <Euro size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Économies</span>
                  </div>
              </div>
              <button 
                  onClick={() => setView(AppView.VALUE_PROPOSITION)}
                  className="w-full border border-gray-200 text-gray-600 font-bold text-xs py-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                  Découvrir nos solutions <ArrowRight size={14} />
              </button>
          </div>
      </div>

      {/* --- FEATURE CARDS (COLORED) --- */}
      <div className="px-6 space-y-8">
          
          {/* 1. ATELIER DU CHEF (VERT) */}
          <div>
              <div className="flex justify-between items-end mb-3">
                  <h3 className="font-display text-xl text-white">Atelier du Chef</h3>
                  <span className="bg-[#1e1e1e] text-chef-green text-[9px] font-bold px-2 py-1 rounded border border-[#333] uppercase">Créations Uniques</span>
              </div>
              <div 
                  onClick={() => handleProtectedAction(AppView.RECIPE_CREATOR)}
                  className={`bg-[#0f392b] rounded-3xl p-6 relative overflow-hidden h-48 cursor-pointer border border-[#1a4a39] group transition-transform active:scale-[0.99] ${!isOnline ? 'opacity-50 grayscale' : ''}`}
              >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f392b] to-transparent z-10"></div>
                  <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=800&q=80" className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Chef" />
                  
                  <div className="relative z-20 h-full flex flex-col justify-center max-w-[60%]">
                      <div className="flex items-center gap-2 mb-3 text-white">
                          <ChefHat size={24} />
                          <span className="font-bold text-lg font-display">Création de Recette</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed font-medium">
                          Créez des recettes uniques avec ce que vous avez, adaptées à votre style.
                      </p>
                  </div>
              </div>
          </div>

          {/* 2. SEMAINIER (VIOLET) */}
          <div>
              <div className="flex justify-between items-end mb-3">
                  <h3 className="font-display text-xl text-white">Votre Semaine</h3>
                  <span className="bg-[#1e1e1e] text-purple-400 text-[9px] font-bold px-2 py-1 rounded border border-[#333] uppercase">Charge Mentale : Zéro</span>
              </div>
              <div 
                  onClick={() => handleProtectedAction(AppView.PLANNING)}
                  className={`bg-[#2e1a47] rounded-3xl p-6 relative overflow-hidden h-48 cursor-pointer border border-[#3e2361] group transition-transform active:scale-[0.99] ${!isOnline ? 'opacity-50 grayscale' : ''}`}
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#2e1a47] to-transparent z-10"></div>
                  <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80" className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Planning" />
                  
                  <div className="relative z-20 h-full flex flex-col justify-center max-w-[60%]">
                      <div className="flex items-center gap-2 mb-3 text-white">
                          <Calendar size={24} />
                          <span className="font-bold text-lg font-display">Organisateur Semainier</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed font-medium">
                          L'IA génère vos menus du Lundi au Dimanche et remplit votre liste de courses.
                      </p>
                  </div>
              </div>
          </div>

          {/* 3. SCAN FRIGO (BLEU) */}
          <div>
              <div className="flex justify-between items-end mb-3">
                  <h3 className="font-display text-xl text-white">Stop au Gaspillage</h3>
                  <span className="bg-[#1e1e1e] text-blue-400 text-[9px] font-bold px-2 py-1 rounded border border-[#333] uppercase">Rentabilisé en 2 jours</span>
              </div>
              <div 
                  onClick={() => handleProtectedAction(AppView.SCAN_FRIDGE)}
                  className={`bg-[#1a3b5c] rounded-3xl p-6 relative overflow-hidden h-48 cursor-pointer border border-[#234e7a] group transition-transform active:scale-[0.99] ${!isOnline ? 'opacity-50 grayscale' : ''}`}
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a3b5c] to-transparent z-10"></div>
                  <img src="https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=800&q=80" className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Fridge" />
                  
                  <div className="relative z-20 h-full flex flex-col justify-center max-w-[60%]">
                      <div className="flex items-center gap-2 mb-3 text-white">
                          <Camera size={24} />
                          <span className="font-bold text-lg font-display">Scan Frigo IA</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed font-medium">
                          Prenez une photo, l'IA crée une recette culinaire avec vos restes.
                      </p>
                  </div>
              </div>
          </div>

          {/* 4. SOMMELIER (ROUGE) */}
          <div>
              <div className="flex justify-between items-end mb-3">
                  <h3 className="font-display text-xl text-white">L'Accord Parfait</h3>
                  <span className="bg-[#1e1e1e] text-red-400 text-[9px] font-bold px-2 py-1 rounded border border-[#333] uppercase">Amateurs & Pros</span>
              </div>
              <div 
                  onClick={() => handleProtectedAction(AppView.SOMMELIER)}
                  className={`bg-[#4a1a1a] rounded-3xl p-6 relative overflow-hidden h-48 cursor-pointer border border-[#662222] group transition-transform active:scale-[0.99] ${!isOnline ? 'opacity-50 grayscale' : ''}`}
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4a1a1a] to-transparent z-10"></div>
                  <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80" className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Wine" />
                  
                  <div className="relative z-20 h-full flex flex-col justify-center max-w-[60%]">
                      <div className="flex items-center gap-2 mb-3 text-white">
                          <Wine size={24} />
                          <span className="font-bold text-lg font-display">Sommelier IA</span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed font-medium">
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
