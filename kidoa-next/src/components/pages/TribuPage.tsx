"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DataService } from "../../services/data_service";
import { KidoaAI } from "../../services/ai_service";
import { useAppContext } from "../../context/AppContext";

export default function TribuPage() {
    const { user, playSound } = useAppContext();
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<any[]>([
        { role: 'ai', text: '¡Hola! Soy parte de la Tribu Kidoa. ¿En qué podemos ayudarte hoy?' }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadRankings() {
            const data = await DataService.getRankings();
            setRankings(data);
            setLoading(false);
        }
        loadRankings();
    }, []);

    useEffect(() => {
        if (showChat) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, showChat]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);
        playSound('click');

        try {
            const res = await KidoaAI.tribeChat(userMsg, user || { nickname: 'Explorador', level: 1 });
            if (res && res.message) {
                setMessages(prev => [...prev, { 
                    role: 'ai', 
                    text: res.message, 
                    persona: res.persona, 
                    avatar: res.avatar 
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: typeof res === 'string' ? res : 'Vaya, parece que la Tribu está un poco ocupada ahora. Inténtalo de nuevo.' }]);
            }
            playSound('success');
        } catch (e) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Vaya, parece que la Tribu está un poco ocupada ahora. Inténtalo de nuevo.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="p-8 pb-32 h-full overflow-y-auto bg-slate-50">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">LA TRIBU</h1>
                <p className="text-slate-500 mt-1 font-medium">Comparte y descubre con otras familias</p>
            </header>
            
            <div className="bg-white rounded-[32px] p-6 shadow-medium mb-6 border border-blue-50">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex justify-between items-center">
                    <span>🏆 Top Exploradores</span>
                    <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full font-bold">Esta Semana</span>
                </h3>
                
                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl animate-pulse">
                                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                <div className="flex-1 h-4 bg-slate-200 rounded"></div>
                            </div>
                        ))
                    ) : rankings.map((u, idx) => (
                        <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                            <span className={`font-black text-lg w-6 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-slate-300'}`}>#{idx + 1}</span>
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xl">{u.avatar || "🏃"}</div>
                            <div className="flex-1 font-bold text-slate-700">{u.nickname}</div>
                            <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-xs">⭐ {u.points}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button 
                onClick={() => { setShowChat(true); playSound('click'); }}
                className="w-full bg-blue-900 text-white font-black py-5 rounded-[24px] shadow-xl shadow-blue-900/20 active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
            >
                💬 Abrir Chat de la Tribu
            </button>

            {/* Chat Modal */}
            <AnimatePresence>
                {showChat && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-end sm:items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="bg-white w-full max-w-lg h-[80vh] sm:h-[600px] rounded-t-[40px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
                        >
                            <header className="p-6 border-b flex justify-between items-center bg-blue-900 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl">🤝</div>
                                    <div>
                                        <h2 className="font-black text-lg leading-none">Chat de la Tribu</h2>
                                        <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">IA Conectada</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowChat(false)} className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-xl">✕</button>
                            </header>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        {m.role === 'ai' && m.persona && (
                                            <span className="text-[10px] font-black text-slate-400 uppercase mb-1 ml-4 tracking-widest flex items-center gap-1">
                                                <span>{m.avatar || '🤖'}</span> {m.persona}
                                            </span>
                                        )}
                                        <div className={`max-w-[85%] p-4 rounded-[24px] text-sm font-medium shadow-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'}`}>
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-4 rounded-[24px] rounded-bl-none border border-slate-100 shadow-sm flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-6 bg-white border-t">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" value={input} onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Pregunta algo a la tribu..."
                                        className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button 
                                        onClick={handleSend}
                                        className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50"
                                        disabled={isTyping}
                                    >
                                        <span className="text-xl">✈️</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
