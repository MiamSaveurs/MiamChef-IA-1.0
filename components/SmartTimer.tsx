
import React, { useState } from 'react';
import { Timer, Play, Pause, RotateCcw, Plus, Minus, ChefHat, Flame, Droplet, Egg, Beef, Wheat } from 'lucide-react';

const PRESETS = [
    { label: "Oeuf à la coque", time: 180, icon: Egg, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Oeuf Mollet", time: 360, icon: Egg, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Oeuf Dur", time: 540, icon: Egg, color: "text-red-500", bg: "bg-red-50" },
    { label: "Pâtes Al Dente", time: 480, icon: Wheat, color: "text-yellow-600", bg: "bg-yellow-100" },
    { label: "Riz Blanc", time: 660, icon: Wheat, color: "text-gray-600", bg: "bg-gray-100" },
    { label: "Légumes Vapeur", time: 900, icon: Droplet, color: "text-green-500", bg: "bg-green-50" },
    { label: "Steak Saignant", time: 150, icon: Beef, color: "text-red-600", bg: "bg-red-100" },
    { label: "Steak À point", time: 240, icon: Beef, color: "text-amber-700", bg: "bg-amber-100" },
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

    // Calculate progress for circle
    const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
    const dashOffset = 283 - (283 * progress) / 100; // 2 * PI * 45 (radius) ~= 283

    return (
        <div className="pb-32 px-4 pt-6 max-w-3xl mx-auto min-h-screen font-body animate-fade-in">
            <header className="mb-8 flex items-center gap-3">
                <div className="p-3 bg-teal-50 rounded-2xl">
                    <Timer className="text-teal-600" size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-display text-chef-dark leading-none">Chrono Chef</h2>
                    <p className="text-gray-500 text-sm font-body">Minuteur intelligent de cuisine</p>
                </div>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                {/* TIMER VISUALIZATION */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-card border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
                    
                    {/* Circle SVG */}
                    <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                         {/* Background Circle */}
                        <svg className="absolute w-full h-full transform -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray="283"
                                strokeDashoffset={dashOffset} 
                                strokeLinecap="round"
                                className={`text-chef-green transition-all duration-1000 ease-linear ${timeLeft === 0 && initialTime > 0 ? 'text-red-500 animate-pulse' : ''}`}
                            />
                        </svg>
                        
                        {/* Time Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-display text-chef-dark tracking-wider">
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">
                                {isActive ? 'Cuisson en cours' : (timeLeft > 0 && initialTime > 0) ? 'En pause' : 'Prêt'}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={onReset}
                            className="p-4 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                            title="Réinitialiser"
                        >
                            <RotateCcw size={24} />
                        </button>
                        
                        <button 
                            onClick={onToggle}
                            disabled={timeLeft === 0 && initialTime === 0}
                            className={`p-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-white ${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-chef-green hover:bg-green-600'}`}
                            title={isActive ? "Pause" : "Démarrer"}
                        >
                            {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
                        </button>

                         <div className="flex flex-col items-center gap-1">
                             <span className="text-[10px] font-bold text-gray-400 uppercase">Ajouter</span>
                             <div className="flex gap-2">
                                <button onClick={() => onAdd(30)} className="p-2 bg-gray-100 rounded-lg text-xs font-bold hover:bg-gray-200">+30s</button>
                                <button onClick={() => onAdd(60)} className="p-2 bg-gray-100 rounded-lg text-xs font-bold hover:bg-gray-200">+1m</button>
                             </div>
                         </div>
                    </div>
                </div>

                {/* PRESETS & CUSTOM */}
                <div className="space-y-6">
                    
                    {/* Custom Input */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-chef-dark mb-4 flex items-center gap-2">
                            <ChefHat size={18} className="text-chef-green"/> Minuteur Libre
                        </h3>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setCustomMinutes(Math.max(1, customMinutes - 1))}
                                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <Minus size={18} />
                            </button>
                            <div className="flex-1 text-center">
                                <span className="text-3xl font-display text-chef-dark">{customMinutes}</span>
                                <span className="text-sm text-gray-500 ml-1">min</span>
                            </div>
                            <button 
                                onClick={() => setCustomMinutes(Math.min(120, customMinutes + 1))}
                                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                            <button 
                                onClick={handleCustomStart}
                                className="px-6 py-3 bg-chef-dark text-white rounded-xl font-bold hover:bg-black transition-colors"
                            >
                                Go
                            </button>
                        </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-chef-dark mb-4 flex items-center gap-2">
                            <Flame size={18} className="text-orange-500"/> Cuissons Parfaites
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {PRESETS.map((preset, idx) => {
                                const Icon = preset.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => onStart(preset.time)}
                                        className={`p-3 rounded-xl border border-transparent hover:border-gray-200 transition-all text-left flex items-center gap-3 ${preset.bg}`}
                                    >
                                        <div className={`p-2 bg-white rounded-lg shadow-sm ${preset.color}`}>
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-gray-800 leading-tight">{preset.label}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{formatTime(preset.time)}</div>
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
