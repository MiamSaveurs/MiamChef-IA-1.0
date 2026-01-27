
import React, { useState } from 'react';
import { 
    PremiumTimer, 
    PremiumChefHat, 
    PremiumPlay, 
    PremiumPause, 
    PremiumRotateCcw, 
    PremiumPlus, 
    PremiumMinus, 
    PremiumFlame, 
    PremiumDroplet, 
    PremiumEgg, 
    PremiumBeef, 
    PremiumWheat 
} from './Icons';

// Updated TimerPreset to allow passing the style prop to icons.
interface TimerPreset {
    label: string;
    time: number;
    icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
    color: string;
}

const PRESETS: TimerPreset[] = [
    { label: "Oeuf à la coque", time: 180, icon: PremiumEgg, color: "text-yellow-500" },
    { label: "Oeuf Mollet", time: 360, icon: PremiumEgg, color: "text-orange-500" },
    { label: "Oeuf Dur", time: 540, icon: PremiumEgg, color: "text-red-500" },
    { label: "Pâtes Al Dente", time: 480, icon: PremiumWheat, color: "text-yellow-600" },
    { label: "Riz Blanc", time: 660, icon: PremiumWheat, color: "text-gray-600" },
    { label: "Légumes Vapeur", time: 900, icon: PremiumDroplet, color: "text-blue-400" },
    { label: "Steak Saignant", time: 150, icon: PremiumBeef, color: "text-red-600" },
    { label: "Steak À point", time: 240, icon: PremiumBeef, color: "text-amber-700" },
];

interface SmartTimerProps {
    timeLeft: number;
    isActive: boolean;
    initialTime: number;
    onStart: (seconds: number) => void;
    onToggle: () => void;
    onReset: () => void;
    onAdd: (seconds: number) => void;
}

const SmartTimer: React.FC<SmartTimerProps> = ({ 
    timeLeft, 
    isActive, 
    initialTime, 
    onStart, 
    onToggle, 
    onReset, 
    onAdd 
}) => {
    const [customMinutes, setCustomMinutes] = useState(1);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCustomStart = () => {
        onStart(customMinutes * 60);
    };

    const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
    const dashOffset = 283 - (283 * progress) / 100;

    return (
        <div className="pb-32 px-4 pt-6 max-w-3xl mx-auto min-h-screen font-body animate-fade-in bg-[#f9fafb]">
            <header className="mb-8 flex items-center gap-3">
                <div className="p-3 bg-teal-50 rounded-2xl">
                    <PremiumTimer size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-display text-chef-dark leading-none">Chrono Cuisine</h2>
                    <p className="text-gray-500 text-sm font-bold tracking-wide">Minuteur Tactile</p>
                </div>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-card border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
                    
                    <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                        <svg className="absolute w-full h-full transform -rotate-90 p-4">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                stroke="#f3f4f6"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray="283"
                                strokeDashoffset={dashOffset} 
                                strokeLinecap="round"
                                className={`text-chef-green transition-all duration-1000 ease-linear ${timeLeft === 0 && initialTime > 0 ? 'text-red-500 animate-pulse' : ''}`}
                            />
                        </svg>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-display text-chef-dark tracking-wider">
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">
                                {isActive ? 'Cuisson en cours' : (timeLeft > 0 && initialTime > 0) ? 'En pause' : 'Prêt'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button 
                            onClick={onReset}
                            className="w-14 h-14 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            title="Réinitialiser"
                        >
                            <PremiumRotateCcw size={24} />
                        </button>
                        
                        <button 
                            onClick={onToggle}
                            disabled={timeLeft === 0 && initialTime === 0}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all ${isActive ? 'bg-orange-500 text-white shadow-orange-200' : 'bg-chef-green text-white shadow-green-200'}`}
                            title={isActive ? "Pause" : "Démarrer"}
                        >
                            {isActive ? <PremiumPause size={32} className="text-white" /> : <PremiumPlay size={32} className="text-white ml-1" />}
                        </button>

                         <div className="flex flex-col items-center gap-2">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Ajouter</span>
                             <div className="flex flex-col gap-2">
                                <button onClick={() => onAdd(30)} className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-600 transition-colors">+30s</button>
                                <button onClick={() => onAdd(60)} className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-[10px] font-bold text-gray-600 transition-colors">+1m</button>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="space-y-6">
                    
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <h3 className="font-bold text-chef-dark mb-4 flex items-center gap-2">
                            <PremiumChefHat size={22} /> Minuteur Libre
                        </h3>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setCustomMinutes(Math.max(1, customMinutes - 1))}
                                className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold border border-gray-200"
                            >
                                <PremiumMinus size={20} />
                            </button>
                            <div className="flex-1 text-center">
                                <span className="text-3xl font-display text-chef-dark">{customMinutes}</span>
                                <span className="text-sm text-gray-500 ml-1 font-bold">min</span>
                            </div>
                            <button 
                                onClick={() => setCustomMinutes(Math.min(120, customMinutes + 1))}
                                className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold border border-gray-200"
                            >
                                <PremiumPlus size={20} />
                            </button>
                            <button 
                                onClick={handleCustomStart}
                                className="px-6 py-3 bg-chef-green text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all"
                            >
                                Go
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <h3 className="font-bold text-chef-dark mb-4 flex items-center gap-2">
                            <PremiumFlame size={18} /> Cuissons Parfaites
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {PRESETS.map((preset, idx) => {
                                const Icon = preset.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => onStart(preset.time)}
                                        className="bg-gray-50 hover:bg-gray-100 p-3 rounded-xl text-left flex items-center gap-3 transition-colors group border border-transparent hover:border-gray-200"
                                    >
                                        <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-gray-700 leading-tight">{preset.label}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{formatTime(preset.time)}</div>
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
