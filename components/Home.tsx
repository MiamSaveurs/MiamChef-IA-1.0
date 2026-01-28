
import React from 'react';
import { AppView } from '../types';
import { ArrowRight } from 'lucide-react';
import { 
  PremiumChefHat, 
  WickerBasket, 
  GourmetBook, 
  PremiumCalendar, 
  PremiumCamera, 
  PremiumWine, 
  PremiumFingerprint, 
  PremiumHeart, 
  PremiumEuro, 
  PremiumCrown
} from './Icons';

interface HomeProps {
  setView: (view: AppView) => void;
  isOnline?: boolean;
}

const Home: React.FC<HomeProps> = ({ setView, isOnline = true }) => {
  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  const blocks = [
    {
      view: AppView.RECIPE_CREATOR,
      title: "Cuisine du Chef",
      subtitle: "Création sur-mesure",
      icon: <PremiumChefHat size={28} />,
      color: "from-[#1a4a2a] to-[#0f2e1b]", // Vert
      accent: "text-green-400",
      border: "border-green-800/30",
      bgImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      view: AppView.PLANNING,
      title: "Semainier",
      subtitle: "Menus & Organisation",
      icon: <PremiumCalendar size={28} />,
      color: "from-[#3b2a4a] to-[#1f162e]", // Violet
      accent: "text-purple-400",
      border: "border-purple-800/30",
      bgImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop"
    },
    {
      view: AppView.SCAN_FRIDGE,
      title: "Scan Frigo",
      subtitle: "Zéro Gaspillage",
      icon: <PremiumCamera size={28} />,
      color: "from-[#1a3a5a] to-[#0f1e2e]", // Bleu
      accent: "text-blue-400",
      border: "border-blue-800/30",
      bgImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
    },
    {
      view: AppView.SOMMELIER,
      title: "Sommelier",
      subtitle: "Accords Vins",
      icon: <PremiumWine size={28} />,
      color: "from-[#4a1a2a] to-[#2e0f15]", // Rouge
      accent: "text-rose-400",
      border: "border-rose-800/30",
      bgImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop"
    },
    {
      view: AppView.RECIPE_BOOK,
      title: "Mon Carnet",
      subtitle: "Recettes Sauvegardées",
      icon: <GourmetBook size={28} />,
      color: "from-[#2c2010] to-[#1a1205]", // Marron/Ambre
      accent: "text-amber-500",
      border: "border-amber-900/30",
      bgImage: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974&auto=format&fit=crop"
    },
    {
      view: AppView.SHOPPING_LIST,
      title: "Ma Liste",
      subtitle: "Courses Intelligentes",
      icon: <WickerBasket size={28} />,
      color: "from-[#202020] to-[#101010]", // Gris foncé
      accent: "text-gray-400",
      border: "border-white/10",
      bgImage: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1974&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-sans overflow-x-hidden relative">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#509f2a]/10 to-transparent pointer-events-none" />

      {/* HEADER */}
      <header className="px-6 pt-5 pb-2 flex items-center justify-between relative z-20">
          <div>
              <h1 className="text-3xl font-display text-white leading-none mb-2">MiamChef</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#509f2a]"></span>
                  {today}
              </p>
          </div>
          
          <button 
            onClick={() => setView(AppView.SUBSCRIPTION)} 
            className="flex items-center gap-2 bg-[#151515] border border-[#509f2a]/30 hover:bg-[#509f2a] hover:border-[#509f2a] px-4 py-2 rounded-full transition-all group"
          >
              <PremiumCrown size={14} className="text-[#509f2a] group-hover:text-white transition-colors" />
              <span className="text-[10px] font-black text-[#509f2a] group-hover:text-white tracking-widest uppercase transition-colors">Premium</span>
          </button>
      </header>

      <div className="px-6 relative z-10">
          
          {/* TITRE HERO */}
          <div className="mt-8 mb-8">
              <h2 className="text-[3.5rem] leading-[0.95] font-display text-white mb-2">
                  Qu'est ce que l'on mange
              </h2>
              <div className="relative inline-block">
                  <h2 className="text-[3.5rem] leading-[0.95] font-display text-[#509f2a] relative z-10">
                      aujourd'hui ?
                  </h2>
                  <svg 
                    className="absolute -bottom-3 left-0 w-full h-6 text-[#509f2a]" 
                    viewBox="0 0 200 15" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path d="M5 8C50 2 110 2 195 8" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.8"/>
                  </svg>
              </div>
          </div>

          {/* BLOC CONCEPT (Format Carte Rectangulaire Arrondi) */}
          <button 
            onClick={() => setView(AppView.VALUE_PROPOSITION)}
            className="w-full bg-[#151515] border border-white/10 rounded-[2.5rem] p-5 flex items-center justify-between mb-10 shadow-xl active:scale-98 transition-all group relative overflow-hidden"
          >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>

              <div className="flex items-center gap-5 relative z-10">
                 <div className="flex -space-x-3">
                     <div className="w-10 h-10 rounded-full bg-[#222] border-2 border-[#151515] flex items-center justify-center relative z-30 text-[#509f2a] shadow-sm"><PremiumFingerprint size={18} /></div>
                     <div className="w-10 h-10 rounded-full bg-[#222] border-2 border-[#151515] flex items-center justify-center relative z-20 text-blue-400 shadow-sm"><PremiumEuro size={18} /></div>
                     <div className="w-10 h-10 rounded-full bg-[#222] border-2 border-[#151515] flex items-center justify-center relative z-10 text-red-400 shadow-sm"><PremiumHeart size={18} /></div>
                 </div>
                 
                 <div className="flex flex-col items-start">
                     <span className="text-white font-bold text-sm leading-tight group-hover:text-[#509f2a] transition-colors">Découvrez le concept</span>
                     <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium mt-0.5">Santé • Économies • Sur-mesure</span>
                 </div>
              </div>

              <div className="relative z-10 px-4 py-2.5 rounded-xl bg-[#222] border border-white/5 flex items-center gap-2 group-hover:bg-[#509f2a] group-hover:text-white group-hover:border-[#509f2a] transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white">Voir</span>
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-white" />
              </div>
          </button>

          {/* GRILLE DES BLOCS */}
          <div className="grid grid-cols-2 gap-4 pb-10">
              {blocks.map((block, index) => (
                  <button 
                    key={index}
                    onClick={() => setView(block.view)}
                    className={`h-48 w-full rounded-[2.5rem] bg-gradient-to-br ${block.color} relative overflow-hidden group shadow-lg border ${block.border} flex flex-col justify-between p-6 text-left hover:scale-[1.02] active:scale-95 transition-all duration-300`}
                  >
                      {/* Image de fond avec masque */}
                      <img 
                        src={block.bgImage} 
                        className="absolute right-0 top-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700 transform group-hover:scale-110" 
                        style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }}
                        alt={block.title}
                      />
                      
                      {/* Icon Container */}
                      <div className="relative z-10 bg-white/10 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 text-white shadow-inner group-hover:bg-white/20 transition-colors">
                          {block.icon}
                      </div>
                      
                      <div className="relative z-10 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                          <h4 className="font-display text-xl text-white leading-none mb-1.5">{block.title}</h4>
                          <p className={`text-[10px] font-black uppercase tracking-widest opacity-80 ${block.accent}`}>
                              {block.subtitle}
                          </p>
                      </div>
                  </button>
              ))}
          </div>

      </div>
    </div>
  );
};

export default Home;
