"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from '../../context/AppContext';
import { AuthService } from '../../services/auth_service';
import AuthModal from "../AuthModal";

export default function ProfilePage() {
    const { user, playSound } = useAppContext();
    const [showAuth, setShowAuth] = useState(false);
    
    if (!user) {
        return (
            <div className="p-8 h-[70vh] flex flex-col items-center justify-center bg-slate-50 text-center">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 bg-blue-100 rounded-[40px] flex items-center justify-center text-6xl mb-6 shadow-inner tracking-tighter"
                >
                    💤
                </motion.div>
                <h2 className="text-2xl font-black text-blue-900 mb-2">Tu perfil está durmiendo</h2>
                <p className="text-slate-500 font-medium mb-8 px-6">Identifícate para desbloquear insignias, niveles y planes personalizados.</p>
                <button 
                    onClick={() => { playSound('click'); setShowAuth(true); }}
                    className="bg-blue-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
                >
                    Entrar en Kidoa ✨
                </button>
                {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
            </div>
        );
    }

    const progress = (user.points % 100);

    return (
        <div className="p-8 pb-32 h-full overflow-y-auto bg-slate-50">
            <header className="mb-8 flex justify-between items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">MI PERFIL</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">¡Sigue explorando, {user.nickname}!</p>
                </motion.div>
                <button 
                    onClick={() => { playSound('click'); AuthService.logout(); }}
                    className="p-3 text-slate-400 hover:text-red-500 font-bold transition-all bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-red-100 active:scale-90"
                >
                    🚪
                </button>
            </header>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] p-8 shadow-xl mb-8 relative overflow-hidden border border-blue-50"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className="relative">
                        <div className="w-28 h-28 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-5xl shadow-[0_10px_40px_rgba(59,130,246,0.3)] border-8 border-white">
                            🧑‍🚀
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white w-10 h-10 rounded-full border-4 border-white flex items-center justify-center font-black text-xs shadow-md">
                            Lvl {user.level}
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-slate-800">{user.nickname}</h2>
                        <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">{user.email || "Invitado"}</span>
                    </div>

                    <div className="w-full mt-6 bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                    <div className="w-full flex justify-between mt-2 px-1">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">⭐ {user.points} Puntos</span>
                        <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">{100 - progress} para sig. nivel</span>
                    </div>
                </div>
            </motion.div>

            <h3 className="text-sm font-bold text-slate-400 mb-6 px-2 uppercase tracking-widest">Inventario Kidoa</h3>
            <div className="grid grid-cols-2 gap-4">
                {[
                    { icon: "🏅", title: "Insignia Semilla", active: true },
                    { icon: "🏔️", title: "Guía de Campo", active: true },
                    { icon: "📱", title: "Cámara Pro", active: false },
                    { icon: "⛺", title: "Tienda Premium", active: false },
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        whileHover={item.active ? { y: -5 } : {}}
                        className={`p-6 rounded-[32px] border flex flex-col items-center gap-2 transition-all ${item.active ? 'bg-white border-blue-50 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-40 grayscale'}`}
                    >
                        <span className="text-5xl mb-2 drop-shadow-sm">{item.icon}</span>
                        <span className={`font-black text-[10px] uppercase text-center ${item.active ? 'text-slate-700' : 'text-slate-400'}`}>{item.title}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
