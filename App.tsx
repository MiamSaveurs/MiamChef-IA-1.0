
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
import Profile from './components/Profile';
import InstallPWA from './components/InstallPWA'; // Import Nouveau Composant
import { getTrialStatus, startSubscription } from './services/storageService';
import { AppView, RecipeMetrics } from './types';
import { WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // --- PERSISTENT RECIPE STATE ---
  const [persistentRecipe, setPersistentRecipe] = useState<{
    text: string;
    metrics: RecipeMetrics | null;
    utensils: string[];
    ingredients: string[];
    ingredientsWithQuantities?: string[];
    storageAdvice?: string;
    image: string | null;
  } | null>(null);

  // --- TIMER STATE ---
  const [timerTimeLeft, setTimerTimeLeft] = useState(0);
  const [timerInitialTime, setTimerInitialTime] = useState(0);
  const [timerIsActive, setTimerIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // --- GESTION DU RETOUR DE PAIEMENT STRIPE ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') === 'true') {
        startSubscription('annual'); 
        alert("🥂 Félicitations !\n\nPaiement accepté. Bienvenue dans le Club MiamChef Premium.\nVous avez désormais accès à toutes les fonctionnalités en illimité.\n\nÀ vos fourneaux !");
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.reload();
        return;
    }

    // VERIFICATION DU STATUT ABONNEMENT ET ESSAI
    checkSubscriptionStatus();

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkSubscriptionStatus = () => {
    const status = getTrialStatus();
    const now = Date.now();
    const daysPassed = (now - status.startDate) / (1000 * 60 * 60 * 24);
    
    // Si pas d'abonnement actif ET période d'essai de 7 jours dépassée
    if (!status.isSubscribed && daysPassed > 7) {
        setIsTrialExpired(true);
        // On force l'abonnement, SAUF si l'utilisateur est déjà en train de regarder son carnet (autorisé)
        if (currentView !== AppView.RECIPE_BOOK) {
             setCurrentView(AppView.SUBSCRIPTION);
        }
    }
  };

  // Sécurité supplémentaire : Si on change de vue et qu'on est expiré
  useEffect(() => {
      if (isTrialExpired && currentView !== AppView.SUBSCRIPTION && currentView !== AppView.RECIPE_BOOK && currentView !== AppView.LEGAL) {
          setCurrentView(AppView.SUBSCRIPTION);
      }
  }, [currentView, isTrialExpired]);

  // Initialize or Resume AudioContext on User Interaction
  const initAudio = () => {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(e => console.error("Audio resume failed", e));
      }
  };

  // --- SOUND GENERATOR (Kitchen Buzzer) ---
  const playAlarmSound = () => {
    try {
        if (!audioCtxRef.current) {
             const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
             if (AudioContext) audioCtxRef.current = new AudioContext();
        }

        const ctx = audioCtxRef.current;
        if (!ctx) return;
        
        const beep = (startTime: number, duration: number) => {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            
            osc1.type = 'square';
            osc2.type = 'sawtooth';

            osc1.frequency.setValueAtTime(880, startTime); 
            osc1.frequency.exponentialRampToValueAtTime(800, startTime + duration);
            
            osc2.frequency.setValueAtTime(1760, startTime);
            
            gain.gain.setValueAtTime(0.8, startTime); 
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            osc1.start(startTime);
            osc2.start(startTime);
            
            osc1.stop(startTime + duration);
            osc2.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        beep(now, 0.4);
        beep(now + 0.5, 0.4); 
        beep(now + 1.0, 0.4);
        beep(now + 1.5, 0.8);
        
    } catch (e) {
        console.error("Audio playback failed", e);
    }
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (timerIsActive && timerTimeLeft > 0) {
        timerRef.current = setInterval(() => {
            setTimerTimeLeft((prev) => {
                if (prev <= 1) {
                    setTimerIsActive(false);
                    if (timerRef.current) clearInterval(timerRef.current);
                    playAlarmSound();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    } else if (timerTimeLeft === 0) {
        setTimerIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerIsActive, timerTimeLeft]);

  const handleTimerStart = (seconds: number) => {
    initAudio();
    setTimerInitialTime(seconds);
    setTimerTimeLeft(seconds);
    setTimerIsActive(true);
  };

  const handleTimerToggle = () => {
    if (timerTimeLeft > 0) {
        if (!timerIsActive) initAudio();
        setTimerIsActive(!timerIsActive);
    }
  };

  const handleTimerReset = () => {
    setTimerIsActive(false);
    setTimerTimeLeft(0);
    setTimerInitialTime(0);
  };

  const handleTimerAdd = (seconds: number) => {
    setTimerInitialTime(prev => prev + seconds);
    setTimerTimeLeft(prev => prev + seconds);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME: return <Home setView={setCurrentView} isOnline={isOnline} />;
      case AppView.RECIPE_CREATOR: return (
        <RecipeCreator 
            persistentState={persistentRecipe}
            setPersistentState={setPersistentRecipe}
        />
      );
      case AppView.SCAN_FRIDGE: return <FridgeScanner />;
      case AppView.SOMMELIER: return <Sommelier />;
      case AppView.DISH_EDITOR: return <DishEditor />;
      
      // Passage de isTrialExpired au RecipeBook pour gérer l'affichage "Restreint"
      case AppView.RECIPE_BOOK: return (
        <RecipeBook 
            onBack={() => setCurrentView(isTrialExpired ? AppView.SUBSCRIPTION : AppView.HOME)} 
            isTrialExpired={isTrialExpired}
        />
      );
      
      case AppView.SUBSCRIPTION: return (
        <Subscription 
            onClose={() => !isTrialExpired && setCurrentView(AppView.HOME)} 
            isTrialExpired={isTrialExpired} 
            setView={setCurrentView} 
            onAccessBook={() => setCurrentView(AppView.RECIPE_BOOK)}
        />
      );
      
      case AppView.SHOPPING_LIST: return <ShoppingList />;
      case AppView.VALUE_PROPOSITION: return <ValueProposition onClose={() => setCurrentView(AppView.HOME)} onSubscribe={() => setCurrentView(AppView.SUBSCRIPTION)} />;
      case AppView.LEGAL: return <LegalDocuments onClose={() => setCurrentView(AppView.HOME)} />;
      case AppView.PLANNING: return <MealPlanner />;
      case AppView.PROFILE: return <Profile />;
      case AppView.TIMER: return (
        <SmartTimer 
            timeLeft={timerTimeLeft} 
            initialTime={timerInitialTime} 
            isActive={timerIsActive} 
            onStart={handleTimerStart}
            onToggle={handleTimerToggle}
            onReset={handleTimerReset}
            onAdd={handleTimerAdd}
        />
      );
      default: return <Home setView={setCurrentView} isOnline={isOnline} />;
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-body selection:bg-chef-green/30">
      {!isOnline && (
        <div className="bg-red-900/50 text-white text-[10px] font-bold text-center py-1 sticky top-0 z-[200] flex items-center justify-center gap-2 backdrop-blur-md border-b border-red-500/20">
            <WifiOff size={12} /> HORS CONNEXION
        </div>
      )}
      
      <main className="w-full">{renderView()}</main>

      {/* BANNIÈRE D'INSTALLATION INTELLIGENTE */}
      <InstallPWA />

      {/* Navigation masquée si bloqué (Trial Expired), sauf pour les vues légales ou l'abonnement */}
      {currentView !== AppView.SUBSCRIPTION && currentView !== AppView.VALUE_PROPOSITION && currentView !== AppView.LEGAL && !isTrialExpired && (
        <Navigation 
            currentView={currentView} 
            setView={setCurrentView} 
            isOnline={isOnline}
            isTimerActive={timerIsActive}
            timerTimeLeft={timerTimeLeft}
        />
      )}
    </div>
  );
};

export default App;
