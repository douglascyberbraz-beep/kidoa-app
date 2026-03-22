"use client";

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useAppContext } from '../context/AppContext';
import { DataService } from '../services/data_service';
import { KidoaAI } from '../services/ai_service';
import { GOOGLE_MAPS_API_KEY, MAP_ID } from '../services/firebase';
import ReviewModal from './ReviewModal';
import AuthModal from './AuthModal';

export default function KidoaMap({ 
    lastKnownCoords, 
    targetCoords,
    targetDetails
}: { 
    lastKnownCoords: string,
    targetCoords?: string | null,
    targetDetails?: any
}) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<{ instance: any, type: string, data: any }[]>([]);
    const userMarkerRef = useRef<any>(null);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

    const { user, playSound } = useAppContext();

    const handleReviewSubmit = async (data: { title: string; rating: number; comment: string }) => {
        if (!selectedCoords || !user) return;
        
        try {
            playSound('success');
            await DataService.addReview(
                user.uid, 
                data.title, 
                data.rating, 
                data.comment, 
                selectedCoords.lat, 
                selectedCoords.lng
            );
            setShowReviewModal(false);
            // Optionally reload markers to show the new review
            loadMarkers();
        } catch (e) {
            console.error("Error adding review:", e);
        }
    };

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        const loader = new Loader({
            apiKey: GOOGLE_MAPS_API_KEY,
            version: "weekly",
            libraries: ["marker", "places"]
        });

        (loader as any).load().then(async () => {
            const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
            const [lat, lng] = lastKnownCoords.split(',').map(Number);

            map.current = new Map(mapContainer.current!, {
                center: { lat: lat || 41.6520, lng: lng || -4.7286 },
                zoom: 17,
                tilt: 60,
                heading: -5,
                mapId: MAP_ID || "DEMO_MAP_ID", // Use Map ID for Advanced Markers & 3D
                disableDefaultUI: true,
                styles: [
                    { "elementType": "geometry", "stylers": [{ "color": "#1d2c4d" }] },
                    { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] },
                    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] },
                    { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] },
                    { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "color": "#334e62" }] },
                    { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#023e58" }] },
                    { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#283d6a" }] },
                    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#6f9ba5" }] },
                    { "featureType": "poi", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] },
                    { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#064e3b" }] },
                    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#304a7d" }] },
                    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] },
                    { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] },
                    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#2c4591" }] },
                    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#023e58" }] },
                    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#b0d5ce" }] },
                    { "featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [{ "color": "#023e58" }] },
                    { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] },
                    { "featureType": "transit", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] },
                    { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [{ "color": "#283d6a" }] },
                    { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#3a4762" }] },
                    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#004d4d" }] },
                    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#4e6d70" }] }
                ]
            });

            // Double Click to ADD REVIEW
            map.current.addListener('dblclick', (e: google.maps.MapMouseEvent) => {
                const latLng = e.latLng;
                if (!latLng) return;
                
                playSound('boop');
                setSelectedCoords({ lat: latLng.lat(), lng: latLng.lng() });
                
                if (!user) {
                    setShowAuthModal(true);
                } else {
                    setShowReviewModal(true);
                }
            });

            loadMarkers();
            updateUserIcon(lat, lng);
        });

    }, []);

    // Watch for GPS changes to update user orb
    useEffect(() => {
        if (!map.current || !lastKnownCoords) return;
        const [lat, lng] = lastKnownCoords.split(',').map(Number);
        updateUserIcon(lat, lng);
    }, [lastKnownCoords]);

    // Handle incoming target coordinates from TodayPage
    useEffect(() => {
        if (!map.current || !targetCoords) return;
        const [lat, lng] = targetCoords.split(',').map(Number);
        
        map.current.panTo({ lat, lng });
        map.current.setZoom(18);
        map.current.setTilt(45);

        if (targetDetails) {
            // Create a temporary highlight marker or just open info window if we can find the marker
            // For simplicity, we'll create a special "Target" marker or just a custom InfoWindow
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="min-width: 220px; overflow: hidden; font-family: 'Segoe UI', Roboto, sans-serif; border-radius: 20px; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                        <div style="height: 100px; background: #0f172a; overflow: hidden;">
                            <img src="${targetDetails.imageUrl || 'https://images.unsplash.com/photo-1518173946687-a4c8a9833d8e?q=80&w=600&h=400&fit=crop'}" style="width: 100%; height: 100%; object-cover;">
                        </div>
                        <div style="padding: 16px;">
                            <h3 style="margin: 0 0 4px 0; font-size: 1.1rem; font-weight: 900; color: #0f172a;">${targetDetails.title}</h3>
                            <div style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 12px;">${targetDetails.summary}</div>
                            <div style="background:#f0fdfa; border:1px solid #ccfbf1; padding:10px; border-radius:12px;">
                                <div style="font-size:10px; font-weight:900; color:#0d9488; text-transform:uppercase;">💡 AI Tip</div>
                                <div style="font-size:11px; color:#134e4a; font-weight:600;">${targetDetails.expertTip}</div>
                            </div>
                        </div>
                    </div>
                `
            });
            infoWindow.setPosition({ lat, lng });
            infoWindow.open(map.current);
        }
    }, [targetCoords, targetDetails]);

    const loadMarkers = async () => {
        try {
            const locations = await DataService.getLocations(lastKnownCoords);
            clearMarkers();
            locations.forEach((loc: any) => createMarker(loc));
        } catch(e) { console.error("Error loading markers:", e); }
    };

    const clearMarkers = () => {
        markersRef.current.forEach(m => m.instance.setMap(null));
        markersRef.current = [];
    };

    const createMarker = async (loc: any) => {
        if (!map.current) return;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        
        const isHighRated = loc.rating >= 4.5;
        const el = document.createElement('div');
        el.style.cssText = `
            width: 30px; height: 30px; border-radius: 50%;
            background: ${isHighRated ? 'linear-gradient(135deg, #FF6B6B, #FF8E8B)' : 'linear-gradient(135deg, #002C77, #4CC9F0)'};
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;
            cursor: pointer;
        `;
        el.innerHTML = `<img src="/assets/logo.png" style="width: 20px; height: 20px; object-fit: contain; filter: brightness(100) grayscale(1);">`;

        const marker = new AdvancedMarkerElement({
            map: map.current,
            position: { lat: loc.lat, lng: loc.lng },
            content: el,
            title: loc.name
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="min-width: 220px; overflow: hidden; font-family: 'Segoe UI', Roboto, sans-serif; border-radius: 20px; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                    <div style="height: 100px; background: ${isHighRated ? '#f43f5e' : '#0f172a'}; overflow: hidden; position: relative;">
                        ${loc.image ? `<img src="${loc.image}" style="width: 100%; height: 100%; object-fit: cover;">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;font-size:2rem;">🌟</div>'}
                        ${loc.vibe ? `<div style="position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.9);color:#0f172a;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:900;box-shadow:0 2px 5px rgba(0,0,0,0.2);">✨ ${loc.vibe}</div>` : ''}
                    </div>
                    <div style="padding: 16px;">
                        <h3 style="margin: 0 0 4px 0; font-size: 1.1rem; font-weight: 900; color: #0f172a;">${loc.name}</h3>
                        <div style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 12px; display:flex; gap:8px;">
                            <span>⭐ ${loc.rating || 4.5}</span>
                            <span>•</span>
                            <span style="color:#0d9488;">${loc.type}</span>
                        </div>
                        ${loc.expertTip ? `
                            <div style="background:#f0fdfa; border:1px solid #ccfbf1; padding:10px; border-radius:12px; margin-top:8px;">
                                <div style="font-size:10px; font-weight:900; color:#0d9488; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">💡 AI Tip</div>
                                <div style="font-size:11px; color:#134e4a; font-weight:600; line-height:1.4;">${loc.expertTip}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `
        });

        marker.addListener('click', () => {
            playSound('boop');
            infoWindow.open(map.current, marker);
        });

        markersRef.current.push({ instance: marker, type: loc.type, data: loc });
    };

    const filterMarkers = (type: string) => {
        playSound('boop');
        setActiveFilter(type);
        if (!map.current) return;
        markersRef.current.forEach(m => {
            if (type === 'all' || m.type === type) m.instance.setMap(map.current);
            else m.instance.setMap(null);
        });
    };

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setIsSearching(true);
            try {
                const prompt = `Busca las coordenadas (lat, lng) para el lugar: "${searchQuery}". 
                Si es una búsqueda general (ej: "parques"), elige el punto más céntrico o relevante en Valladolid, España (o detecta la ciudad). 
                Responde SOLO un JSON: {"lat": número, "lng": número, "name": "nombre real"}`;
                
                const res = await KidoaAI.callGemini(prompt, true);
                if (res && res.lat && res.lng) {
                    playSound('success');
                    map.current?.panTo({ lat: res.lat, lng: res.lng });
                    map.current?.setZoom(17);
                } else {
                    playSound('click');
                }
            } catch(e) {
                console.error("Search error:", e);
                playSound('click');
            } finally {
                setIsSearching(false);
                setSearchQuery("");
            }
        }
    };

    const updateUserIcon = async (lat: number, lng: number) => {
        if (!map.current) return;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        if (!userMarkerRef.current) {
            const el = document.createElement('div');
            el.innerHTML = `
                <div style="width: 50px; height: 50px; background: radial-gradient(circle, rgba(76, 201, 240, 0.4) 0%, transparent 70%); display: flex; justify-content: center; align-items: center; border-radius: 50%;">
                    <div style="width: 24px; height: 24px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(76, 201, 240, 0.8); border: 2px solid #002C77;">
                        <span style="font-size: 12px;">✨</span>
                    </div>
                </div>
            `;
            userMarkerRef.current = new AdvancedMarkerElement({
                map: map.current,
                position: { lat, lng },
                content: el,
                title: "Tú estás aquí"
            });
        } else {
            userMarkerRef.current.position = { lat, lng };
        }
    };

    const handleLocateMe = () => {
        playSound('boop');
        const [lat, lng] = lastKnownCoords.split(',').map(Number);
        if (map.current && lat && lng) {
            map.current.panTo({ lat, lng });
            map.current.setZoom(18);
            map.current.setTilt(0);
        }
    };

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-100">
            <div ref={mapContainer} className="absolute inset-0 z-0" />
            
            {/* Overlay UI */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[92%] max-w-[500px] z-10 flex flex-col gap-3 pointer-events-none">
                <div className="flex items-center bg-white/95 backdrop-blur-2xl rounded-3xl px-6 py-4 shadow-2xl border border-white/50 pointer-events-auto transition-all focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:scale-[1.02]">
                    <span className="mr-3 text-lg">{isSearching ? "✨" : "🔍"}</span>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder={isSearching ? "IA Pensando..." : "Explora con Gemini..."}
                        disabled={isSearching}
                        className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900 font-bold placeholder-slate-400"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pointer-events-auto px-1 no-scrollbar drop-shadow-sm">
                    {[
                        { id: 'all', label: 'Todos', icon: '🌍' },
                        { id: 'park', label: 'Parques', icon: '🌳' },
                        { id: 'school', label: 'Escuelas', icon: '🎓' },
                        { id: 'kidzone', label: 'Ludotecas', icon: '🏰' },
                        { id: 'food', label: 'Comida', icon: '🍏' },
                    ].map(f => (
                        <button 
                            key={f.id}
                            onClick={() => filterMarkers(f.id)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-xs font-black transition-all shadow-sm border ${activeFilter === f.id ? 'bg-teal-600 text-white border-teal-500 shadow-teal-500/30' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
                        >
                            {f.icon} {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                onClick={handleLocateMe}
                className="absolute bottom-36 right-6 w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.2)] border border-white active:scale-95 transition-all z-10 text-2xl"
            >
                <span className="drop-shadow-sm">🎯</span>
            </button>

            {showReviewModal && selectedCoords && (
                <ReviewModal 
                    isOpen={showReviewModal}
                    coords={selectedCoords}
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={handleReviewSubmit}
                />
            )}

            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
        </div>
    );
}
