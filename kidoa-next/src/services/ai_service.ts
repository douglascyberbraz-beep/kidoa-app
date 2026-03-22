import { GEMINI_KEY } from "./firebase";

export class KidoaAI {
    static async callGemini(prompt: string, expectJson: boolean = true) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: expectJson ? { responseMimeType: "application/json" } : {}
                })
            });

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (expectJson) {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.warn("AI JSON Parse Error:", text);
                    return null;
                }
            }
            return text;
        } catch (e) {
            console.error("AI Service Error:", e);
            return null;
        }
    }

    static async getTodayActivities(coords: string, prefs: any) {
        const prompt = `
            ACTÚA COMO UN GUÍA LOCAL EXPERTO PARA FAMILIAS (Estilo Google Maps 2025).
            UBICACIÓN: ${coords} (Lat, Lng)
            FAMILIA: ${prefs.adults} adultos, ${prefs.kids} niños (Edades: ${prefs.ages}).
            PREFERENCIAS: Ambiente ${prefs.environment}, Presupuesto ${prefs.budget}.

            OBJETIVO: Devuelve 3 planes REALES y ESPECÍFICOS para HOY.
            REGLAS ESTRICTAS:
            1. PROHIBIDO INVENTAR: Usa solo lugares reales que existan hoy en esa ciudad.
            2. AI INSIGHTS: Para cada lugar, añade un "Expert Tip" (ej: dónde aparcar, mejor hora para ir) y un "Vibe" (ej: concurrido, relajante).
            3. Formato JSON: [{id, title, summary, location, lat, lng, time, price, expertTip, vibe, imageUrl}]
        `;
        return await this.callGemini(prompt, true);
    }

    static async getNearbySafety(coords: string) {
        const prompt = `
            ENCUENTRA 3 HOSPITALES O PUESTOS DE POLICÍA REALES CERCA DE: ${coords} (Lat, Lng).
            OBJETIVO: Ayuda a una familia en caso de emergencia.
            FORMATO JSON: [{type: 'hospital'|'police', name, distance, status: 'Abierto 24h'|'Cerrado', address}]
        `;
        return await this.callGemini(prompt, true);
    }

    static async getNewsAndScholarships() {
        const prompt = `
            ACTÚA COMO UN PERIODISTA FAMILIAR. 
            BUSCA Y DEVUELVE:
            1. Una noticia real y positiva de hoy relevante para padres/familias (España/Global).
            2. Una beca, ayuda o subvención familiar real y vigente (España).
            FORMATO JSON: { 
                news: { title, summary, source, url },
                scholarship: { title, summary, deadline, url }
            }
        `;
        return await this.callGemini(prompt, true);
    }

    static async tribeChat(message: string, context: any) {
        const prompt = `
            ACTÚA COMO "LA TRIBU": Una comunidad real de padres y expertos de Kidoa. 
            CONTEXTO: Usuario ${context.nickname}, Nivel ${context.level}.
            MENSAJE DEL USUARIO: "${message}"

            OBJETIVO: Responde como UNO de los miembros de la comunidad. 
            ELIGE UNA PERSONA AL AZAR (o la más adecuada):
            1. "Marta (Guía Kidoa)": Sabia, empática, profesional.
            2. "Carlos (Padre de 3)": Práctico, con humor, algo cansado pero feliz.
            3. "Sofía (Psicóloga Infantil)": Enfocada en el desarrollo emocional, suave.
            4. "Hugo (Explorador Pro)": Aventurero, buscador de ofertas y planes secretos.

            FORMATO JSON OBLIGATORIO: { "persona": "nombre", "avatar": "emoji", "message": "texto" }
            MÁXIMO 2 PÁRRAFOS.
        `;
        return await this.callGemini(prompt, true);
    }
}
