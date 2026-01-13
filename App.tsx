
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import RecipeCreator from './components/RecipeCreator';
import FridgeScanner from './components/FridgeScanner';
import Sommelier from './components/Sommelier';
import DishEditor from './components/DishEditor';
import RecipeBook from './components/RecipeBook';
import Subscription from './components/Subscription';
import ShoppingList from './components/ShoppingList';
import ValueProposition from './components/ValueProposition';
import LegalDocuments from './components/LegalDocuments';
import MealPlanner from './components/MealPlanner';
import SmartTimer from './components/SmartTimer';
import { getTrialStatus, startSubscription } from './services/storageService';
import { AppView } from './types';
import { ChefHat, ArrowRight, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [hasKey, setHasKey] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Accessibility State
  const [largeText, setLargeText] = useState(localStorage.getItem('miamchef_large_text') === 'true');

  useEffect(() => {
    // Apply large text mode to HTML root
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    localStorage.setItem('miamchef_large_text', String(largeText));
  }, [largeText]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const timer = setTimeout(() => setShowSplash(false), 2800);

    const checkKey = async () => {
      // Safe check for API key presence in environment to skip manual entry if deployed with env var
      const hasEnvKey = (typeof process !== 'undefined' && process.env?.API_KEY) || 
                        // @ts-ignore
                        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY);

      if (hasEnvKey) {
          setHasKey(true);
      } else {
          // @ts-ignore
          if (window.aistudio && window.aistudio.hasSelectedApiKey) {
            // @ts-ignore
            const has = await window.aistudio.hasSelectedApiKey();
            setHasKey(has);
          } else {
            // In dev mode or fallback
            setHasKey(true);
          }
      }
    };
    checkKey();

    const query = new URLSearchParams(window.location.search);
    if (query.get('payment_success')) {
        startSubscription('annual');
        alert("Félicitations ! Vous faites maintenant partie de l'élite MiamChef IA. Votre abonnement est actif.");
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const checkStatus = () => {
        const status = getTrialStatus();
        setIsSubscribed(status.isSubscribed);
        if (!status.isSubscribed) {
            const now = Date.now();
            const daysPassed = (now - status.startDate) / (1000 * 60 * 60 * 24);
            if (daysPassed > 7) {
                setIsTrialExpired(true);
                if (currentView !== AppView.RECIPE_BOOK && currentView !== AppView.SHOPPING_LIST && currentView !== AppView.HOME && currentView !== AppView.LEGAL && currentView !== AppView.VALUE_PROPOSITION && currentView !== AppView.TIMER) {
                    setCurrentView(AppView.SUBSCRIPTION);
                }
            }
        } else {
            setIsTrialExpired(false);
        }
    };
    checkStatus();

    return () => {
        clearTimeout(timer);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, [currentView]);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio && window.aistudio.openSelectKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setHasKey(true);
    }
  };

  const isSafeView = currentView === AppView.RECIPE_BOOK || currentView === AppView.SHOPPING_LIST || currentView === AppView.HOME || currentView === AppView.LEGAL || currentView === AppView.VALUE_PROPOSITION || currentView === AppView.TIMER;
  const isLockedByExpiration = isTrialExpired && !isSubscribed && !isSafeView;

  if (!hasKey && !isSafeView && isOnline) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center p-6 text-center text-chef-dark">
         <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-green-50 rounded-2xl">
                    <ChefHat size={48} className="text-chef-green" />
                </div>
            </div>
            <h1 className="text-4xl font-display mb-2">Miam<span className="text-chef-green">Chef</span> IA</h1>
            <p className="text-gray-500 font-body mb-8">
               Bienvenue dans votre suite culinaire intelligente. Pour accéder aux modèles avancés (Chef 3.0 & Photos 4K), une clé API est requise.
            </p>
            <button onClick={handleSelectKey} disabled={!isOnline} className="w-full bg-chef-green text-white font-display text-xl py-4 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                {isOnline ? <>Commencer l'expérience <ArrowRight size={20} /></> : <><WifiOff size={20} /> Connexion requise</>}
            </button>
            {!isOnline && <div className="mt-4"><button onClick={() => setCurrentView(AppView.HOME)} className="text-sm text-gray-500 underline">Accéder hors-ligne</button></div>}
         </div>
      </div>
    );
  }

  if (isLockedByExpiration && currentView !== AppView.SUBSCRIPTION) {
      setTimeout(() => setCurrentView(AppView.SUBSCRIPTION), 0);
      return null;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME: return <Home setView={setCurrentView} isOnline={isOnline} />;
      case AppView.RECIPE_CREATOR: return <RecipeCreator />;
      case AppView.SCAN_FRIDGE: return <FridgeScanner />;
      case AppView.SOMMELIER: return <Sommelier />;
      case AppView.DISH_EDITOR: return <DishEditor />;
      case AppView.RECIPE_BOOK: return <RecipeBook onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.SUBSCRIPTION: return <Subscription onClose={() => !isTrialExpired && setCurrentView(AppView.HOME)} isTrialExpired={isTrialExpired} setView={setCurrentView} largeText={largeText} toggleLargeText={() => setLargeText(!largeText)} />;
      case AppView.SHOPPING_LIST: return <ShoppingList />;
      case AppView.VALUE_PROPOSITION: return <ValueProposition onClose={() => setCurrentView(AppView.HOME)} />;
      case AppView.LEGAL: return <LegalDocuments onClose={() => setCurrentView(AppView.HOME)} />;
      case AppView.PLANNING: return <MealPlanner />;
      case AppView.TIMER: return <SmartTimer />;
      default: return <Home setView={setCurrentView} isOnline={isOnline} />;
    }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen text-chef-dark font-body selection:bg-chef-green selection:text-white">
      {!isOnline && <div className="bg-gray-800 text-white text-xs font-bold text-center py-2 px-4 sticky top-0 z-[100] flex items-center justify-center gap-2"><WifiOff size={14} /> MODE HORS CONNEXION</div>}
      {isTrialExpired && !isSubscribed && isSafeView && <div onClick={() => setCurrentView(AppView.SUBSCRIPTION)} className="bg-red-600 text-white text-xs font-bold text-center py-2 px-4 sticky top-0 z-[90] cursor-pointer">PÉRIODE D'ESSAI TERMINÉE - CLIQUEZ ICI</div>}
      <main className="w-full">{renderView()}</main>
      {currentView !== AppView.SUBSCRIPTION && currentView !== AppView.VALUE_PROPOSITION && currentView !== AppView.LEGAL && !isLockedByExpiration && (
        <Navigation currentView={currentView} setView={setCurrentView} isOnline={isOnline} />
      )}
    </div>
  );
};

export default App;
