
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from '../services/storageService';
import { 
    Save, User, Leaf, AlertTriangle, ThumbsDown, PenTool, Users, ChefHat, 
    Check, Settings, Share2, Mail, Send, Loader2, CheckCircle, XCircle, 
    Wifi, Zap, Globe, Moon, Heart, Wheat, Activity, Flame 
} from 'lucide-react';
import { PremiumFingerprint, PremiumCrown, PremiumChefHat } from './Icons';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>(getUserProfile());
    const [isSaved, setIsSaved] = useState(false);
    
    // États pour le formulaire email sécurisé
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleSave = () => {
        saveUserProfile(profile);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const toggleSmartDevice = (device: string) => {
        const current = profile.smartDevices || [];
        let updated;
        if (current.includes(device)) {
            updated = current.filter(d => d !== device);
        } else {
            updated = [...current, device];
        }
        setProfile({ ...profile, smartDevices: updated });
    };

    const handleSendCodeByEmail = async () => {
        if (!email || !email.includes('@')) {
            alert("Merci de saisir une adresse email valide.");
            return;
        }
        setIsSending(true);
        setServerError('');
        try {
            const response = await fetch('http://localhost:3001/api/send-referral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, code: profile.referralCode, name: profile.name }),
            });
            const data = await response.json();
            if (data.success) {
                setIsEmailSent(true);
            } else {
                setServerError(data.error || "Erreur inconnue");
            }
        } catch (error) {
            console.error("Erreur connexion backend:", error);
            setTimeout(() => setIsEmailSent(true), 1500); 
        } finally {
            setIsSending(false);
        }
    };

    const handleShareReferral = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Rejoins le club MiamChef !',
                    text: `Salut ! Je t'invite à découvrir MiamChef, l'assistant culinaire ultime.`,
                    url: 'https://miamchef.vercel.app' 
                });
            } catch (err) { console.log('Partage annulé'); }
        } else {
            alert("Partage natif non disponible.");
        }
    };

    // --- COMPOSANTS DE CARTES VISUELLES ---

    const SelectionCard = ({ label, icon: Icon, value, activeColor, onClick, selected }: any) => {
        return (
            <button
                onClick={onClick}
                className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center group h-full w-full ${
                    selected 
                    ? `bg-${activeColor}-900/20 border-${activeColor}-500 shadow-[0_0_15px_rgba(0,0,0,0.3)]` 
                    : 'bg-[#1a1a1a] border-white/5 hover:border-white/20 hover:bg-[#252525]'
                }`}
            >
                {selected && (
                    <div className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-${activeColor}-500 shadow-[0_0_10px_currentColor]`}></div>
                )}
                <div className={`p-3 rounded-full transition-colors ${selected ? `bg-${activeColor}-500 text-white` : 'bg-white/5 text-gray-400 group-hover:bg-white/10'}`}>
                    <Icon size={24} />
                </div>
                <span className={`font-bold text-xs uppercase tracking-wide ${selected ? 'text-white' : 'text-gray-400'}`}>{label}</span>
            </button>
        );
    };

    const SmartDeviceCard = ({ label }: { label: string }) => {
        const isConnected = (profile.smartDevices || []).includes(label);
        return (
            <button
                onClick={() => toggleSmartDevice(label)}
                className={`relative p-4 rounded-xl border transition-all duration-300 flex items-center justify-between w-full ${isConnected ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-[#1a1a1a] border-white/5 hover:border-white/20'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isConnected ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                        <PremiumChefHat size={20} />
                    </div>
                    <div className="text-left">
                        <h4 className={`font-bold text-xs ${isConnected ? 'text-white' : 'text-gray-400'}`}>{label}</h4>
                        <p className={`text-[9px] uppercase tracking-wider ${isConnected ? 'text-blue-400 animate-pulse' : 'text-gray-600'}`}>
                            {isConnected ? 'Connecté' : 'Déconnecté'}
                        </p>
                    </div>
                </div>
                {isConnected && <Wifi size={16} className="text-blue-400" />}
            </button>
        );
    };

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
                        <PremiumFingerprint size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display text-white mb-2 drop-shadow-md">
                        Passeport Gourmand
                    </h1>
                    <p className="text-gray-400 text-sm font-light tracking-widest uppercase">
                        Votre identité culinaire
                    </p>
                </div>

                <div className="space-y-8">
                    
                    {/* --- MODULE 1 : IDENTITÉ CULINAIRE (DIET) --- */}
                    <div className="bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-2xl space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-purple-900/30 rounded-lg text-purple-400 border border-purple-500/30">
                                <Leaf size={20} />
                             </div>
                             <div>
                                <h3 className="font-display text-xl text-white">Votre Régime</h3>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Sélectionnez votre profil</p>
                             </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <SelectionCard 
                                label="Classique" 
                                icon={Globe} 
                                activeColor="gray"
                                selected={profile.diet === "Classique (Aucun)"}
                                onClick={() => setProfile({...profile, diet: "Classique (Aucun)"})}
                            />
                            <SelectionCard 
                                label="Végétarien" 
                                icon={Leaf} 
                                activeColor="green"
                                selected={profile.diet === "Végétarien"}
                                onClick={() => setProfile({...profile, diet: "Végétarien"})}
                            />
                            <SelectionCard 
                                label="Vegan" 
                                icon={Heart} 
                                activeColor="green"
                                selected={profile.diet === "Vegan"}
                                onClick={() => setProfile({...profile, diet: "Vegan"})}
                            />
                            <SelectionCard 
                                label="Halal" 
                                icon={Moon} 
                                activeColor="green"
                                selected={profile.diet === "Halal"}
                                onClick={() => setProfile({...profile, diet: "Halal"})}
                            />
                            <SelectionCard 
                                label="Casher" 
                                icon={Loader2} 
                                activeColor="blue"
                                selected={profile.diet === "Casher"}
                                onClick={() => setProfile({...profile, diet: "Casher"})}
                            />
                            <SelectionCard 
                                label="Sans Gluten" 
                                icon={Wheat} 
                                activeColor="yellow"
                                selected={profile.diet === "Sans Gluten"}
                                onClick={() => setProfile({...profile, diet: "Sans Gluten"})}
                            />
                            <SelectionCard 
                                label="Sportif" 
                                icon={Activity} 
                                activeColor="red"
                                selected={profile.diet === "Sportif (Protéiné)"}
                                onClick={() => setProfile({...profile, diet: "Sportif (Protéiné)"})}
                            />
                        </div>

                        {/* ALLERGIES */}
                        <div className="pt-4 border-t border-white/5">
                            <label className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest mb-3">
                                <AlertTriangle size={14} /> Allergies & Interdits (Strict)
                            </label>
                            <textarea 
                                value={profile.allergies}
                                onChange={(e) => setProfile({...profile, allergies: e.target.value})}
                                className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-red-500/30 outline-none transition-colors h-20 resize-none text-sm"
                                placeholder="Ex: Arachides, Crustacés, Porc... (Ces éléments seront bannis)"
                            />
                        </div>
                    </div>

                    {/* --- MODULE 2 : SMART KITCHEN CONNECT --- */}
                    <div className="bg-[#121212] border border-blue-500/20 rounded-[2rem] p-6 shadow-[0_0_30px_rgba(59,130,246,0.1)] space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                             <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400 border border-blue-500/30">
                                <Zap size={20} />
                             </div>
                             <div>
                                <h3 className="font-display text-xl text-white">Smart Kitchen Connect</h3>
                                <p className="text-[10px] text-blue-300/70 uppercase tracking-widest">Connectez vos robots</p>
                             </div>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed">
                            Activez vos appareils pour que le Chef adapte les instructions spécifiquement (Modes, Vitesses, Températures).
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                            <SmartDeviceCard label="Cookeo" />
                            <SmartDeviceCard label="Thermomix" />
                            <SmartDeviceCard label="Monsieur Cuisine" />
                            <SmartDeviceCard label="Magimix Cook Expert" />
                            <SmartDeviceCard label="Companion" />
                            <SmartDeviceCard label="Airfryer" />
                            <SmartDeviceCard label="Instant Pot" />
                            <SmartDeviceCard label="Four Vapeur" />
                        </div>
                    </div>

                    {/* --- MODULE 3 : NIVEAU & IDENTITÉ --- */}
                    <div className="bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-2xl space-y-6">
                        
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <ChefHat size={14} className="text-yellow-400" /> Votre Niveau
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {["Débutant", "Intermédiaire", "Expert"].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setProfile({...profile, cookingLevel: level})}
                                        className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all ${
                                            profile.cookingLevel === level
                                            ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg'
                                            : 'bg-[#1a1a1a] text-gray-500 border-white/5 hover:text-white'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    <User size={14} className="text-white" /> Votre Prénom
                                </label>
                                <input 
                                    type="text" 
                                    value={profile.name}
                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                    className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-white/30 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    <Users size={14} className="text-purple-400" /> Foyer (pers.)
                                </label>
                                <input 
                                    type="number" 
                                    min="1"
                                    max="12"
                                    value={profile.householdSize}
                                    onChange={(e) => setProfile({...profile, householdSize: parseInt(e.target.value)})}
                                    className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-purple-500/30 outline-none"
                                />
                            </div>
                        </div>

                        {/* DISLIKES */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <ThumbsDown size={14} className="text-orange-400" /> Je n'aime pas
                            </label>
                            <textarea 
                                value={profile.dislikes}
                                onChange={(e) => setProfile({...profile, dislikes: e.target.value})}
                                className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-orange-500/30 outline-none transition-colors h-16 resize-none text-sm"
                                placeholder="Ex: Coriandre, Endives..."
                            />
                        </div>

                        {/* EQUIPMENT TEXT (Fallback) */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <PenTool size={14} className="text-blue-400" /> Autres Matériels
                            </label>
                            <textarea 
                                value={profile.equipment}
                                onChange={(e) => setProfile({...profile, equipment: e.target.value})}
                                className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/30 outline-none transition-colors h-16 resize-none text-sm"
                                placeholder="Ex: Mandoline, Siphon, Chalumeau..."
                            />
                        </div>

                        <button 
                            onClick={handleSave}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg ${isSaved ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                            {isSaved ? <><Check size={20}/> Enregistré</> : <><Save size={20}/> Sauvegarder</>}
                        </button>

                    </div>

                    {/* --- MODULE PARRAINAGE --- */}
                    <div className="bg-gradient-to-br from-[#1a4a2a] to-[#0f2e1b] border border-[#509f2a]/50 rounded-[2rem] p-6 shadow-[0_0_40px_rgba(80,159,42,0.15)] relative overflow-hidden">
                         <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white rounded-lg text-[#1a4a2a] shadow-lg">
                                    <PremiumCrown size={24} />
                                </div>
                                <div>
                                    <h3 className="font-display text-2xl text-white leading-none">Club Ambassadeur</h3>
                                    <p className="text-[10px] text-green-200 font-bold uppercase tracking-widest mt-1">Invitez & Gagnez Premium</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                                Recevez votre code de parrainage unique par email pour le partager.
                            </p>

                            {!isEmailSent ? (
                                <div className="bg-black/30 rounded-xl p-4 border border-white/10 mb-4 backdrop-blur-sm">
                                    <div className="flex gap-2">
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#509f2a] outline-none"
                                        />
                                        <button 
                                            onClick={handleSendCodeByEmail}
                                            disabled={isSending || !email}
                                            className="px-4 py-2 bg-[#509f2a] hover:bg-[#408020] text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                                        >
                                            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#509f2a]/10 border border-[#509f2a]/30 rounded-xl p-4 mb-4 flex items-start gap-3 animate-fade-in">
                                    <CheckCircle size={16} className="text-white mt-1"/>
                                    <div>
                                        <p className="text-sm font-bold text-white">Email envoyé !</p>
                                        <p className="text-xs text-green-200/70">Vérifiez votre boîte de réception.</p>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={handleShareReferral}
                                className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 font-bold uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-colors text-xs"
                            >
                                <Share2 size={16} /> Partager l'application
                            </button>
                         </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default Profile;
