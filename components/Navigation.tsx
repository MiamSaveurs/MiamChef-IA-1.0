
import React, { useState, useEffect } from 'react';
import { ChefHat, Camera, Wine, Home, ShoppingCart, Calendar, Timer } from 'lucide-react';
import { AppView } from '../types';
import { getShoppingList } from '../services/storageService';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isOnline?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isOnline = true }) => {
  const [shoppingCount, setShoppingCount] = useState(0);

  const updateCount = async () => {
      try {
          const items = await getShoppingList();
          // Count only unchecked items
          const count = items.filter(i => !i.checked).length;
          setShoppingCount(count);
      } catch (e) {
          console.error("Error updating cart count", e);
      }
  };

  useEffect(() => {
      // Initial fetch
      updateCount();

      // Listen for updates from storage events
      const handleUpdate = () => updateCount();
      window.addEventListener('shopping-list-updated', handleUpdate);

      // Robust Polling (every 2 seconds) to ensure sync
      const interval = setInterval(updateCount, 2000);

      return () => {
          window.removeEventListener('shopping-list-updated', handleUpdate);
          clearInterval(interval);
      };
  }, []);

  const navItems = [
    { view: AppView.HOME, label: 'Studio', icon: Home, requiresOnline: false },
    { view: AppView.PLANNING, label: 'Semaine', icon: Calendar, requiresOnline: true },
    { view: AppView.RECIPE_CREATOR, label: 'Chef', icon: ChefHat, requiresOnline: true },
    { view: AppView.TIMER, label: 'Chrono', icon: Timer, requiresOnline: false },
    { view: AppView.SCAN_FRIDGE, label: 'Scan', icon: Camera, requiresOnline: true },
    { view: AppView.SHOPPING_LIST, label: 'Courses', icon: ShoppingCart, requiresOnline: false, badge: shoppingCount },
  ];

  const handleNavClick = (item: any) => {
      if (item.requiresOnline && !isOnline) return;
      setView(item.view);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-6">
      <nav className="glass-nav border border-white/20 shadow-xl max-w-lg mx-auto rounded-full pointer-events-auto mx-4 mb-2">
        <div className="flex justify-between items-center px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            const isDisabled = item.requiresOnline && !isOnline;

            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item)}
                disabled={isDisabled}
                className={`relative group flex flex-col items-center justify-center w-10 h-12 transition-all duration-300 ${isDisabled ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
              >
                <div className={`absolute inset-0 rounded-full bg-chef-green/10 scale-0 transition-transform duration-300 ${isActive ? 'scale-100' : 'group-hover:scale-75'}`}></div>
                <Icon 
                  size={20} 
                  className={`relative z-10 transition-all duration-300 ${isActive ? 'text-chef-green -translate-y-1' : 'text-gray-400 group-hover:text-chef-dark'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {/* Notification Badge */}
                {item.view === AppView.SHOPPING_LIST && shoppingCount > 0 && (
                    <div className="absolute top-0 right-0 z-20 -mr-1 -mt-1 bg-red-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white shadow-sm animate-bounce-slow">
                        {shoppingCount > 9 ? '9+' : shoppingCount}
                    </div>
                )}

                <span className={`absolute -bottom-1 text-[8px] font-bold tracking-tight transition-all duration-300 ${isActive ? 'opacity-100 text-chef-green translate-y-0' : 'opacity-0 translate-y-1'}`}>
                  {item.label}
                </span>
                {isActive && <div className="absolute top-0 right-1 w-1.5 h-1.5 bg-chef-green rounded-full shadow-glow"></div>}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
