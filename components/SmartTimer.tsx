
import React, { useState } from 'react';
import { t } from '../services/translationService'; // Import translation
import { 
    PremiumTimer, 
    PremiumPlay, 
    PremiumPause, 
    PremiumRotateCcw, 
    PremiumPlus, 
    PremiumMinus, 
    PremiumFlame, 
    PremiumEgg, 
    PremiumBeef, 
    PremiumWheat,
    PremiumDroplet
} from './Icons';

interface SmartTimerProps {
    timeLeft: number;
    initialTime: number;
    isActive: boolean;
    onStart: (seconds: number) => void;
    onToggle: () => void;
    onReset: () => void;
    onAdd: (seconds: number) => void;
}

const PRESETS = [
    { label: "Oeuf à la coque", time: 180, icon: PremiumEgg, color: "text-yellow-400" },
    { label: "Oeuf Mollet", time: 360, icon: PremiumEgg, color: "text-orange-400" },
    { label: "Oeuf Dur", time: 540, icon: PremiumEgg, color: "text-red-400" },
    { label: "Pâtes Al Dente", time: 480, icon: PremiumWheat, color: "text-amber-200" },
    { label: "Riz Blanc", time: 660, icon: PremiumWheat, color: "text-gray-300" },
    { label: "Légumes Vapeur", time: 900, icon: PremiumDroplet, color: "text-blue-400" },
    { label: "Steak Saignant", time: 150, icon: PremiumBeef, color: "text-red-500" },
    { label: "Steak À point", time: 240, icon: PremiumBeef, color: "text-amber-600" },
];

const SmartTimer: React.FC<SmartTimerProps> = ({ 
    timeLeft, 
    initialTime, 
    isActive, 
    onStart, 
    onToggle, 
    onReset, 
    onAdd 
}) => {
    const [customMinutes, setCustomMinutes] = useState(1);

    const themeColor = '#ef4444'; 
    const themeGradient = 'from-red-600 to-red-900';
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
    const dashOffset = 283 - (283 * progress) / 100;

    return (
        <div className="relative min-h-screen pb-32 bg-black text-white font-sans overflow-x-hidden">
             
             <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-30 fixed"
                  alt="Timer Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#200505]/80 to-black fixed"></div>
             </div>

             <div className="relative z-10 max-w-2xl mx-auto px-6 pt-10">
                
                <div className="text-center mb-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${themeGradient} shadow-[0_0_30px_rgba(239,68,68,0.3)] mb-4 border border-red-500/30`}>
                        <PremiumTimer size={32} className="text-red-100" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display text-red-500 mb-2 drop-shadow-md">
                        {t('st_title')}
                    </h1>
                    <p className="text-red-200/60 text-sm font-light tracking-widest uppercase">
                        {t('st_sub')}
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex flex-col items-center justify-center relative z-10">
                        
                        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                            <svg className="absolute w-full h-full transform -rotate-90 drop-shadow-lg">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="45%"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="6"
                                    fill="transparent"
                                />
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="45%"
                                    stroke={themeColor}
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray="283"
                                    strokeDashoffset={dashOffset} 
                                    strokeLinecap="round"
                                    className={`transition-all duration-1000 ease-linear ${timeLeft === 0 && initialTime > 0 ? 'animate-pulse' : ''}`}
                                />
                            </svg>
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-6xl font-display text-white tracking-widest drop-shadow-md tabular-nums">
                                    {formatTime(timeLeft)}
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-widest mt-2 ${isActive ? 'text-red-400 animate-pulse' : 'text-gray-500'}`}>
                                    {isActive ? t('st_cooking') : (timeLeft > 0 ? t('st_paused') : t('st_ready'))}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <button 
                                onClick={onReset}
                                className="w-12 h-12 rounded-full bg-white/10 text-gray-400 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all border border-white/5"
                            >
                                <PremiumRotateCcw size={20} />
                            </button>
                            
                            <button 
                                onClick={onToggle}
                                disabled={timeLeft === 0 && initialTime === 0}
                                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-105 transition-all border border-white/10 ${isActive ? 'bg-orange-600 text-white' : 'bg-gradient-to-br from-red-600 to-red-800 text-white'}`}
                            >
                                {isActive ? <PremiumPause size={32} className="fill-current" /> : <PremiumPlay size={32} className="ml-1 fill-current" />}
                            </button>

                             <div className="flex flex-col gap-2">
                                <button onClick={() => onAdd(30)} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-300 transition-colors border border-white/5">+30s</button>
                                <button onClick={() => onAdd(60)} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-300 transition-colors border border-white/5">+1m</button>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    
                    <div className="bg-[#121212] p-6 rounded-[2rem] shadow-lg border border-white/10">
                        <div className="flex items-center gap-3 mb-4 opacity-80">
                            <div className="p-2 bg-red-500/20 rounded-lg"><PremiumPlay size={16} className="text-red-400"/></div>
                            <h3 className="font-bold text-gray-200 text-sm uppercase tracking-wide">{t('st_manual')}</h3>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
                            <button 
                                onClick={() => setCustomMinutes(Math.max(1, customMinutes - 1))}
                                className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
                            >
                                <PremiumMinus size={20} />
                            </button>
                            <div className="flex-1 text-center">
                                <span className="text-3xl font-display text-white">{customMinutes}</span>
                                <span className="text-xs text-gray-500 ml-1 font-bold uppercase">min</span>
                            </div>
                            <button 
                                onClick={() => setCustomMinutes(Math.min(120, customMinutes + 1))}
                                className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
                            >
                                <PremiumPlus size={20} />
                            </button>
                            <button 
                                onClick={() => onStart(customMinutes * 60)}
                                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg transition-all text-sm tracking-wide uppercase"
                            >
                                Go
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#121212] p-6 rounded-[2rem] shadow-lg border border-white/10">
                        <div className="flex items-center gap-3 mb-4 opacity-80">
                            <div className="p-2 bg-red-500/20 rounded-lg"><PremiumFlame size={16} className="text-red-400"/></div>
                            <h3 className="font-bold text-gray-200 text-sm uppercase tracking-wide">{t('st_presets')}</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {PRESETS.map((preset, idx) => {
                                const Icon = preset.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => onStart(preset.time)}
                                        className="group bg-white/5 hover:bg-white/10 p-3 rounded-xl text-left flex items-center gap-3 transition-all border border-white/5 hover:border-red-500/30"
                                    >
                                        <div className={`p-2 rounded-lg bg-black/50 border border-white/5 group-hover:border-red-500/50 transition-colors`}>
                                            <Icon size={18} className={preset.color} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-xs text-gray-200 leading-tight group-hover:text-white">{preset.label}</div>
                                            <div className="text-[10px] text-gray-500 mt-0.5 font-medium">{Math.floor(preset.time / 60)} min</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

             </div>
        </div>
    );
};

export default SmartTimer;
