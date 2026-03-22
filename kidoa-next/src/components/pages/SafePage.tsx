import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import { KidoaAI } from "../../services/ai_service";

export default function SafePage({ lastKnownCoords }: { lastKnownCoords: string }) {
    const { playSound } = useAppContext();
    const [safetyLocations, setSafetyLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSafety() {
            setLoading(true);
            try {
                const res = await KidoaAI.getNearbySafety(lastKnownCoords || "41.6520, -4.7286");
                if (res && Array.isArray(res)) {
                    setSafetyLocations(res);
                }
            } catch (e) {
                console.error("Error loading safety info:", e);
            } finally {
                setLoading(false);
            }
        }
        loadSafety();
    }, [lastKnownCoords]);

    const [sosActive, setSosActive] = useState(false);

    return (
        <div className="p-8 pb-32 h-full overflow-y-auto bg-amber-50/50">
            <AnimatePresence>
                {sosActive && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[5000] bg-red-600 flex flex-col items-center justify-center p-8 text-white text-center"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }}
                            className="text-9xl mb-8"
                        >
                            🚨
                        </motion.div>
                        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">ALERTA SOS ACTIVA</h2>
                        <p className="text-xl font-bold mb-12 opacity-90">Tu tribu ha sido notificada. Mantén la calma, la ayuda está en camino.</p>
                        <button 
                            onClick={() => { playSound('click'); setSosActive(false); }}
                            className="bg-white text-red-600 font-black px-12 py-5 rounded-3xl text-xl shadow-2xl active:scale-95 transition-all"
                        >
                            CANCELAR ALERTA
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-amber-900 tracking-tight text-center">SAFE ZONE</h1>
                <p className="text-amber-700/70 mt-1 text-center font-medium">Tranquilidad en tus aventuras</p>
            </header>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] p-8 shadow-xl mb-8 border border-amber-100 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
                
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-5xl mb-6 mx-auto shadow-inner border border-red-100">
                    🛡️
                </div>
                
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Botón SOS Familiar</h2>
                <p className="text-center text-slate-500 text-sm mb-8 px-4">
                    Avisa instantáneamente a tu tribu de confianza si ocurre una emergencia o si un explorador se extravía.
                </p>
                
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { playSound('error'); setSosActive(true); }}
                    className="w-full py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-[24px] font-black text-xl shadow-[0_10px_30px_rgba(239,68,68,0.4)] flex justify-center items-center gap-3 relative overflow-hidden border-b-4 border-red-700"
                >
                    <span className="relative z-10">🚨 ACTIVAR ALERTA SOS</span>
                    <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-150%]"
                    />
                </motion.button>
            </motion.div>

            <h3 className="text-sm font-bold text-amber-800 mb-4 px-2 uppercase tracking-widest">Ayuda Cercana (IA)</h3>
            <div className="space-y-4">
                {loading ? (
                    [1, 2].map(i => (
                        <div key={i} className="bg-white rounded-[24px] p-5 animate-pulse flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))
                ) : safetyLocations.map((loc, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ x: 5 }}
                        className="bg-white rounded-[24px] p-5 shadow-sm border border-amber-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => playSound('click')}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${loc.type === 'hospital' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {loc.type === 'hospital' ? '🏥' : '👮'}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800 truncate">{loc.name}</h3>
                            <p className="text-xs text-slate-500 font-medium truncate">{loc.address} • {loc.distance || 'Cerca'}</p>
                        </div>
                        <span className={`font-bold text-[10px] px-3 py-1 rounded-full ${loc.status === 'Abierto 24h' ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 bg-slate-50'}`}>
                            {loc.status}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
