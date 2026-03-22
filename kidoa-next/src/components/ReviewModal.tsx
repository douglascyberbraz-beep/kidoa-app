"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; rating: number; comment: string }) => void;
    coords: { lat: number; lng: number };
}

export default function ReviewModal({ isOpen, onClose, onSubmit, coords }: ReviewModalProps) {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-white/80 backdrop-blur-2xl rounded-[40px] w-full max-w-md shadow-2xl border border-white/40 overflow-hidden"
                >
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <h2 className="text-2xl font-black tracking-tight mb-1">Añadir Reseña 🌟</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                        </p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nombre del Lugar</label>
                            <input 
                                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej: Parque de los Columpios"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Valoración</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <button 
                                        key={num} onClick={() => setRating(num)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${rating >= num ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/20' : 'bg-slate-100 text-slate-300'}`}
                                    >
                                        ⭐
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tu Comentario</label>
                            <textarea 
                                value={comment} onChange={(e) => setComment(e.target.value)}
                                placeholder="¿Qué tal es para los peques?"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button 
                                onClick={onClose}
                                className="flex-1 py-4 rounded-2xl font-black text-slate-500 bg-slate-100 active:scale-95 transition-transform"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => onSubmit({ title, rating, comment })}
                                className="flex-[2] py-4 rounded-2xl font-black text-white bg-blue-600 shadow-xl shadow-blue-600/20 active:scale-95 transition-transform"
                            >
                                Publicar 🚀
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
