import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Marie, 34 ans",
    role: "Mère de 2 enfants",
    text: "MiamChef a complètement changé mon organisation. Fini le casse-tête du soir devant le frigo, je scanne mes restes et j'ai un repas équilibré en 2 minutes !",
    rating: 5
  },
  {
    id: 2,
    name: "Julien, 28 ans",
    role: "Télétravailleur",
    text: "Le mode 'Plat du jour Bistrot' est incroyable. J'ai l'impression de manger au restaurant tous les midis tout en respectant mon budget et mon régime sans gluten.",
    rating: 5
  },
  {
    id: 3,
    name: "Sophie, 22 ans",
    role: "Étudiante",
    text: "La liste de courses générée automatiquement à partir du semainier me fait gagner un temps fou. Plus d'achats inutiles, plus de gaspillage.",
    rating: 5
  },
  {
    id: 4,
    name: "Thomas, 31 ans",
    role: "Sportif régulier",
    text: "Étant sportif, j'adore pouvoir demander des recettes riches en protéines. Les propositions sont toujours gourmandes, saines et adaptées à mes besoins.",
    rating: 5
  },
  {
    id: 5,
    name: "Claire, 45 ans",
    role: "Épicurienne",
    text: "L'accord mets & vins du Sommelier a bluffé mes invités samedi dernier. L'application est devenue mon arme secrète pour recevoir sans stress !",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000); // Change every 6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-12 px-2">
      <div className="text-center mb-6">
        <h3 className="font-display text-2xl text-white mb-2">Ils cuisinent avec MiamChef</h3>
        <p className="text-gray-400 text-xs">Rejoignez des milliers d'utilisateurs satisfaits</p>
      </div>

      <div className="relative bg-gradient-to-br from-[#111] to-[#151515] border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden">
        <Quote className="absolute top-4 right-4 text-white/5 w-20 h-20 rotate-12" />
        
        <div className="min-h-[150px] flex flex-col justify-center relative z-10 transition-opacity duration-500">
          <div className="flex gap-1 mb-4">
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          
          <p className="text-gray-300 text-sm italic mb-5 leading-relaxed">
            "{testimonials[currentIndex].text}"
          </p>
          
          <div className="mt-auto">
            <p className="text-white font-bold text-sm">{testimonials[currentIndex].name}</p>
            <p className="text-[#509f2a] text-[10px] uppercase tracking-wider font-semibold">{testimonials[currentIndex].role}</p>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-6 relative z-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-[#509f2a] w-6' : 'bg-white/20 w-1.5 hover:bg-white/40'
              }`}
              aria-label={`Voir l'avis ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
