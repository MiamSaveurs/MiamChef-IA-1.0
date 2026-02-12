import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import { Star, ChevronRight, Settings, Activity, Globe } from 'lucide-react';
import { updateDailyStreak } from '../services/storageService'; // Importer la fonction de mise à jour
import { 
  PremiumChefHat, 
  WickerBasket, 
  GourmetBook, 
  PremiumCalendar, 
  PremiumCamera, 
  PremiumWine, 
  PremiumHeart, 
  PremiumEuro, 
  PremiumCrown, 
  PremiumLeaf, 
  PremiumPaperPlane, 
  PremiumFingerprint,
  PremiumFlame 
} from './Icons';

interface HomeProps {
  setView: (view: AppView) => void;
  isOnline?: boolean;
}

const Home: React.FC<HomeProps> = ({ setView, isOnline = true }) => {
  const [streak, setStreak] = useState(0);
  // Compteur global (Fake stats pour l'effet de masse)
  const [globalCount, setGlobalCount] = useState(142050);
  // Ticker activity
  const [currentActivity, setCurrentActivity] = useState("Sophie (Lyon) a créé : Tarte au Citron Meringuée");

  useEffect(() => {
      // Calcul et mise à jour de la série au chargement de la Home
      const currentStreak = updateDailyStreak();
      setStreak(currentStreak);

      // Simulation compteur live
      const interval = setInterval(() => {
          setGlobalCount(prev => prev + Math.floor(Math.random() * 3));
      }, 3000);

      // Simulation Ticker
      const activities = [
          "Thomas (Paris) a scanné son frigo : 3 ingrédients trouvés",
          "Julie (Bordeaux) cuisine : Blanquette de Veau",
          "Karim (Marseille) a généré : Couscous Royal Express",
          "Emma (Lille) a ajouté : Liste de courses Drive",
          "Lucas (Nantes) a débloqué le mode Expert",
          "Sarah (Nice) prépare : Salade Niçoise Revisitée",
          "Marc (Strasbourg) : Choucroute de la mer",
          "Léa (Toulouse) : Cassoulet léger (Diet)"
      ];
      let i = 0;
      const activityInterval = setInterval(() => {
          i = (i + 1) % activities.length;
          setCurrentActivity(activities[i]);
      }, 4000);

      return () => {
          clearInterval(interval);
          clearInterval(activityInterval);
      };
  }, []);

  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  const currentYear = new Date().getFullYear();

  // "Mes Préférences" a été retiré de la grille pour être mis en avant
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

      {/* LIVE ACTIVITY TICKER (UNICORN VIBES) */}
      <div className="bg-[#509f2a] w-full overflow-hidden py-1 relative z-30 shadow-lg border-b border-green-400/30">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Activity size={10} className="animate-pulse"/> {currentActivity}
              </span>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Globe size={10} /> {globalCount.toLocaleString()} Recettes générées à ce jour
              </span>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Activity size={10} className="animate-pulse"/> {currentActivity}
              </span>
          </div>
      </div>

      {/* HEADER */}
      <header className="px-6 pt-6 pb-2 flex items-center justify-between relative z-20">
          <div>
              <h1 className="text-3xl font-display text-white leading-none mb-2">MiamChef</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#509f2a]"></span>
                  {today}
              </p>
          </div>
          
          <div className="flex gap-2">
              {/* STREAK BADGE (GAMIFICATION) */}
              <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-orange-500/30 px-3 py-1.5 rounded-full shadow-lg">
                  <PremiumFlame size={14} className="text-orange-500 animate-pulse" />
                  <span className="text-xs font-black text-orange-400">{streak}</span>
              </div>

              <button 
                onClick={() => setView(AppView.SUBSCRIPTION)} 
                className="flex items-center gap-2 bg-[#151515] border border-[#509f2a]/30 hover:bg-[#509f2a] hover:border-[#509f2a] px-4 py-2 rounded-full transition-all group"
              >
                  <PremiumCrown size={14} className="text-[#509f2a] group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-black text-[#509f2a] group-hover:text-white tracking-widest uppercase transition-colors">Premium</span>
              </button>
          </div>
      </header>

      <div className="px-6 relative z-10">
          
          {/* TITRE HERO + SLOGAN (CENTRÉ) */}
          <div className="mt-10 mb-10 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl leading-tight font-display text-white mb-2">
                  L’application nouvelle génération qui crée instantanément des recettes sur mesure,
              </h2>
              <div className="relative inline-block mt-2">
                  <h2 className="text-3xl md:text-5xl leading-tight font-display text-[#509f2a] relative z-10">
                      en harmonie avec vos goûts, vos envies et vos traditions.
                  </h2>
              </div>
          </div>

          {/* BLOC PREFERENCES (DÉPLACÉ ICI SOUS LE SLOGAN) */}
          <button
            onClick={() => setView(AppView.PROFILE)}
            className="w-full bg-[#15151a] border border-indigo-500/30 rounded-[2rem] p-5 flex items-center justify-between mb-6 shadow-xl shadow-indigo-900/10 active:scale-[0.98] transition-all group relative overflow-hidden"
          >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all"></div>

              <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                      <PremiumFingerprint size={28} />
                  </div>
                  <div className="text-left">
                      <h3 className="text-xl font-display text-white mb-1 group-hover:text-indigo-300 transition-colors">Mon Profil Gourmand</h3>
                      <p className="text-xs text-gray-400 font-medium max-w-[200px] leading-relaxed">
                          Configurez vos goûts, allergies et matériel pour des recettes 100% sur-mesure.
                      </p>
                  </div>
              </div>

              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white transition-all">
                  <ChevronRight size={20} />
              </div>
          </button>

          {/* BLOC CONCEPT (Format Pilule - DÉPLACÉ ICI) */}
          <button 
            onClick={() => setView(AppView.VALUE_PROPOSITION)}
            className="w-full bg-[#111] border border-white/10 rounded-full p-3 pl-5 flex items-center justify-between mb-8 shadow-lg active:scale-98 transition-all group relative overflow-hidden"
          >
              {/* Left: Icons Overlap */}
              <div className="flex -space-x-3 shrink-0">
                 <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center z-30 relative shadow-md">
                     <PremiumLeaf size={16} className="text-[#509f2a]" /> {/* Green: Santé */}
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center z-20 relative shadow-md">
                     <PremiumEuro size={16} className="text-blue-400" /> {/* Blue: Economie */}
                 </div>
                 <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center z-10 relative shadow-md">
                     <PremiumHeart size={16} className="text-red-400" /> {/* Red: Sur-mesure/Coeur */}
                 </div>
              </div>

              {/* Center: Text */}
              <div className="flex flex-col items-center">
                 <span className="text-white font-bold text-lg leading-none mb-1">Découvrez le concept</span>
                 <span className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">Santé • Économies • Sur-mesure</span>
              </div>

              {/* Right: Button */}
              <div className="bg-[#509f2a] text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#408020] transition-colors shadow-lg shadow-green-900/20 mr-1 shrink-0">
                  VOIR
              </div>
          </button>

          {/* GRILLE DES BLOCS FONCTIONNELS */}
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

          {/* SECTION ABONNEMENT (DESCRIPTION + LIEN) */}
          <div className="mb-10 px-2">
              <div className="bg-gradient-to-r from-[#111] to-[#151515] border border-white/5 rounded-3xl p-6 text-center relative overflow-hidden shadow-2xl">
                  {/* Decorative glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#509f2a]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-white/10 mb-3 shadow-md">
                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      </div>
                      
                      <h3 className="font-display text-xl text-white mb-2">
                          Passez à la vitesse supérieure
                      </h3>
                      
                      <p className="text-gray-400 text-xs leading-relaxed max-w-sm mx-auto mb-5">
                          Débloquez la création illimitée et toutes les fonctionnalités exclusives pour une expérience culinaire sans limites.
                      </p>
                      
                      <button 
                        onClick={() => setView(AppView.SUBSCRIPTION)}
                        className="group flex items-center gap-2 text-[#509f2a] font-bold uppercase text-[10px] tracking-widest border border-[#509f2a]/30 px-6 py-3 rounded-full hover:bg-[#509f2a] hover:text-white transition-all shadow-lg shadow-green-900/10"
                      >
                          Voir les offres Premium <PremiumPaperPlane size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
              </div>
          </div>

          {/* FOOTER COPYRIGHT */}
          <div className="text-center pb-8 opacity-40">
              <p className="text-[10px] font-sans uppercase tracking-widest font-semibold text-gray-400">
                  &copy; 2026-{currentYear} MiamChef by MiamSaveurs
              </p>
          </div>

      </div>
    </div>
  );
};

export default Home;