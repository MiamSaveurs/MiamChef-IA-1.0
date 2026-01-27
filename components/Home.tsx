
import React from 'react';
import { AppView } from '../types';
import { ArrowRight, Star, Utensils } from 'lucide-react';
import { 
  WickerBasket, 
  GourmetBook, 
  PremiumChefHat, 
  PremiumCamera, 
  PremiumWine, 
  PremiumCalendar,
  PremiumPlus,
  PremiumCrown
} from './Icons';

interface HomeProps {
  setView: (view: AppView) => void;
  isOnline?: boolean;
}

const Home: React.FC<HomeProps> = ({ setView, isOnline = true }) => {
  
  const handleProtectedAction = (view: AppView) => {
      if (isOnline) {
          setView(view);
      } else {
          alert("Cette fonctionnalité nécessite internet.");
      }
  };

  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long'
  });
  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="relative min-h-screen font-body bg-[#050505] text-white overflow-x-hidden pb-40">
      
      {/* --- DECORATION --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,#1a2e10_0%,transparent_70%)] opacity-30 pointer-events-none"></div>

      {/* --- HEADER --- */}
      <div className="relative z-10 px-6 pt-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="bg-[#509f2a] p-2 rounded-xl">
                  <PremiumChefHat size={24} className="text-white" />
              </div>
              <div>
                  <h1 className="font-display text-2xl text-white tracking-tight">MiamChef IA</h1>
                  <p className="text-[#666] text-[10px] uppercase font-black tracking-widest">{formattedDate}</p>
              </div>
          </div>
          <div className="flex items-center gap-2">
              <button 
                onClick={() => setView(AppView.SUBSCRIPTION)}
                className="p-3 bg-white/5 rounded-full border border-white/10 text-[#509f2a] hover:bg-white/10 transition-colors"
                title="Devenir Premium"
              >
                  <PremiumCrown size={20} />
              </button>
              <button 
                onClick={() => setView(AppView.SHOPPING_LIST)}
                className="p-3 bg-white/5 rounded-full border border-white/10 text-[#509f2a] hover:bg-white/10 transition-colors"
                title="Ma liste de courses"
              >
                  <WickerBasket size={20} />
              </button>
          </div>
      </div>

      {/* --- HERO --- */}
      <div className="relative z-10 px-6 pt-16 pb-8">
          <div className="space-y-1">
              <h2 className="text-[42px] font-display text-white leading-[0.9] tracking-tighter">
                  Qu'est-ce qu'on
              </h2>
              <h2 className="text-[50px] font-display text-[#509f2a] leading-[0.9] tracking-tighter italic">
                  mange ce soir ?
              </h2>
          </div>
          
          <p className="text-[#999] text-base font-medium leading-relaxed max-w-[300px] mt-6">
              Votre assistant pour cuisiner simplement avec ce que vous avez dans vos placards.
          </p>

          {/* BOUTONS D'ACCÈS RAPIDES */}
          <div className="grid grid-cols-2 gap-4 mt-10">
              <button 
                  onClick={() => setView(AppView.RECIPE_BOOK)}
                  className="bg-white/[0.03] p-5 rounded-3xl flex flex-col gap-4 border border-white/5 group active:scale-95 transition-all"
              >
                  <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center text-[#509f2a] border border-white/10">
                      <GourmetBook size={20} />
                  </div>
                  <div className="text-left">
                      <span className="block text-white font-bold text-xs uppercase tracking-wide">Mes Recettes</span>
                      <span className="block text-[#555] text-[10px]">Mon carnet perso</span>
                  </div>
              </button>

              <button 
                  onClick={() => setView(AppView.SHOPPING_LIST)}
                  className="bg-white/[0.03] p-5 rounded-3xl flex flex-col gap-4 border border-white/5 group active:scale-95 transition-all"
              >
                  <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center border border-white/10">
                      <WickerBasket size={22} />
                  </div>
                  <div className="text-left">
                      <span className="block text-white font-bold text-xs uppercase tracking-wide">Mes Courses</span>
                      <span className="block text-[#555] text-[10px]">Ma liste à acheter</span>
                  </div>
              </button>
          </div>
      </div>

      {/* --- FONCTION PRINCIPALE --- */}
      <div className="relative z-10 px-6 mb-10">
          <div 
              onClick={() => handleProtectedAction(AppView.RECIPE_CREATOR)}
              className="bg-[#111] rounded-[2.5rem] p-1 border border-white/10 shadow-2xl group cursor-pointer overflow-hidden active:scale-[0.98] transition-all"
          >
              <div className="relative h-60 overflow-hidden rounded-[2.4rem]">
                   <img 
                      src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80" 
                      className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" 
                      alt="Cuisine" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-4 mb-3">
                          <div className="p-3 bg-[#509f2a] rounded-2xl shadow-lg">
                              <PremiumChefHat size={32} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-display text-3xl text-white leading-none">Nouvelle Recette</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#509f2a] mt-1">Cuisiner ou Pâtisser</p>
                          </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-snug">
                          Dites-moi ce que vous avez, je vous trouve une idée de plat ou de dessert.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* --- AUTRES OUTILS --- */}
      <div className="relative z-10 px-6 grid grid-cols-1 gap-5 pb-20">
          <div 
              onClick={() => handleProtectedAction(AppView.SCAN_FRIDGE)}
              className="bg-white/[0.03] border border-white/5 p-5 rounded-[2rem] flex items-center gap-5 hover:bg-white/[0.06] transition-all cursor-pointer group"
          >
              <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <PremiumCamera size={24} className="text-blue-400" />
              </div>
              <div className="flex-1">
                  <h4 className="text-lg font-display text-white">Vider mon frigo</h4>
                  <p className="text-[#666] text-xs">Prenez une photo de vos restes pour avoir une idée.</p>
              </div>
              <ArrowRight size={18} className="text-white/20" />
          </div>

          <div 
              onClick={() => handleProtectedAction(AppView.SOMMELIER)}
              className="bg-white/[0.03] border border-white/5 p-5 rounded-[2rem] flex items-center gap-5 hover:bg-white/[0.06] transition-all cursor-pointer group"
          >
              <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                  <PremiumWine size={24} className="text-red-400" />
              </div>
              <div className="flex-1">
                  <h4 className="text-lg font-display text-white">Quel vin choisir ?</h4>
                  <p className="text-[#666] text-xs">Trouvez la bonne bouteille pour accompagner votre plat.</p>
              </div>
              <ArrowRight size={18} className="text-white/20" />
          </div>

          <div 
              onClick={() => handleProtectedAction(AppView.PLANNING)}
              className="bg-white/[0.03] border border-white/5 p-5 rounded-[2rem] flex items-center gap-5 hover:bg-white/[0.06] transition-all cursor-pointer group"
          >
              <div className="p-4 bg-[#509f2a]/10 rounded-2xl border border-[#509f2a]/20">
                  <PremiumCalendar size={24} className="text-[#509f2a]" />
              </div>
              <div className="flex-1">
                  <h4 className="text-lg font-display text-white">Ma semaine de menus</h4>
                  <p className="text-[#666] text-xs">Organisez vos repas du lundi au dimanche.</p>
              </div>
              <ArrowRight size={18} className="text-white/20" />
          </div>
      </div>
    </div>
  );
};

export default Home;
