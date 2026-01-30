
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { getShoppingList } from '../services/storageService';
import { 
  WickerBasket, 
  PremiumChefHat, 
  PremiumCamera, 
  PremiumCalendar, 
  PremiumTimer, 
  PremiumHome,
  PremiumFingerprint
} from './Icons';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isOnline?: boolean;
  isTimerActive?: boolean; 
  timerTimeLeft?: number; // Nouveau prop pour le temps
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isTimerActive, timerTimeLeft = 0 }) => {
  const [shoppingCount, setShoppingCount] = useState(0);

  useEffect(() => {
      const update = async () => {
          const items = await getShoppingList();
          setShoppingCount(items.filter(i => !i.checked).length);
      };
      update();
      const interval = setInterval(update, 3000);
      return () => clearInterval(interval);
  }, []);

  const formatTimerBadge = (seconds: number) => {
      if (seconds <= 0) return null;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      // Format compact : si moins d'une minute "45s", sinon "3:45"
      if (m === 0) return `${s}s`;
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const navItems = [
    { view: AppView.HOME, icon: PremiumHome, activeColor: 'text-[#509f2a]' },
    { view: AppView.PLANNING, icon: PremiumCalendar, activeColor: 'text-gray-400' },
    { view: AppView.RECIPE_CREATOR, icon: PremiumChefHat, activeColor: 'text-gray-400' },
    { view: AppView.TIMER, icon: PremiumTimer, activeColor: 'text-gray-400' },
    { view: AppView.SCAN_FRIDGE, icon: PremiumCamera, activeColor: 'text-gray-400' },
    { view: AppView.SHOPPING_LIST, icon: WickerBasket, activeColor: 'text-gray-400', badge: shoppingCount },
    { view: AppView.PROFILE, icon: PremiumFingerprint, activeColor: 'text-white' }
  ];

  return (
    <div className="fixed bottom-6 left-0 w-full z-50 px-2 flex justify-center">
      <nav className="bg-white rounded-full w-full max-w-lg h-20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex justify-between items-center px-2 md:px-6 border border-gray-100 overflow-x-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;

            return (
              <button
                key={idx}
                onClick={() => setView(item.view)}
                className={`relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full transition-all ${isActive ? 'bg-green-50' : ''}`}
              >
                <Icon 
                  size={24} 
                  className={`${isActive ? 'text-[#509f2a]' : 'text-gray-300'}`} 
                />
                
                {/* Badge Shopping List (Rouge, rond) */}
                {item.view === AppView.SHOPPING_LIST && shoppingCount > 0 && (
                    <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-sm">
                        <span className="text-white text-[9px] font-black">{shoppingCount > 9 ? '9+' : shoppingCount}</span>
                    </div>
                )}

                {/* Badge Timer (Rouge, Pilule avec décompte) */}
                {item.view === AppView.TIMER && isTimerActive && timerTimeLeft > 0 && (
                    <div className="absolute -top-2 -right-3 bg-red-500 border-2 border-white shadow-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-[24px] text-center animate-pulse z-10">
                        {formatTimerBadge(timerTimeLeft)}
                    </div>
                )}
              </button>
            );
          })}
      </nav>
    </div>
  );
};

export default Navigation;
