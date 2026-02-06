
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
import { getTrialStatus } from './services/storageService';
import { AppView, RecipeMetrics } from './types';
import { WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // --- PERSISTENT RECIPE STATE ---
  // Stocke la recette générée pour qu'elle ne disparaisse pas en changeant de vue
  const [persistentRecipe, setPersistentRecipe] = useState<{
    text: string;
    metrics: RecipeMetrics | null;
    utensils: string[];
    ingredients: string[];
    ingredientsWithQuantities?: string[];
    storageAdvice?: string;
    image: string | null;
  } | null>(null);

  // --- TIMER STATE LIFTED UP ---
  const [timerTimeLeft, setTimerTimeLeft] = useState(0);
  const [timerInitialTime, setTimerInitialTime] = useState(0);
  const [timerIsActive, setTimerIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // CORRECTION AUDIO : On garde le contexte en référence pour le réutiliser
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // VERIFICATION DU STATUT ABONNEMENT ET ESSAI
    const status = getTrialStatus();
    const now = Date.now();
    const daysPassed = (now - status.startDate) / (1000 * 60 * 60 * 24);
    
    // Si pas d'abonnement actif ET période d'essai de 7 jours dépassée
    // Cela couvre aussi le cas où l'utilisateur ne renouvelle pas (status.isSubscribed devient false)
    if (!status.isSubscribed && daysPassed > 7) {
        setIsTrialExpired(true);
        setCurrentView(AppView.SUBSCRIPTION); // Force l'affichage de l'abonnement
    }

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  // --- SOUND GENERATOR (Kitchen Buzzer - High Volume) ---
  const playAlarmSound = () => {
    try {
        // Fallback: create context if null (should not happen if initAudio called on start)
        if (!audioCtxRef.current) {
             const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
             if (AudioContext) audioCtxRef.current = new AudioContext();
        }

        const ctx = audioCtxRef.current;
        if (!ctx) return;
        
        // Fonction pour jouer un bip composite puissant
        const beep = (startTime: number, duration: number) => {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            
            // Connexion des oscillateurs au volume
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            
            // Formes d'ondes agressives pour percer le bruit ambiant
            osc1.type = 'square';      // Son type "Buzzer" classique
            osc2.type = 'sawtooth';    // Son type "Alarme" strident

            // Fréquences (Harmoniques)
            // 880Hz (La5) et 1760Hz (La6) pour max de présence
            osc1.frequency.setValueAtTime(880, startTime); 
            osc1.frequency.exponentialRampToValueAtTime(800, startTime + duration); // Légère descente pour l'effet "Alerte"
            
            osc2.frequency.setValueAtTime(1760, startTime);
            
            // VOLUME FORT (Gain élevé avec attaque rapide)
            gain.gain.setValueAtTime(0.8, startTime); 
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            osc1.start(startTime);
            osc2.start(startTime);
            
            osc1.stop(startTime + duration);
            osc2.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        // Séquence : 4 bips rapides et incisifs
        beep(now, 0.4);
        beep(now + 0.5, 0.4); 
        beep(now + 1.0, 0.4);
        beep(now + 1.5, 0.8); // Dernier bip plus long
        
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
                    // TIMER FINISHED
                    setTimerIsActive(false);
                    if (timerRef.current) clearInterval(timerRef.current);
                    
                    // Trigger Sound
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
    initAudio(); // IMPORTANT: Débloque l'audio sur l'interaction utilisateur
    setTimerInitialTime(seconds);
    setTimerTimeLeft(seconds);
    setTimerIsActive(true);
  };

  const handleTimerToggle = () => {
    if (timerTimeLeft > 0) {
        if (!timerIsActive) initAudio(); // Débloque aussi si on reprend après pause
        setTimerIsActive(!timerIsActive);
    }
  };

  const handleTimerReset = () => {
    setTimerIsActive(false);
    setTimerTimeLeft(0);
    setTimerInitialTime(0);
  };

  const handleTimerAdd = (seconds: number) => {
    // Si on ajoute du temps alors que c'est en pause, pas besoin d'initAudio
    // Si on ajoute pendant que ça tourne, l'audio est déjà init
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
      case AppView.RECIPE_BOOK: return <RecipeBook onBack={() => setCurrentView(AppView.HOME)} />;
      case AppView.SUBSCRIPTION: return <Subscription onClose={() => !isTrialExpired && setCurrentView(AppView.HOME)} isTrialExpired={isTrialExpired} setView={setCurrentView} />;
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

      {/* La navigation est masquée si l'essai est terminé et non payé pour bloquer l'utilisateur */}
      {currentView !== AppView.SUBSCRIPTION && currentView !== AppView.VALUE_PROPOSITION && currentView !== AppView.LEGAL && !isTrialExpired && (
        <Navigation 
            currentView={currentView} 
            setView={setCurrentView} 
            isOnline={isOnline}
            isTimerActive={timerIsActive}
            timerTimeLeft={timerTimeLeft} // On passe le temps restant
        />
      )}
    </div>
  );
};

export default App;
