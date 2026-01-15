
import React from 'react';
import { X, Fingerprint, HeartPulse, Euro, ArrowRight, ChefHat, ShieldCheck, Star, Briefcase, Globe2, Layers, Clock, Wine, ShoppingCart } from 'lucide-react';

interface ValuePropositionProps {
  onClose: () => void;
}

const ValueProposition: React.FC<ValuePropositionProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-white overflow-y-auto animate-fade-in font-body">
      
      {/* Header with Close */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ChefHat className="text-chef-green" size={24} />
            <span className="font-display text-xl text-chef-dark">Pourquoi MiamChef IA ?</span>
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
                <span className="text-chef-green">3 révolutions.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto">
                Essayez <strong className="text-chef-dark">MiamChef IA gratuitement pendant 7 jours</strong>. Découvrez la puissance de l'IA culinaire avant de vous engager.
            </p>
        </div>

        {/* PILLAR 1: SUR-MESURE & CULTURE */}
        <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-[2.5rem] shadow-sm border border-green-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50"></div>
            
            <div className="relative z-10">
                <div className="w-14 h-14 bg-white text-chef-green rounded-2xl flex items-center justify-center shadow-md mb-6">
                    <Fingerprint size={32} />
                </div>
                <h2 className="text-3xl font-display text-chef-dark mb-4">L'Exclusivité Culinaire</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        <strong className="text-chef-dark">Le Problème :</strong> Vous en avez assez de scroller pendant 20 minutes sur Marmiton pour trouver une recette qui correspond à ce que vous avez, pour finir par faire des pâtes ?
                    </p>
                    <p>
                        <strong className="text-chef-dark">La Solution MiamChef IA :</strong> Fini la recherche. Vous dites "J'ai du poulet et du curry", l'IA <span className="underline decoration-chef-green/50 decoration-2">crée</span> la recette parfaite pour vous, à la seconde, <span className="font-bold text-chef-green">et déclinable à l'infini</span>.
                    </p>
                    
                    {/* ARGUMENT UNIVERSEL / CULTUREL */}
                    <div className="mt-6 bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-chef-green font-bold uppercase text-xs tracking-wider">
                            <Globe2 size={16} /> Passeport Universel
                        </div>
                        <p className="text-sm text-gray-700">
                            <strong>Une IA sans frontières.</strong> MiamChef IA maîtrise les codes de toutes les cultures. Envie d'un twist Japonais, Libanais ou Créole ? L'application adapte n'importe quel ingrédient à la culture de votre choix avec une authenticité bluffante.
                        </p>
                    </div>

                    {/* ARGUMENT SOMMELIER B2B */}
                    <div className="mt-2 bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                         <div className="flex items-center gap-2 mb-2 text-red-600 font-bold uppercase text-xs tracking-wider">
                            <Wine size={16} /> Solutions Business
                        </div>
                        <p className="text-sm text-gray-700">
                            <strong>Sommeliers, Restaurateurs, Cavistes :</strong> Créez des cartes de vins parfaites et conseillez vos clients avec une expertise IA mondiale instantanée.
                        </p>
                    </div>
                    
                    {/* ARGUMENT BATCH COOKING */}
                    <div className="mt-2 bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-chef-green font-bold uppercase text-xs tracking-wider">
                            <Layers size={16} /> Batch Cooking Intelligent
                        </div>
                        <p className="text-sm text-gray-700">
                             Cuisinez une fois, mangez toute la semaine. L'IA organise vos préparations pour vous libérer du temps.
                        </p>
                    </div>

                    <ul className="space-y-2 mt-4">
                        <li className="flex items-center gap-2 text-sm font-bold text-chef-dark"><Star size={16} className="text-yellow-400 fill-yellow-400"/> Recettes uniques au monde</li>
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
                <div className="w-14 h-14 bg-white text-blue-500 rounded-2xl flex items-center justify-center shadow-md mb-6">
                    <Euro size={32} />
                </div>
                <h2 className="text-3xl font-display text-chef-dark mb-4">Le Pouvoir d'Achat</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        <strong className="text-chef-dark">Le Constat :</strong> Chaque année, un foyer français jette en moyenne <span className="text-red-500 font-bold">400€</span> de nourriture.
                    </p>
                    <p>
                        <strong className="text-chef-dark">MiamChef IA :</strong> Avec la fonction <span className="font-bold text-blue-600">Scan Anti-Gaspi</span>, un simple clic transforme les restes du frigo, placards ou garde-manger en un plat gastronomique.
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
                            <ShoppingCart size={20} />
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
                <div className="w-14 h-14 bg-white text-red-500 rounded-2xl flex items-center justify-center shadow-md mb-6">
                    <HeartPulse size={32} />
                </div>
                <h2 className="text-3xl font-display text-chef-dark mb-4">Votre Santé, Votre Capital</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                        <strong className="text-chef-dark">L'Expertise :</strong> MiamChef IA intègre une <strong className="text-chef-dark">Intelligence Artificielle Nutritionniste</strong>. Contrairement aux blogs amateurs, nous garantissons <span className="bg-red-100 text-red-800 px-1 font-bold rounded">95% de précision technique*</span>. Nous calculons le VRAI Nutri-Score et les macronutriments exacts selon les standards scientifiques.
                    </p>
                    <p>
                        Que vous soyez sportif, diabétique ou simplement soucieux de votre ligne, l'application veille sur chaque calorie sans sacrifier le goût.
                    </p>
                    
                    {/* SECTION PROS */}
                    <div className="mt-6 bg-red-600 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 bg-yellow-400 w-16 h-16 rounded-full opacity-20"></div>
                        <div className="flex items-center gap-2 mb-2">
                             <Briefcase size={20} className="text-yellow-300" />
                             <span className="font-bold uppercase text-xs tracking-wider text-yellow-300">L'outil Secret des Pros</span>
                        </div>
                        <p className="font-display text-lg mb-2">Coachs, Naturopathes, Diététiciens ?</p>
                        <p className="text-sm text-red-100 leading-relaxed">
                            Gagnez un temps précieux. Générez des plans repas <span className="bg-yellow-400 text-red-900 px-1 font-bold">100% adaptés aux pathologies</span> ou objectifs de vos clients en quelques secondes. Précision clinique garantie.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-red-600 bg-red-50 px-4 py-2 rounded-full w-fit">
                        <ShieldCheck size={18} />
                        <span className="text-xs font-bold uppercase">Données Scientifiques Certifiées</span>
                    </div>
                </div>
            </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="text-center pt-8">
            <h3 className="font-display text-2xl text-chef-dark mb-6">7 jours pour tout changer</h3>
            <button 
                onClick={onClose}
                className="w-full bg-chef-green text-white font-display text-xl py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
                Profiter de mon essai gratuit <ArrowRight size={24} />
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
