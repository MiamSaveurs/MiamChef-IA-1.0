
import React from 'react';
import { AppView } from '../types';
import { ChefHat, Camera, Wine, ArrowRight, Book, Crown, Fingerprint, Euro, HeartPulse, ShoppingCart, FileText, Briefcase, Calendar } from 'lucide-react';

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

  return (
    <div className="relative min-h-screen font-body bg-white overflow-x-hidden">
      
      {/* HERO SECTION */}
      <div className="relative bg-chef-dark text-white rounded-b-[3rem] shadow-2xl overflow-hidden pb-12">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-chef-dark/90"></div>

        <div className="relative z-10 px-6 pt-8 max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <div className="bg-chef-green p-1.5 rounded-lg">
                        <ChefHat size={20} className="text-white" />
                    </div>
                    <span className="font-display text-xl tracking-wide">MiamChef IA</span>
                </div>
                <button 
                    onClick={() => setView(AppView.SUBSCRIPTION)}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all group"
                >
                    <Crown size={16} className="text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-yellow-100 uppercase tracking-wider">Premium</span>
                </button>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full mb-4">
                 <Briefcase size={12} className="text-chef-green" />
                 <span className="text-[10px] font-bold uppercase tracking-wider text-gray-200">Pour Particuliers & Professionnels</span>
            </div>

            <h1 className="text-5xl font-display leading-tight mb-4">
                Créez des recettes uniques <br/>
                <span className="text-chef-green">avec ce que vous avez.</span>
            </h1>
            <p className="text-gray-300 text-lg font-light mb-8 leading-relaxed">
                Le premier livre de cuisine <strong className="text-white font-bold">infini</strong>. Le Couteau Suisse culinaire français indispensable.
            </p>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => setView(AppView.RECIPE_BOOK)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex items-center justify-between group transition-all"
                >
                    <div className="w-10 h-10 shrink-0 bg-yellow-500 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Book size={20} />
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-white text-sm leading-tight">Mon Carnet</div>
                        <div className="text-[10px] text-gray-400 group-hover:text-gray-300">Mes Recettes</div>
                    </div>
                </button>

                <button 
                    onClick={() => setView(AppView.SHOPPING_LIST)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex items-center justify-between group transition-all"
                >
                    <div className="w-10 h-10 shrink-0 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <ShoppingCart size={20} />
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-white text-sm leading-tight">Ma Liste</div>
                        <div className="text-[10px] text-gray-400 group-hover:text-gray-300">Mes Courses</div>
                    </div>
                </button>
            </div>
        </div>
      </div>

      {/* VALUE PROPOSITION BUTTON */}
      <div className="px-6 -mt-8 relative z-20 max-w-lg mx-auto mb-12">
        <button 
            onClick={() => setView(AppView.VALUE_PROPOSITION)}
            className="w-full bg-white rounded-3xl shadow-xl p-6 text-center border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center"
        >
            <div className="flex justify-between items-center w-full mb-4">
                <div className="flex flex-col items-center gap-2 w-1/3 group-hover:scale-105 transition-transform">
                    <div className="p-3 bg-green-50 text-chef-green rounded-full mb-1"><Fingerprint size={24} /></div>
                    <span className="text-xs font-bold text-gray-600 uppercase">Sur-Mesure</span>
                </div>
                <div className="w-px h-12 bg-gray-100"></div>
                <div className="flex flex-col items-center gap-2 w-1/3 group-hover:scale-105 transition-transform delay-75">
                    <div className="p-3 bg-red-50 text-red-500 rounded-full mb-1"><HeartPulse size={24} /></div>
                    <span className="text-xs font-bold text-gray-600 uppercase">Santé</span>
                </div>
                <div className="w-px h-12 bg-gray-100"></div>
                <div className="flex flex-col items-center gap-2 w-1/3 group-hover:scale-105 transition-transform delay-150">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-full mb-1"><Euro size={24} /></div>
                    <span className="text-xs font-bold text-gray-600 uppercase">Économies</span>
                </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-chef-green border border-chef-green/20 px-4 py-2 rounded-full hover:bg-chef-green hover:text-white transition-colors uppercase tracking-wide">
                Découvrir nos solutions <ArrowRight size={12}/>
            </span>
        </button>
      </div>

      <div className="px-6 pb-24 max-w-lg mx-auto space-y-6">
        {/* ATELIER DU CHEF */}
        <div onClick={() => handleProtectedAction(AppView.RECIPE_CREATOR)} className={`group cursor-pointer ${!isOnline ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl text-chef-dark">Atelier du Chef</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wide">Créations Uniques</span>
            </div>
            <div className="relative h-48 rounded-[2rem] overflow-hidden shadow-card group-hover:shadow-xl transition-all bg-gradient-to-br from-green-900 to-emerald-900 border border-green-800">
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-50 mix-blend-overlay">
                     <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover rounded-l-[2rem]" alt="Chef en cuisine" />
                </div>
                <div className="absolute inset-0 p-6 w-2/3 flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-green-100">
                        <ChefHat size={24} /> <span className="font-bold">Création de Recette</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">Créez des recettes uniques avec ce que vous avez, adaptées à votre style.</p>
                </div>
            </div>
        </div>

        {/* SEMAINIER */}
        <div onClick={() => handleProtectedAction(AppView.PLANNING)} className={`group cursor-pointer ${!isOnline ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl text-chef-dark">Votre Semaine</h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase tracking-wide">Charge Mentale : Zéro</span>
            </div>
            <div className="relative h-48 rounded-[2rem] overflow-hidden shadow-card group-hover:shadow-xl transition-all bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-800">
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-50 mix-blend-overlay">
                     <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover rounded-l-[2rem]" alt="Planning" />
                </div>
                <div className="absolute inset-0 p-6 w-2/3 flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-purple-100">
                        <Calendar size={24} /> <span className="font-bold">Organisateur Semainier</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">L'IA génère vos menus du Lundi au Dimanche et remplit votre liste de courses.</p>
                </div>
            </div>
        </div>

        {/* SCAN ANTI-GASPI */}
        <div onClick={() => handleProtectedAction(AppView.SCAN_FRIDGE)} className={`group cursor-pointer ${!isOnline ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl text-chef-dark">Stop au Gaspillage</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wide">Rentabilisé en 2 jours</span>
            </div>
            <div className="relative h-48 rounded-[2rem] overflow-hidden shadow-card group-hover:shadow-xl transition-all bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-800">
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-50 mix-blend-overlay">
                     <img src="https://images.unsplash.com/photo-1584473457406-6240486418e9?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover rounded-l-[2rem]" alt="Scan" />
                </div>
                <div className="absolute inset-0 p-6 w-2/3 flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-blue-100">
                        <Camera size={24} /> <span className="font-bold">Scan Frigo IA</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">Prenez une photo, l'IA crée une recette culinaire avec vos restes.</p>
                </div>
            </div>
        </div>

        {/* SOMMELIER */}
        <div onClick={() => handleProtectedAction(AppView.SOMMELIER)} className={`group cursor-pointer ${!isOnline ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-2xl text-chef-dark">L'Accord Parfait</h3>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wide">Amateurs & Pros</span>
            </div>
            <div className="relative h-48 rounded-[2rem] overflow-hidden shadow-card group-hover:shadow-xl transition-all bg-gradient-to-br from-red-900 to-red-800 border border-red-800">
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-50 mix-blend-overlay">
                    <img src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover rounded-l-[2rem]" alt="Sommelier" />
                </div>
                <div className="absolute inset-0 p-6 w-2/3 flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-red-100">
                        <Wine size={24} /> <span className="font-bold">Sommelier IA</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed font-medium">Pour vos dîners ou vos clients.</p>
                </div>
                <div className="absolute bottom-0 w-full bg-black/20 text-white/60 text-[8px] px-6 py-2 text-center uppercase tracking-wider">
                    L'abus d'alcool est dangereux pour la santé.
                </div>
            </div>
        </div>

        {/* PREMIUM BANNER */}
        <div onClick={() => setView(AppView.SUBSCRIPTION)} className="mt-12 bg-gray-900 rounded-[2rem] p-8 text-center relative overflow-hidden cursor-pointer shadow-2xl group">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
            <div className="relative z-10">
                <Crown size={40} className="text-yellow-400 mx-auto mb-4 animate-bounce-slow" />
                <h3 className="font-display text-3xl text-white mb-2">Passez au niveau Chef</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                    Rentabilisez votre abonnement dès le premier mois grâce aux économies réalisées.
                </p>
                <button className="bg-chef-green text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-green-600 transition-colors w-full group-hover:scale-105 transform duration-300">
                    Découvrir l'offre Premium
                </button>
            </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 pb-4 flex flex-col items-center gap-2">
             <p className="text-xs text-gray-400 font-medium">MiamChef IA by MiamSaveurs © {new Date().getFullYear()}</p>
             <button onClick={() => setView(AppView.LEGAL)} className="text-[10px] text-gray-300 hover:text-chef-green flex items-center gap-1">
                 <FileText size={10} /> Mentions Légales
             </button>
             {/* Tech Status for Debugging */}
             <div className="flex gap-2 opacity-30 hover:opacity-100 transition-opacity mt-2">
                 <span className="text-[9px] bg-gray-200 px-1 rounded">v1.0.0</span>
                 <span className={`text-[9px] px-1 rounded ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
