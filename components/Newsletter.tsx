
import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    if (!consent) {
      setStatus('error');
      setMessage('Veuillez accepter les conditions pour continuer.');
      return;
    }

    setStatus('loading');
    
    try {
      // Test de connexion au serveur avant l'inscription
      const testRes = await fetch('/api/test');
      if (!testRes.ok) {
        throw new Error(`Le serveur API ne répond pas (Status: ${testRes.status})`);
      }
      const testData = await testRes.json();
      console.log('Test API:', testData);

      const apiUrl = '/api/newsletter/subscribe';
      console.log('Appel API Newsletter:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Bienvenue dans la brigade ! Vérifiez vos emails pour confirmer.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur fetch newsletter:', error);
      setStatus('error');
      setMessage(`Erreur de connexion au serveur (${error instanceof Error ? error.message : 'Inconnue'}).`);
    }
  };

  return (
    <div className="mt-12 mb-10 px-2">
      <div className="bg-gradient-to-r from-[#111] to-[#151515] border border-amber-500/20 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-4 shadow-md">
            <Mail size={20} className="text-amber-500" />
          </div>
          
          <h3 className="font-display text-2xl text-white mb-2 tracking-wide">
            Rejoignez la Brigade
          </h3>
          
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto mb-6">
            Recevez chaque jeudi les secrets du Chef et nos recettes de saison directement dans votre boîte mail.
          </p>
          
          {status === 'success' ? (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="flex items-center gap-2 text-green-400 font-bold mb-2">
                <CheckCircle2 size={20} />
                <span>Inscription réussie !</span>
              </div>
              <p className="text-xs text-gray-500">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email de gourmet..."
                  className="w-full bg-black/50 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-amber-500/50 transition-all text-white placeholder:text-gray-600"
                  required
                />
              </div>
              
              <div className="flex items-start gap-3 px-4">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 accent-amber-500"
                />
                <label htmlFor="consent" className="text-[10px] text-gray-500 text-left leading-tight cursor-pointer">
                  J'accepte de recevoir la newsletter MiamChef et je reconnais avoir pris connaissance de la politique de confidentialité.
                </label>
              </div>

              {status === 'error' && (
                <div className="flex items-center justify-center gap-2 text-red-400 text-xs animate-shake">
                  <AlertCircle size={14} />
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-full transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Traitement...</span>
                  </>
                ) : (
                  "S'inscrire"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
