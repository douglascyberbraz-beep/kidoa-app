"use client";
import { useState, useEffect } from "react";
import { KidoaAI } from "../../services/ai_service";
import { useAppContext } from "../../context/AppContext";

export default function TodayPage({ 
    lastKnownCoords, 
    onNavigateToMap 
}: { 
    lastKnownCoords: string,
    onNavigateToMap: (coords: string, details?: any) => void 
}) {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [extraInfo, setExtraInfo] = useState<any>(null);
    const [loadingExtra, setLoadingExtra] = useState(true);
    const { playSound } = useAppContext();

    useEffect(() => {
        async function loadAIPlanes() {
            setLoading(true);
            try {
                const prefs = { adults: 2, kids: 1, ages: "5", environment: "parques y aire libre", budget: "económico" };
                const res = await KidoaAI.getTodayActivities(lastKnownCoords || "41.6520, -4.7286", prefs);
                if (res && Array.isArray(res)) setEvents(res);
                else if (res && res.plans) setEvents(res.plans);
            } catch (e) {
                console.error("Error loading AI plans:", e);
            } finally {
                setLoading(false);
            }
        }
        
        async function loadExtra() {
            setLoadingExtra(true);
            try {
                const res = await KidoaAI.getNewsAndScholarships();
                setExtraInfo(res);
            } catch (e) {
                console.error("Error loading news/scholarships:", e);
            } finally {
                setLoadingExtra(false);
            }
        }

        loadAIPlanes();
        loadExtra();
    }, [lastKnownCoords]);

    return (
        <div className="p-8 pb-32 h-full overflow-y-auto bg-slate-50">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">TODAY</h1>
                <p className="text-slate-500 mt-1 font-medium">✨ Magia personalizada para hoy</p>
            </header>
            
            {/* Activities Section */}
            <div className="space-y-6 mb-12">
                {loading ? (
                    [1, 2].map(i => (
                        <div key={i} className="bg-white rounded-[32px] p-6 shadow-medium border border-blue-50 animate-pulse">
                            <div className="h-40 bg-slate-100 rounded-3xl mb-4"></div>
                            <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                        </div>
                    ))
                ) : events.map((ev: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-slate-100 group transition-all hover:scale-[1.01]">
                        <div className="relative h-56 bg-slate-200">
                            <img src={ev.imageUrl || `https://images.unsplash.com/photo-1518173946687-a4c8a9833d8e?q=80&w=600&h=400&fit=crop`} className="w-full h-full object-cover" alt={ev.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-6 left-6 flex flex-col">
                                <span className="bg-teal-500 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-2">{ev.price || "€€"}</span>
                                <h3 className="text-2xl font-black text-white">{ev.title}</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{ev.summary}</p>
                            <div className="bg-teal-50 rounded-2xl p-4 mb-4 border border-teal-100">
                                <span className="text-[10px] font-black text-teal-600 uppercase">Expert Tip</span>
                                <p className="text-xs text-teal-900 font-bold">{ev.expertTip}</p>
                            </div>
                            <button 
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2" 
                                onClick={() => {
                                    playSound('success');
                                    onNavigateToMap(`${ev.lat},${ev.lng}`, ev);
                                }}
                            >
                                Ir ahora 🚀
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* News and Scholarships Section */}
            <header className="mb-6">
                <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Última Hora & Ayudas 📰</h2>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {loadingExtra ? (
                    <div className="h-32 bg-white rounded-3xl animate-pulse"></div>
                ) : extraInfo && (
                    <>
                        <div className="bg-blue-600 rounded-[32px] p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Noticia Familiar</span>
                            <h3 className="text-lg font-bold mt-3 leading-tight">{extraInfo.news.title}</h3>
                            <p className="text-xs text-blue-100 mt-2 opacity-90">{extraInfo.news.summary}</p>
                            <a href={extraInfo.news.url} target="_blank" className="text-[10px] font-black underline mt-4 block">Fuente: {extraInfo.news.source}</a>
                        </div>

                        <div className="bg-white rounded-[32px] p-6 border-2 border-emerald-100 shadow-sm relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mb-12 -mr-12"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Beca / Ayuda</span>
                            <h3 className="text-lg font-bold mt-3 text-slate-800 leading-tight">{extraInfo.scholarship.title}</h3>
                            <p className="text-xs text-slate-500 mt-2">{extraInfo.scholarship.summary}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-[10px] font-black text-red-500">Límite: {extraInfo.scholarship.deadline}</span>
                                <button className="text-[10px] font-black text-emerald-600 underline">Más Info</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
