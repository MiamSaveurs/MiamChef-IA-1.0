
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from '../services/storageService';
import { Save, User, Leaf, AlertTriangle, ThumbsDown, PenTool, Users, ChefHat, Check, Settings, Share2, Copy, Gift } from 'lucide-react';
import { PremiumFingerprint, PremiumCrown } from './Icons';

const Profile: React.FC = () => {
    // Note: Default is handled by storageService now
    const [profile, setProfile] = useState<UserProfile>(getUserProfile());
    const [isSaved, setIsSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSave = () => {
        saveUserProfile(profile);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleCopyCode = () => {
        if (profile.referralCode) {
            navigator.clipboard.writeText(profile.referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShareReferral = async () => {
        if (navigator.share && profile.referralCode) {
            try {
                await navigator.share({
                    title: 'Rejoins le club MiamChef !',
                    text: `Salut ! Utilise mon code VIP ${profile.referralCode} pour débloquer 1 mois offert sur MiamChef, l'appli de cuisine du futur.`,
                    url: 'https://miamchef.vercel.app' // Remplacez par votre URL
                });
            } catch (err) {
                console.log('Partage annulé');
            }
        } else {
            handleCopyCode();
            alert("Code copié dans le presse-papier !");
        }
    };

    const dietOptions = ["Classique (Aucun)", "Végétarien", "Vegan", "Halal", "Casher", "Sans Gluten", "Sans Lactose", "Régime Crétois", "Sportif (Protéiné)"];
    const levelOptions = ["Débutant", "Intermédiaire", "Expert"];

    return (
        <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
             {/* Background */}
             <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-black"></div>
             </div>

             <div className="relative z-10 max-w-2xl mx-auto px-6 pt-10">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4 border border-white/10">
                        <Settings size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display text-white mb-2 drop-shadow-md">
                        Mes Préférences
                    </h1>
                    <p className="text-gray-400 text-sm font-light tracking-widest uppercase">
                        Personnalisez votre expérience
                    </p>
                </div>

                <div className="space-y-6">
                    
                    {/* --- MODULE PARRAINAGE (GROWTH HACKING) --- */}
                    <div className="bg-gradient-to-br from-[#1a4a2a] to-[#0f2e1b] border border-[#509f2a]/50 rounded-[2rem] p-6 shadow-[0_0_40px_rgba(80,159,42,0.15)] relative overflow-hidden">
                         {/* Shine Effect */}
                         <div className="absolute top-0 right-0 w-32 h-32 bg-[#509f2a]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                         
                         <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white rounded-lg text-[#1a4a2a] shadow-lg">
                                    <PremiumCrown size={24} />
                                </div>
                                <div>
                                    <h3 className="font-display text-2xl text-white leading-none">Programme Ambassadeur</h3>
                                    <p className="text-[10px] text-green-200 font-bold uppercase tracking-widest mt-1">Gagnez MiamChef Premium Gratuitement</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                                Invitez vos amis à rejoindre le club. Pour chaque ami qui s'inscrit avec votre code, vous gagnez <span className="font-bold text-white">1 MOIS PREMIUM OFFERT</span>.
                            </p>

                            <div className="bg-black/30 rounded-xl p-4 flex items-center justify-between border border-white/10 mb-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Votre Code Unique</span>
                                    <span className="font-mono text-2xl font-bold text-white tracking-widest">{profile.referralCode}</span>
                                </div>
                                <button 
                                    onClick={handleCopyCode}
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                                >
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                </button>
                            </div>

                            <button 
                                onClick={handleShareReferral}
                                className="w-full py-4 bg-white text-[#1a4a2a] font-bold uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                            >
                                <Share2 size={18} /> Partager mon Code VIP
                            </button>
                            
                            <p className="text-center text-[10px] text-green-200/50 mt-4">
                                {profile.referralsCount || 0} ami(s) parrainé(s) pour le moment.
                            </p>
                         </div>
                    </div>

                    <div className="bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-2xl space-y-6">
                        
                        {/* Explication Simple Utilisateur */}
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex gap-3 items-start">
                            <div className="bg-white/10 p-2 rounded-full text-white shrink-0">
                                <PremiumFingerprint size={16} />
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed mt-0.5">
                                Remplissez ce formulaire pour que MiamChef s'adapte automatiquement à vos goûts, vos allergies et votre matériel de cuisine lors de chaque recette.
                            </p>
                        </div>

                        {/* IDENTITY */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <User size={14} className="text-white" /> Votre Prénom
                            </label>
                            <input 
                                type="text" 
                                value={profile.name}
                                onChange={(e) => setProfile({...profile, name: e.target.value})}
                                className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-white/30 outline-none transition-colors"
                                placeholder="Comment doit-on vous appeler ?"
                            />
                        </div>

                        {/* DIET */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <Leaf size={14} className="text-green-400" /> Régime Alimentaire
                            </label>
                            <div className="relative">
                                <select 
                                    value={profile.diet}
                                    onChange={(e) => setProfile({...profile, diet: e.target.value})}
                                    className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-green-500/30 outline-none appearance-none"
                                >
                                    {dietOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* ALLERGIES */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <AlertTriangle size={14} className="text-red-400" /> Allergies & Interdits
                            </label>
                            <textarea 
                                value={profile.allergies}
                                onChange={(e) => setProfile({...profile, allergies: e.target.value})}
                                className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-red-500/30 outline-none transition-colors h-20 resize-none text-sm"
                                placeholder="Ex: Arachides, Crustacés, Porc..."
                            />
                            <p className="text-[10px] text-gray-500 mt-1 ml-1">Ces ingrédients seront exclus de toutes les suggestions.</p>
                        </div>

                        {/* DISLIKES */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <ThumbsDown size={14} className="text-orange-400" /> Je n'aime pas
                            </label>
                            <textarea 
                                value={profile.dislikes}
                                onChange={(e) => setProfile({...profile, dislikes: e.target.value})}
                                className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-orange-500/30 outline-none transition-colors h-20 resize-none text-sm"
                                placeholder="Ex: Coriandre, Endives cuites, Cannelle..."
                            />
                        </div>

                        {/* EQUIPMENT */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <PenTool size={14} className="text-blue-400" /> Mon Matériel
                            </label>
                            <textarea 
                                value={profile.equipment}
                                onChange={(e) => setProfile({...profile, equipment: e.target.value})}
                                className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/30 outline-none transition-colors h-20 resize-none text-sm"
                                placeholder="Ex: J'ai un Thermomix, un Airfryer, mais pas de four..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* HOUSEHOLD */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    <Users size={14} className="text-purple-400" /> Foyer (Par défaut)
                                </label>
                                <input 
                                    type="number" 
                                    min="1"
                                    max="12"
                                    value={profile.householdSize}
                                    onChange={(e) => setProfile({...profile, householdSize: parseInt(e.target.value)})}
                                    className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-purple-500/30 outline-none transition-colors"
                                />
                            </div>

                            {/* LEVEL */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    <ChefHat size={14} className="text-yellow-400" /> Mon Niveau
                                </label>
                                <select 
                                    value={profile.cookingLevel}
                                    onChange={(e) => setProfile({...profile, cookingLevel: e.target.value as any})}
                                    className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-yellow-500/30 outline-none appearance-none"
                                >
                                    {levelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>

                        <button 
                            onClick={handleSave}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg ${isSaved ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                            {isSaved ? <><Check size={20}/> Enregistré</> : <><Save size={20}/> Sauvegarder</>}
                        </button>

                    </div>
                </div>
             </div>
        </div>
    );
};

export default Profile;
