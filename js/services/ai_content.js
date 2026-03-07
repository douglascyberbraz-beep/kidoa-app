window.KidoaAI = {
    // Especialización en Crianza
    SYSTEM_PROMPT: `Eres KIDOA IA, la asistente oficial de la App KIDOA, experta líder en crianza consciente, salud infantil (0-15 años), psicología positiva y nutrición. 
    Tu misión es ayudar a padres modernos a encontrar planes y soluciones.
    - Estilo: Empático, ultra-personalizado, premium.
    - Seguridad: Si detectas consultas médicas críticas, ofrece consejos de calma pero siempre recomienda visitar al pediatra.
    - Conocimiento: Conoces perfectamente Castilla y León y las ayudas/becas estatales vigentes.`,

    // Buscar Noticias Regionales
    getNews: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Busca las 3 noticias más relevantes de hoy sobre crianza, ayudas económicas, becas o trámites familiares en un radio de 30km de las coordenadas ${coordinates}. 
        Prioriza contenido local de Castilla y León.
        Formato JSON estricto: [ { "title": "", "summary": "", "source": "url", "sourceName": "" } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Buscar Eventos Infantiles (0-15 años)
    getEvents: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Busca eventos infantiles (0-15 años) para los próximos 7 días en un radio de 30km de las coordenadas GPS reales: ${coordinates}.
        Incluye: Teatro, talleres, cuentacuentos, ocio activo.
        IMPORTANTE: Necesito las coordenadas aproximadas del evento para el mapa.
        Formato JSON estricto: [ { "title": "", "date": "", "location": "", "price": "" } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Buscar Becas y Ayudas
    getBecas: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Busca las 3 becas, ayudas económicas o subvenciones familiares más relevantes cuyo plazo de solicitud esté abierto o próximo a abrir en la comunidad autónoma o radio cercano a estas coordenadas GPS: ${coordinates}.
        Formato JSON estricto: [ { "title": "", "description": "", "status": "Plazo Abierto / Próximamente", "statusColor": "green o orange", "linkText": "Ver bases" } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Generador Dinámico de Mapa (Basado en Coordenadas)
    getDynamicLocations: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Actúa como guía turístico local familiar. Genera 8 sitios reales increíbles para ir con niños (parques, museos, ludotecas, restaurantes kid-friendly) en un radio cercano de las coordenadas GPS: ${coordinates}.
        Devuélvelos en formato JSON estricto para mapearlos directamente.
        Asegúrate de incluir sus nombres reales locales, no te inventes nombres de comercios si no existen, dales coordenadas muy cercanas al usuario.
        Formato esperado:
        [ { "id": UID_NUMERICO_UNICO, "name": "Nombre Real", "type": "park"|"museum"|"school"|"theater"|"kidzone"|"food", "lat": NUMERO, "lng": NUMERO, "rating": NUMERO_4_A_5, "reviews": NUMERO } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Búsqueda Semántica Dinámica
    searchDynamicLocations: async (query, coordinates = "41.6520, -4.7286") => {
        const prompt = `El usuario, ubicado en las coordenadas: ${coordinates}, ha buscado: "${query}".
        Recomienda 4 o 5 lugares locales reales que resuelvan perfectamente esta necesidad.
        Formato esperado JSON:
        [ { "id": UID_NUMERICO_UNICO, "name": "Nombre Real", "type": "park"|"museum"|"school"|"theater"|"kidzone"|"food"|"generic", "lat": NUMERO, "lng": NUMERO, "rating": 4.8, "reviews": 120 } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Chat Especializado
    chat: async (userMessage, history = []) => {
        const prompt = `${window.KidoaAI.SYSTEM_PROMPT}\n\nHistorial: ${JSON.stringify(history)}\nUsuario: ${userMessage}`;
        const response = await window.KidoaAI._callGemini(prompt, false); // false = return text, not json
        return response;
    },

    // Helper para llamadas a Gemini
    _callGemini: async (prompt, expectJson = true) => {
        if (!window.GEMINI_KEY || window.GEMINI_KEY.includes('PEGAR_AQUI')) {
            return window.KidoaAI._getMockData(prompt);
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${window.GEMINI_KEY}`, {
                method: 'POST',
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            if (expectJson) {
                const cleanJson = text.replace(/```json|```/g, '').trim();
                return JSON.parse(cleanJson);
            }
            return text;
        } catch (e) {
            console.error("Error en KidoaAI:", e);
            return expectJson ? [] : "Lo siento, tengo problemas para conectarme ahora mismo.";
        }
    },

    _getMockData: (prompt) => {
        // Fallback robusto para demos sin internet/clave
        if (prompt.includes('noticia')) return [
            { title: "Bono Cuidado Regional", summary: "Nuevas ayudas para la conciliación familiar disponibles este mes.", source: "https://ejemplo.es", sourceName: "BOE" }
        ];
        return [];
    }
};
