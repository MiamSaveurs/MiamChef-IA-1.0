
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from '../services/storageService';
import { t } from '../services/translationService'; // Import translation
import { Save, User, Leaf, AlertTriangle, ThumbsDown, PenTool, Users, ChefHat, Check, Settings, Wifi, Zap } from 'lucide-react';
import { PremiumFingerprint } from './Icons';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>(getUserProfile());
    const [isSaved, setIsSaved] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const handleSave = () => {
        saveUserProfile(profile);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleIoTScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            alert("Aucun appareil compatible détecté à proximité. (Simulation Bêta)");
        }, 3000);
    };

    const dietOptions = [
        t('diet_classic'),
        t('diet_veg'),
        t('diet_vegan'),
        t('diet_halal'),
        t('diet_kosher'),
        t('diet_gluten'),
        t('diet_lactose'),
        t('diet_keto'),
        t('diet_sport')
    ];

    const levelOptions = [
        t('level_beginner'),
        t('level_intermediate'),
        t('level_expert')
    ];

    return (
        <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
             <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-black"></div>
             </div>

             <div className="relative z-10 max-w-2xl mx-auto px-6 pt-10">
                
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-4 border border-white/10">
                        <Settings size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display text-white mb-2 drop-shadow-md">
                        {t('pr_title')}
                    </h1>
                    <p className="text-gray-400 text-sm font-light tracking-widest uppercase">
                        {t('pr_sub')}
                    </p>
                </div>

                <div className="bg-[#121212] border border-white/10 rounded-[2rem] p-6 shadow-2xl space-y-6">
                    
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex gap-3 items-start">
                        <div className="bg-white/10 p-2 rounded-full text-white shrink-0">
                            <PremiumFingerprint size={16} />
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed mt-0.5">
                            {t('pr_intro')}
                        </p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <User size={14} className="text-white" /> {t('pr_name')}
                        </label>
                        <input 
                            type="text" 
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-white/30 outline-none transition-colors"
                            placeholder={t('pr_name_ph')}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <Leaf size={14} className="text-green-400" /> {t('pr_diet')}
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

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <AlertTriangle size={14} className="text-red-400" /> {t('pr_allergies')}
                        </label>
                        <textarea 
                            value={profile.allergies}
                            onChange={(e) => setProfile({...profile, allergies: e.target.value})}
                            className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-red-500/30 outline-none transition-colors h-20 resize-none text-sm"
                            placeholder={t('pr_allergies_ph')}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <ThumbsDown size={14} className="text-orange-400" /> {t('pr_dislikes')}
                        </label>
                        <textarea 
                            value={profile.dislikes}
                            onChange={(e) => setProfile({...profile, dislikes: e.target.value})}
                            className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-orange-500/30 outline-none transition-colors h-20 resize-none text-sm"
                            placeholder={t('pr_dislikes_ph')}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                            <PenTool size={14} className="text-blue-400" /> {t('pr_equipment')}
                        </label>
                        <textarea 
                            value={profile.equipment}
                            onChange={(e) => setProfile({...profile, equipment: e.target.value})}
                            className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500/30 outline-none transition-colors h-20 resize-none text-sm"
                            placeholder={t('pr_equipment_ph')}
                        />
                    </div>

                    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-xl border border-blue-500/30">
                        <label className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">
                            <Wifi size={14} /> {t('pr_iot_title')}
                        </label>
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-blue-200/70 max-w-[200px]">
                                {t('pr_iot_desc')}
                            </p>
                            <button 
                                onClick={handleIoTScan}
                                disabled={isScanning}
                                className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                            >
                                {isScanning ? <Zap size={14} className="animate-pulse" /> : <Wifi size={14} />}
                                {isScanning ? "..." : t('pr_iot_btn')}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <Users size={14} className="text-purple-400" /> {t('pr_household')}
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

                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <ChefHat size={14} className="text-yellow-400" /> {t('pr_level')}
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
                        {isSaved ? <><Check size={20}/> {t('saved')}</> : <><Save size={20}/> {t('pr_btn_save')}</>}
                    </button>

                </div>
             </div>
        </div>
    );
};

export default Profile;
