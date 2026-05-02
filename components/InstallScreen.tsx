import React, { useState, useEffect } from 'react';
import { Download, Phone, CheckCircle, ArrowRight, Share } from 'lucide-react';
import { AppView } from '../types';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallScreenProps {
  setView: (view: AppView) => void;
}

const InstallScreen: React.FC<InstallScreenProps> = ({ setView }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!isInStandaloneMode);

    if (isInStandaloneMode) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // Grab the event if it fires while on this screen
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If it already fired globally before this component mounted, we can access it if we stored it globally, 
    // but typically we can't unless we expose it. However, the user flow guarantees they spend some time on Home -> Email -> here, 
    // it usually fires fairly early. Let's look for a globally attached prompt if available:
    if ((window as any).deferredPromptEvent) {
      setDeferredPrompt((window as any).deferredPromptEvent);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setInstalled(true);
        // On success, redirect to home
        setTimeout(() => setView(AppView.HOME), 1500);
      }
    }
  };

  const skipInstall = () => {
    setView(AppView.HOME);
  };

  // If they are already in the app (installed), just proceed to HOME
  useEffect(() => {
    if (isStandalone) {
      setView(AppView.HOME);
    }
  }, [isStandalone, setView]);

  return (
    <div className="fixed inset-0 z-[60] bg-black font-sans text-white overflow-y-auto flex flex-col justify-center items-center px-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2076&auto=format&fit=crop')] bg-cover bg-center opacity-30 blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-[#121212]/80"></div>

      <div className="relative z-10 w-full max-w-md bg-[#121212]/90 backdrop-blur-xl border border-[#509f2a]/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(80,159,42,0.15)] p-8 animate-fade-in text-center flex flex-col items-center">
        
        <div className="w-20 h-20 bg-gradient-to-br from-[#509f2a] to-[#205010] rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(80,159,42,0.4)] mb-6">
          {installed ? <CheckCircle size={40} className="text-white" /> : <Download size={40} className="text-white" />}
        </div>

        <h2 className="font-display text-3xl mb-4 text-[#509f2a] leading-tight">
          {installed ? "Application Installée !" : "Installez l'application"}
        </h2>
        
        <p className="text-gray-300 text-sm mb-8 leading-relaxed">
          Pour profitez plainement de vos <strong className="text-white">7 jours offerts</strong> avec toutes les fonctionnalités débloquées, ajoutez MiamChef sur votre écran d'accueil.
        </p>

        {installed ? (
          <button
            onClick={() => setView(AppView.HOME)}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            C'est parti ! <ArrowRight size={20} />
          </button>
        ) : isIOS ? (
          <div className="w-full text-left bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
            <h4 className="font-bold text-[#509f2a] mb-2 flex items-center gap-2"><Phone size={16} /> Sur iPhone / iPad :</h4>
            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-3">
              <li>Appuyez sur le bouton <strong>Partager</strong> <Share size={14} className="inline mx-1 text-white" /> en bas de votre navigateur Safari.</li>
              <li>Faites défiler vers le bas et sélectionnez <strong>"Sur l'écran d'accueil"</strong>.</li>
              <li>Confirmez en cliquant sur <strong>"Ajouter"</strong> en haut à droite.</li>
            </ol>
            <button
                onClick={skipInstall}
                className="w-full mt-6 bg-[#509f2a] hover:bg-[#408020] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              J'ai compris, continuer <ArrowRight size={18} />
            </button>
          </div>
        ) : deferredPrompt ? (
          <div className="w-full space-y-4">
              <button
                onClick={handleInstallClick}
                className="w-full bg-[#509f2a] hover:bg-[#408020] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02]"
              >
                <Download size={20} /> Installer MiamChef
              </button>
              <button
                onClick={skipInstall}
                className="w-full bg-transparent text-gray-400 font-medium py-3 rounded-xl hover:text-white transition-colors text-sm"
              >
                  Je le ferai plus tard
              </button>
          </div>
        ) : (
          <div className="w-full space-y-4">
              <p className="text-yellow-400/80 text-xs mb-4">
                  Votre navigateur ne supporte pas l'installation directe. Ajoutez la page à vos favoris ou à votre écran d'accueil via le menu du navigateur.
              </p>
              <button
                onClick={skipInstall}
                className="w-full bg-[#509f2a] hover:bg-[#408020] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02]"
              >
                Aller sur l'application <ArrowRight size={20} />
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallScreen;
