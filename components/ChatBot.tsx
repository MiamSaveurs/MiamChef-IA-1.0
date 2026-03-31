
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, ChefHat, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { chatWithChef } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // Format history for Gemini
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const response = await chatWithChef(userMessage, history);
            setMessages(prev => [...prev, { role: 'model', text: response }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Désolé, je rencontre une petite difficulté technique. Pouvez-vous répéter ?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-[500] font-body">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 bg-chef-green/10 border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-chef-green flex items-center justify-center shadow-lg shadow-chef-green/20">
                                    <ChefHat size={20} className="text-black" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white leading-none">MiamChef Assistant</h3>
                                    <span className="text-[10px] text-chef-green font-medium uppercase tracking-wider">VOTRE ASSISTANT CULINAIRE</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Safety Banner */}
                        <div className="px-4 py-2 bg-zinc-800/50 flex items-center gap-2 border-b border-zinc-800">
                            <ShieldCheck size={12} className="text-chef-green" />
                            <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest">Sécurité Alimentaire Garantie</span>
                        </div>

                        {/* Messages */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700"
                        >
                            {messages.length === 0 && (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                                        <ChefHat size={32} className="text-zinc-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-zinc-300 text-sm font-medium">Bonjour ! Je suis votre assistant MiamChef.</p>
                                        <p className="text-zinc-500 text-xs px-8">Posez-moi vos questions de cuisine, demandez des conseils de débutant ou de l'aide en cas de raté !</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 px-4">
                                        <button 
                                            onClick={() => setInput("C'est quoi 'ciseler' ?")}
                                            className="text-[10px] text-left p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700/50 text-zinc-400 transition-all"
                                        >
                                            💡 C'est quoi "ciseler" ?
                                        </button>
                                        <button 
                                            onClick={() => setInput("Ma sauce est trop salée, au secours !")}
                                            className="text-[10px] text-left p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700/50 text-zinc-400 transition-all"
                                        >
                                            🆘 Ma sauce est trop salée !
                                        </button>
                                        <button 
                                            onClick={() => setInput("Comment bien conserver mes légumes ?")}
                                            className="text-[10px] text-left p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700/50 text-zinc-400 transition-all"
                                        >
                                            🛡️ Conseils de conservation
                                        </button>
                                    </div>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-chef-green text-black font-medium rounded-tr-none' 
                                            : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700/50'
                                    }`}>
                                        <div className="prose prose-invert prose-xs max-w-none">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none border border-zinc-700/50">
                                        <Loader2 size={16} className="animate-spin text-chef-green" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-zinc-900 border-t border-zinc-800">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Posez votre question au Chef..."
                                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-chef-green/50 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="p-3 bg-chef-green text-black rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-chef-green/20"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                    isOpen ? 'bg-zinc-800 text-white rotate-90' : 'bg-chef-green text-black'
                }`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};

export default ChatBot;
