
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { getShoppingList } from '../services/storageService';
import { 
  WickerBasket, 
  PremiumChefHat, 
  PremiumCamera, 
  PremiumWine, 
  PremiumCalendar, 
  PremiumTimer, 
  PremiumHome 
} from './Icons';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isOnline?: boolean;
  hasActiveTimer?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isOnline = true, hasActiveTimer = false }) => {
  const [shoppingCount, setShoppingCount] = useState(0);

  const updateCount = async () => {
      try {
          const items = await getShoppingList();
          const count = items.filter(i => !i.checked).length;
          setShoppingCount(count);
      } catch (e) {
          console.error("Error updating cart count", e);
      }
  };

  useEffect(() => {
      updateCount();
      const handleUpdate = () => updateCount();
      window.addEventListener('shopping-list-updated', handleUpdate);
      const interval = setInterval(updateCount, 2000);
      return () => {
          window.removeEventListener('shopping-list-updated', handleUpdate);
          clearInterval(interval);
      };
  }, []);

  const navItems = [
    { view: AppView.HOME, label: 'Studio', icon: PremiumHome, requiresOnline: false },
    { view: AppView.PLANNING, label: 'Semaine', icon: PremiumCalendar, requiresOnline: true },
    { view: AppView.RECIPE_CREATOR, label: 'Chef', icon: PremiumChefHat, requiresOnline: true },
    { view: AppView.TIMER, label: 'Chrono', icon: PremiumTimer, requiresOnline: false, isTimer: true },
    { view: AppView.SCAN_FRIDGE, label: 'Scan', icon: PremiumCamera, requiresOnline: true },
    { view: AppView.SHOPPING_LIST, label: 'Courses', icon: WickerBasket, requiresOnline: false, badge: shoppingCount },
  ];

  const handleNavClick = (item: any) => {
      if (item.requiresOnline && !isOnline) return;
      setView(item.view);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-6">
      <nav className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-full pointer-events-auto max-w-lg mx-auto mx-4 mb-2 p-2">
        <div className="flex justify-between items-center px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            const isDisabled = item.requiresOnline && !isOnline;

            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item)}
                disabled={isDisabled}
                className={`relative group flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 
                    ${isActive 
                        ? 'text-chef-green bg-green-50' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'} 
                    ${isDisabled ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
              >
                
                <Icon 
                  size={26} 
                  className={`relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : 'grayscale opacity-60'}`} 
                />
                
                {item.view === AppView.SHOPPING_LIST && shoppingCount > 0 && (
                    <div className="absolute top-2 right-2 z-20 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 border border-white">
                        <span className="text-white text-[9px] font-bold">{shoppingCount > 9 ? '9+' : shoppingCount}</span>
                    </div>
                )}

                {item.isTimer && hasActiveTimer && (
                     <div className="absolute top-2 right-2 z-20 h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
