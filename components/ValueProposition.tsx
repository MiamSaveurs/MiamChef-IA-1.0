
import React from 'react';
import { X, ArrowRight, Star, Clock } from 'lucide-react';
import { 
  PremiumChefHat, 
  PremiumFingerprint, 
  PremiumGlobe, 
  PremiumWine, 
  PremiumLayers, 
  PremiumEuro, 
  WickerBasket, 
  PremiumHeart, 
  PremiumBriefcase, 
  PremiumShield,
  PremiumPaperPlane
} from './Icons';

interface ValuePropositionProps {
  onClose: () => void;
  onSubscribe: () => void;
}

const ValueProposition: React.FC<ValuePropositionProps> = ({ onClose, onSubscribe }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-white overflow-y-auto animate-fade-in font-body">
      
      {/* Header with Close */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            <PremiumChefHat size={24} />
            <span className="font-display text-xl text-chef-dark">Pourquoi MiamChef ?</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-20 pb-24">
        
        {/* HERO */}
        <div className="text-center space-y-4">
            <div className="inline-block bg-chef-green/10 text-chef-green px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
                Offre Découverte
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-chef-dark leading-tight">
                Une application.<br/>
                <span className="text-chef-green">3 avantages clés.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
                Essayez <strong className="text-chef-dark">MiamChef gratuitement pendant 7 jours</strong>. Découvrez comment cuisiner mieux et moins cher.
            </p>
        </div>

        {/* PILLAR 1: SUR-MESURE & CULTURE */}
        <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-[2.5rem] shadow-sm border border-green-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
            
            <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 border border-green-50">
                    <PremiumFingerprint size={36} />
                </div>
                <h2 className="text-3xl font-display text-chef-dark mb-4">Cuisine 100% Personnalisée</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        <strong className="text-chef-dark">Le Problème :</strong> Vous en avez assez de scroller pendant 20 minutes sur Marmiton pour trouver une recette qui correspond à ce que vous avez, pour finir par faire des pâtes ?
                    </p>
                    <p>
                        <strong className="text-chef-dark">La Solution MiamChef :</strong> Fini la recherche. Vous dites "J'ai du poulet et du curry", l'application <span className="underline decoration-chef-green/50 decoration-2">crée</span> la recette parfaite pour vous, à la seconde, <span className="font-bold text-chef-green">et déclinable à l'infini</span>.
                    </p>
                    
                    {/* ARGUMENT UNIVERSEL / CULTUREL */}
                    <div className="mt-6 bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-chef-green font-bold uppercase text-xs tracking-wider">
                            <PremiumGlobe size={18} /> Cuisine du Monde
                        </div>
                        <p className="text-sm text-gray-700">
                            <strong>Une Cuisine sans frontières.</strong> Envie d'un twist Japonais, Libanais ou Créole avec vos restes ? L'application adapte n'importe quel ingrédient à la culture de votre choix.
                        </p>
                    </div>

                    {/* ARGUMENT BATCH COOKING */}
                    <div className="mt-2 bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-chef-green font-bold uppercase text-xs tracking-wider">
                            <PremiumLayers size={18} /> Organisation (Batch Cooking)
                        </div>
                        <p className="text-sm text-gray-700">
                             Cuisinez une fois, mangez toute la semaine. L'application organise vos préparations pour vous libérer du temps le soir.
                        </p>
                    </div>

                    <ul className="space-y-2 mt-4">
                        <li className="flex items-center gap-2 text-sm font-bold text-chef-dark"><Star size={16} className="text-yellow-400 fill-yellow-400"/> Recettes uniques</li>
                        <li className="flex items-start gap-2 text-sm font-bold text-chef-dark">
                            <Star size={16} className="text-yellow-400 fill-yellow-400 mt-1 shrink-0"/> 
                            <span>Adaptation instantanée (Végétarien, Vegan, Halal, Casher, Sans Gluten...)</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {/* PILLAR 2: ECONOMIE */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-[2.5rem] shadow-sm border border-blue-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
            
            <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 border border-blue-50">
                    <PremiumEuro size={36} />
                </div>
                <h2 className="text-3xl font-display text-chef-dark mb-4">Le Pouvoir d'Achat</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        <strong className="text-chef-dark">Le Constat :</strong> Chaque année, un foyer français jette en moyenne <span className="text-red-500 font-bold">400€</span> de nourriture.
                    </p>
                    <p>
                        <strong className="text-chef-dark">MiamChef :</strong> Avec la fonction <span className="font-bold text-blue-600">Scan Anti-Gaspi</span>, un simple clic transforme les restes du frigo ou des placards en un plat délicieux.
                    </p>

                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm mt-4 text-center">
                        <p className="text-sm text-gray-500 mb-1">Résultat</p>
                        <p className="text-lg font-bold text-chef-dark">
                            Jusqu'à <span className="text-green-600 text-2xl">30% d'économie</span> <br/> sur votre budget courses
                        </p>
                    </div>

                    {/* GAIN DE TEMPS DRIVE */}
                    <div className="mt-4 flex gap-4 bg-white p-4 rounded-xl border border-blue-100 shadow-sm items-start">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                            <WickerBasket size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-chef-dark text-sm">Finie la corvée des courses</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Exportez votre liste d'ingrédients directement vers votre Drive préféré (Leclerc, Carrefour, etc.) en un clic.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* PILLAR 3: SANTE */}
        <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-[2.5rem] shadow-sm border border-red-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
            
            <div className="relative z-10">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 border border-red-50">
                    <PremiumHeart size={36} />
                </div>
                <h2 className="text-3xl font-display text-chef-dark mb-4">Votre Santé, Votre Capital</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        <strong className="text-chef-dark">L'Expertise :</strong> MiamChef intègre une <strong className="text-chef-dark">Technologie Nutritionnelle</strong> pour vous aider à mieux manger.
                    </p>
                    <p>
                        Que vous soyez sportif, diabétique ou simplement soucieux de votre ligne, l'application veille sur chaque calorie sans sacrifier le goût.
                    </p>
                    
                    <div className="flex items-center gap-2 mt-4 text-red-600 bg-red-50 px-4 py-2 rounded-full w-fit border border-red-100">
                        <PremiumShield size={20} />
                        <span className="text-xs font-bold uppercase">Données Nutritionnelles Calculées</span>
                    </div>
                </div>
            </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="text-center pt-8">
            <h3 className="font-display text-2xl text-chef-dark mb-6">7 jours pour tout changer</h3>
            <button 
                onClick={onSubscribe}
                className="w-full bg-chef-green text-white font-display text-xl py-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
                Profiter de mon essai gratuit <PremiumPaperPlane size={24} />
            </button>
            <p className="text-xs text-gray-400 mt-4 max-w-xs mx-auto">
                <Clock size={12} className="inline mr-1"/>
                Offre limitée. Satisfait ou remboursé.
            </p>
        </div>

      </div>
    </div>
  );
};

export default ValueProposition;
