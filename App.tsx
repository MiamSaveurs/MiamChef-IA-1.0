
import React, { useState, useEffect, useRef } from 'react';
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
import { ChefHat, ArrowRight, WifiOff, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [hasKey, setHasKey] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Accessibility State
  const [largeText, setLargeText] = useState(localStorage.getItem('miamchef_large_text') === 'true');

  // GLOBAL TIMER STATE (Avec initialisation depuis LocalStorage)
  const [timerTarget, setTimerTarget] = useState<number | null>(() => {
      const saved = localStorage.getItem('miamchef_timer_target');
      return saved ? parseInt(saved, 10) : null;
  });
  const [timerDuration, setTimerDuration] = useState<number>(() => {
      const saved = localStorage.getItem('miamchef_timer_duration');
      return saved ? parseInt(saved, 10) : 0;
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => {
      const saved = localStorage.getItem('miamchef_timer_left');
      return saved ? parseInt(saved, 10) : 0;
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const alarmPlayedRef = useRef(false);

  // Sauvegarde automatique du Timer
  useEffect(() => {
    if (timerTarget) localStorage.setItem('miamchef_timer_target', timerTarget.toString());
    else localStorage.removeItem('miamchef_timer_target');
    
    localStorage.setItem('miamchef_timer_duration', timerDuration.toString());
    localStorage.setItem('miamchef_timer_left', timeLeft.toString());
  }, [timerTarget, timerDuration, timeLeft]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    localStorage.setItem('miamchef_large_text', String(largeText));
  }, [largeText]);

  // LOGIQUE MINUTEUR
  useEffect(() => {
    if (!timerTarget) return;

    const interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.ceil((timerTarget - now) / 1000);

        if (diff <= 0) {
            setTimeLeft(0);
            if (!alarmPlayedRef.current) {
                alarmPlayedRef.current = true;
                playAlarm();
                setTimerTarget(null); // Fin du chrono
            }
        } else {
            setTimeLeft(diff);
        }
    }, 1000);

    // Ajustement immédiat pour éviter le saut visuel au chargement
    const now = Date.now();
    const diff = Math.ceil((timerTarget - now) / 1000);
    if (diff > 0) setTimeLeft(diff);
    else if (timerTarget && diff <= 0) {
        setTimeLeft(0);
        setTimerTarget(null);
    }

    return () => clearInterval(interval);
  }, [timerTarget]);

  const initAudio = () => {
     if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
    }
  };

  const playAlarm = () => {
    initAudio();
    const ctx = audioContextRef.current!;
    const now = ctx.currentTime;

    const scheduleBeep = (startTime: number) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'triangle'; 
        oscillator.frequency.setValueAtTime(880, startTime); 
        oscillator.frequency.linearRampToValueAtTime(1760, startTime + 0.1); 
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(1.0, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
    };

    for (let set = 0; set < 3; set++) {
        const setStart = now + (set * 2.5);
        for (let i = 0; i < 5; i++) {
            scheduleBeep(setStart + (i * 0.3)); 
        }
    }

    if (navigator.vibrate) {
        const p = [200, 100, 200, 100, 200, 100, 200, 100, 200];
        navigator.vibrate([...p, 1000, ...p, 1000, ...p]);
    }
  };

  const handleStartTimer = (seconds: number) => {
      initAudio();
      const now = Date.now();
      setTimerDuration(seconds);
      setTimerTarget(now + seconds * 1000);
      setTimeLeft(seconds);
      alarmPlayedRef.current = false;
  };

  const handleToggleTimer = () => {
      initAudio();
      if (timerTarget) {
          // PAUSE
          setTimerTarget(null);
      } else {
          // REPRISE
          if (timeLeft > 0) {
              const now = Date.now();
              setTimerTarget(now + timeLeft * 1000);
              alarmPlayedRef.current = false;
          } else if (timerDuration > 0) {
              handleStartTimer(timerDuration);
          }
      }
  };

  const handleResetTimer = () => {
      setTimerTarget(null);
      setTimeLeft(timerDuration > 0 ? timerDuration : 0);
      alarmPlayedRef.current = false;
  };

  const handleAddTimer = (seconds: number) => {
      if (timerTarget) {
          setTimerTarget(prev => (prev ? prev + (seconds * 1000) : null));
          setTimeLeft(prev => prev + seconds);
      } else {
          setTimeLeft(prev => prev + seconds);
      }
      setTimerDuration(prev => prev + seconds);
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const timer = setTimeout(() => setShowSplash(false), 2800);

    const checkKey = async () => {
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
      case AppView.TIMER: return (
        <SmartTimer 
            timeLeft={timeLeft} 
            isActive={!!timerTarget} 
            initialTime={timerDuration}
            onStart={handleStartTimer}
            onToggle={handleToggleTimer}
            onReset={handleResetTimer}
            onAdd={handleAddTimer}
        />
      );
      default: return <Home setView={setCurrentView} isOnline={isOnline} />;
    }
  };

  const formatMiniTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const miniProgress = timerDuration > 0 ? ((timerDuration - timeLeft) / timerDuration) * 113 : 0; 

  return (
    <div className="bg-[#f9fafb] min-h-screen text-chef-dark font-body selection:bg-chef-green selection:text-white">
      {!isOnline && <div className="bg-gray-800 text-white text-xs font-bold text-center py-2 px-4 sticky top-0 z-[100] flex items-center justify-center gap-2"><WifiOff size={14} /> MODE HORS CONNEXION</div>}
      {isTrialExpired && !isSubscribed && isSafeView && <div onClick={() => setCurrentView(AppView.SUBSCRIPTION)} className="bg-red-600 text-white text-xs font-bold text-center py-2 px-4 sticky top-0 z-[90] cursor-pointer">PÉRIODE D'ESSAI TERMINÉE - CLIQUEZ ICI</div>}
      
      <main className="w-full">{renderView()}</main>

      {/* FLOATING MINI TIMER - VISIBLE IF RUNNING OR PAUSED (timeLeft > 0) */}
      {(timerTarget || timeLeft > 0) && currentView !== AppView.TIMER && (
          <div 
            onClick={() => setCurrentView(AppView.TIMER)}
            className={`fixed bottom-24 right-4 text-white p-3 rounded-2xl shadow-xl z-50 flex items-center gap-3 cursor-pointer animate-fade-in border border-white/10 hover:scale-105 transition-transform ${timerTarget ? 'bg-chef-dark' : 'bg-orange-500'}`}
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                 <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" className={timerTarget ? "text-gray-700" : "text-orange-300"} />
                 <circle 
                    cx="20" cy="20" r="18" 
                    stroke={timerTarget ? "#509f2a" : "#fff"} 
                    strokeWidth="3" fill="transparent" 
                    strokeDasharray="113" 
                    strokeDashoffset={113 - miniProgress} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-linear"
                 />
              </svg>
              <span className="text-[10px] font-bold z-10">{formatMiniTime(timeLeft)}</span>
            </div>
            <div className="pr-2">
               <span className="text-[9px] uppercase font-bold block tracking-wider opacity-80">{timerTarget ? 'Cuisson' : 'En Pause'}</span>
               <span className={`text-xs font-bold flex items-center gap-1 ${timerTarget ? 'text-chef-green' : 'text-white'}`}>
                   {timerTarget && <div className="w-1.5 h-1.5 rounded-full bg-chef-green animate-pulse"></div>} 
                   {timerTarget ? 'En cours' : 'Reprendre'}
               </span>
            </div>
            <button 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    setTimerTarget(null); 
                    setTimeLeft(0); 
                    setTimerDuration(0); 
                }}
                className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white"
            >
                <X size={14} />
            </button>
          </div>
      )}

      {currentView !== AppView.SUBSCRIPTION && currentView !== AppView.VALUE_PROPOSITION && currentView !== AppView.LEGAL && !isLockedByExpiration && (
        <Navigation 
            currentView={currentView} 
            setView={setCurrentView} 
            isOnline={isOnline} 
            hasActiveTimer={!!timerTarget} 
        />
      )}
    </div>
  );
};

export default App;
