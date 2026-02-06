
import React, { useState, useEffect } from 'react';
import { X, Share, MoreVertical, Download, Phone } from 'lucide-react';

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Détection si l'app est déjà installée (Mode Standalone)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isInStandaloneMode);

    if (isInStandaloneMode) return;

    // Détection iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    // Détection Android (Chrome) pour le prompt natif
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Si c'est iOS, on affiche la bannière après quelques secondes
    if (ios) {
        const timer = setTimeout(() => setShowInstallBanner(true), 3000);
        return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      }
    }
  };

  if (isStandalone || !showInstallBanner) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[100] animate-slide-up">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#509f2a] to-blue-500"></div>

        <button 
            onClick={() => setShowInstallBanner(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-white"
        >
            <X size={16} />
        </button>

        <div className="flex items-start gap-4 pr-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#509f2a] to-[#1a4a2a] rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                <Download size={24} className="text-white" />
            </div>
            <div>
                <h3 className="font-display text-white text-lg leading-none mb-1">Installer MiamChef</h3>
                <p className="text-xs text-gray-400 mb-3">
                    Ajoutez l'application sur votre écran d'accueil pour un accès instantané et plein écran.
                </p>

                {isIOS ? (
                    <div className="text-xs text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5">
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Appuyez sur le bouton <strong>Partager</strong> <Share size={10} className="inline mx-1" /> dans la barre du navigateur.</li>
                            <li>Cherchez et appuyez sur <strong>"Sur l'écran d'accueil"</strong>.</li>
                        </ol>
                    </div>
                ) : (
                    <button 
                        onClick={handleInstallClick}
                        className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <Phone size={14} /> Installer l'App
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
