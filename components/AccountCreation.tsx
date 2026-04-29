import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, X } from 'lucide-react';
import { AppView } from '../types';
import { setHasAccount } from '../services/storageService';

interface AccountCreationProps {
  setView: (view: AppView) => void;
}

const AccountCreation: React.FC<AccountCreationProps> = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Veuillez entrer un email valide.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Souscription à Mailchimp
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      // Valider la création de compte locale
      setHasAccount();
      
      // On continue vers l'accueil
      setView(AppView.HOME);
      
    } catch (err) {
      console.error('Erreur lors de la capture email:', err);
      // Fallback: on continue le tunnel pour ne pas bloquer l'utilisateur
      setHasAccount();
      setView(AppView.HOME);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black font-sans text-white overflow-y-auto flex flex-col justify-center items-center px-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2076&auto=format&fit=crop')] bg-cover bg-center opacity-30 blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

      <button onClick={() => setView(AppView.HOME)} className="fixed top-14 right-6 z-[70] text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10">
          <X size={24} />
      </button>

      <div className="relative z-10 w-full max-w-md bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 animate-fade-in text-center">
        <h2 className="font-display text-2xl mb-4 text-[#509f2a] leading-tight">Pour profiter de vos 7 jours offerts, renseignez votre email</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Aucune carte bancaire ne vous sera demandée pour commencer votre essai gratuit.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail size={18} className="text-[#509f2a]" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-[#509f2a] outline-none transition-colors"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-xs text-left">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#509f2a] hover:bg-[#408020] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Enregistrer <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
        
        <p className="text-[10px] text-gray-500 mt-6 leading-relaxed">
          En continuant, vous acceptez nos <button onClick={() => setView(AppView.LEGAL)} className="underline">Conditions Générales</button>.
        </p>
      </div>
    </div>
  );
};

export default AccountCreation;
