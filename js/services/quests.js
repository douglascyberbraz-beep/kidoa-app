// ------------------------------------------------------------------
// GoHappyQuests - Motor de Misiones Familiares
// ------------------------------------------------------------------
window.GoHappyQuests = {

    // Tipos de misión disponibles
    MISSION_TYPES: {
        EXPLORE: { icon: '🗺️', label: 'Exploración', color: '#4A90D9' },
        PHOTO: { icon: '📸', label: 'Fotógrafo', color: '#E67E22' },
        GASTRO: { icon: '🍽️', label: 'Gastro', color: '#27AE60' },
        SOCIAL: { icon: '🤝', label: 'Social', color: '#8E44AD' },
        TRIVIA: { icon: '🧠', label: 'Trivia', color: '#E74C3C' },
        ADVENTURE: { icon: '🏃', label: 'Aventura', color: '#16A085' }
    },

    // Obtener misiones activas del usuario
    // FIX PRINCIPAL: Si no hay misiones en Firestore, guardar las defaults con IDs reales
    getActiveQuests: async () => {
        const user = window.GoHappyAuth.checkAuth();
        
        // Modo invitado o sin sesión: devolver defaults locales (no necesitan Firestore)
        if (!user || user.isGuest) {
            return window.GoHappyQuests._getDefaultQuests().slice(0, 2);
        }

        try {
            const fetchPromise = window.GoHappyDB.collection('quests')
                .where('userId', '==', user.uid)
                .where('status', '==', 'active')
                .get();

            // FIX: Aumentado timeout a 8s para conexiones lentas
            const snap = await Promise.race([
                fetchPromise,
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000))
            ]);

            // FIX PRINCIPAL: Si el usuario está logueado pero sin misiones, creamos las defaults en Firestore
            if (!snap || snap.empty) {
                console.log('🎯 Creando misiones iniciales en Firestore para:', user.uid);
                const defaultQuests = window.GoHappyQuests._getDefaultQuests().slice(0, 2);
                const savedQuests = [];
                for (const q of defaultQuests) {
                    const saved = await window.GoHappyQuests.saveQuest(q);
                    if (saved) savedQuests.push(saved);
                }
                return savedQuests.length > 0 ? savedQuests : defaultQuests;
            }

            return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
            console.warn("Firestore quests fallback (timeout o error):", e.message);
            return window.GoHappyQuests._getDefaultQuests().slice(0, 2);
        }
    },

    // Guardar una misión generada por IA en la cuenta del usuario
    saveQuest: async (questData) => {
        const user = window.GoHappyAuth.checkAuth();
        if (!user) return null;

        try {
            const newQuest = {
                ...questData,
                userId: user.uid,
                status: 'active',
                progress: 0,
                totalSteps: questData.objectives?.length || 1,
                createdAt: new Date()
            };
            const docRef = await window.GoHappyDB.collection('quests').add(newQuest);
            return { id: docRef.id, ...newQuest };
        } catch (e) {
            console.error("Error saving quest:", e);
            return null;
        }
    },

    // Actualizar progreso de una misión
    updateQuestProgress: async (questId, newProgress, isComplete) => {
        const user = window.GoHappyAuth.checkAuth();
        if (!user) return false;

        // FIX: Si el ID es local (no tiene el formato de Firestore), no intentar actualizar
        if (!questId || questId.startsWith('q-')) {
            console.warn('Quest ID local detectado, no se puede actualizar en Firestore:', questId);
            return true; // Retornar true para que la UI muestre el progreso igualmente
        }

        try {
            const updateData = { progress: newProgress };
            if (isComplete) {
                updateData.status = 'completed';
                updateData.completedAt = new Date();
            }

            await window.GoHappyDB.collection('quests').doc(questId).update(updateData);

            if (isComplete) {
                // Obtener los puntos de la misión
                const questDoc = await window.GoHappyDB.collection('quests').doc(questId).get();
                const questData = questDoc.exists ? questDoc.data() : { points: 100, title: 'Misión' };

                // Registrar actividad para Memories
                await window.GoHappyDB.collection('activity').add({
                    userId: user.uid,
                    type: 'quest_completed',
                    title: 'Misión completada',
                    description: `Has terminado la misión "${questData.title || questId}"`, 
                    timestamp: new Date(),
                    points: questData.points || 100
                });
                
                // FIX CRITICO: Usar puntos dinámicos del quest, no la clave fija inexistente
                if (window.GoHappyPoints && window.GoHappyPoints.addPoints) {
                    const pts = questData.points || 100;
                    await window.GoHappyPoints.addPoints('QUEST_MEDIUM', user.uid, pts);
                }
            }
            return true;
        } catch (e) {
            console.error("Error updating quest progress:", e);
            return false;
        }
    },

    // Generar nuevas misiones con IA basadas en ubicación
    generateQuests: async (coords = "41.6520, -4.7286") => {
        try {
            if (window.GEMINI_KEY && !window.GEMINI_KEY.includes('PEGAR_AQUI')) {
                const aiQuests = await window.GoHappyAI.generateLocalQuests(coords);
                return aiQuests.map(q => ({ ...q, isDefault: false }));
            }
            // Fallback mock
            return window.GoHappyQuests._getDefaultQuests().slice(2, 4).map(q => ({ ...q, isDefault: false }));
        } catch (e) {
            console.error("Error generando misiones:", e);
            return [];
        }
    },

    // Completar una misión directamente
    completeQuest: async (questId) => {
        const user = window.GoHappyAuth.checkAuth();
        if (!user) return false;

        // FIX: No intentar actualizar IDs locales en Firestore
        if (!questId || questId.startsWith('q-')) {
            console.warn('completeQuest: ID local, no se actualiza en Firestore');
            return true;
        }

        try {
            await window.GoHappyDB.collection('quests').doc(questId).update({
                status: 'completed',
                completedAt: new Date()
            });

            // Registrar en el historial de actividad (para Memories)
            await window.GoHappyDB.collection('activity').add({
                userId: user.uid,
                type: 'quest_completed',
                questId: questId,
                timestamp: new Date()
            });

            // FIX: QUEST_COMPLETE no existe en REWARDS, usar QUEST_MEDIUM como fallback
            if (window.GoHappyPoints && window.GoHappyPoints.addPoints) {
                window.GoHappyPoints.addPoints('QUEST_MEDIUM', null, 100);
            }
            return true;
        } catch (e) {
            console.error("Error completando misión:", e);
            return false;
        }
    },

    // Misiones por defecto / demo - RICA EN CONTENIDO
    _getDefaultQuests: () => [
        {
            id: 'q-parque-1',
            title: 'Rey de los Columpios',
            description: 'Visita 3 parques diferentes en tu barrio y dinos cuál tiene los mejores columpios.',
            type: 'EXPLORE',
            category: 'Parques',
            objectives: ['Encuentra un parque nuevo', 'Prueba los columpios', 'Deja una reseña con foto'],
            points: 150,
            progress: 0,
            totalSteps: 3,
            difficulty: 'fácil',
            status: 'active'
        },
        {
            id: 'q-cultura-1',
            title: 'Pequeños Críticos de Arte',
            description: 'Lleva a los peques a un museo o teatro local y comparte su reacción.',
            type: 'ADVENTURE',
            category: 'Cultura',
            objectives: ['Visita un museo o teatro', 'Saca una foto creativa', 'Comenta qué les gustó más'],
            points: 200,
            progress: 1,
            totalSteps: 3,
            difficulty: 'media',
            status: 'active'
        },
        {
            id: 'q-gastro-1',
            title: 'Cena sin Dramas',
            description: 'Descubre un restaurante con zona infantil donde se coma bien.',
            type: 'GASTRO',
            category: 'Restaurantes',
            objectives: ['Reserva en sitio kid-friendly', 'Foto del menú infantil', 'Valora la limpieza y seguridad'],
            points: 120,
            progress: 0,
            totalSteps: 3,
            difficulty: 'fácil',
            status: 'active'
        },
        {
            id: 'q-social-1',
            title: 'Líder de la Tribu',
            description: 'Participa activamente en la comunidad ayudando a otros padres.',
            type: 'SOCIAL',
            category: 'Comunidad',
            objectives: ['Publica un consejo útil', 'Recibe 5 likes', 'Responde a una duda'],
            points: 300,
            progress: 0,
            totalSteps: 3,
            difficulty: 'difícil',
            status: 'active'
        }
    ]
};

