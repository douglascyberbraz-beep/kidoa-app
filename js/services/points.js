window.GoHappyPoints = {
    // Configuración de la tabla de puntos
    REWARDS: {
        REGISTER: 50,
        REVIEW: 30,         // Increased
        PHOTO_VIDEO: 50,    // Increased for value
        COMMENT: 10,        // Increased
        REFERRAL: 150,      // Increased
        QUEST_COMPLETE: 200, // Increased
        QUEST_PHOTO: 50,
        DAILY_LOGIN: 5
    },

    LEVELS: [
        { min: 0, name: "Explorador Novato", icon: "🌱" },
        { min: 150, name: "Explorador Activo", icon: "🌿" },
        { min: 500, name: "Guía de la Tribu", icon: "🌳" },
        { min: 1200, name: "Maestro GoHappy", icon: "⭐" },
        { min: 2500, name: "Leyenda GoHappy", icon: "👑" }
    ],

    // Obtener información de nivel basada en puntos
    getLevelInfo: (points = 0) => {
        const pts = points || 0;
        let currentLevel = window.GoHappyPoints.LEVELS[0];
        let nextLevel = null;

        for (let i = 0; i < window.GoHappyPoints.LEVELS.length; i++) {
            if (pts >= window.GoHappyPoints.LEVELS[i].min) {
                currentLevel = window.GoHappyPoints.LEVELS[i];
                nextLevel = window.GoHappyPoints.LEVELS[i + 1] || null;
            }
        }

        const progress = nextLevel
            ? ((pts - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
            : 100;

        return {
            name: currentLevel.name,
            icon: currentLevel.icon,
            nextPoints: nextLevel ? nextLevel.min : null,
            progress: Math.min(100, Math.max(0, progress))
        };
    },

    // Otorgar puntos reales y sincronizar con Firestore
    addPoints: async (action, userId) => {
        const pointsToAdd = window.GoHappyPoints.REWARDS[action] || 0;
        console.log(`Otorgando ${pointsToAdd} puntos por acción: ${action}`);

        const user = window.GoHappyAuth.checkAuth();
        
        if (user && !user.isGuest) {
            try {
                // Actualizar localmente para feedback inmediato
                user.points = (user.points || 0) + pointsToAdd;
                localStorage.setItem('GoHappy_local_user', JSON.stringify(user));
                
                // Sincronizar con Firestore
                const userRef = window.GoHappyDB.collection('users').doc(user.uid);
                await window.GoHappyDB.runTransaction(async (transaction) => {
                    const sfDoc = await transaction.get(userRef);
                    if (!sfDoc.exists) {
                        transaction.set(userRef, { points: pointsToAdd });
                    } else {
                        const newPoints = (sfDoc.data().points || 0) + pointsToAdd;
                        transaction.update(userRef, { points: newPoints });
                    }
                });
                
                window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: user.points }));
                console.log("✅ Puntos sincronizados con Firestore");
            } catch (e) {
                console.error("Error sincronizando puntos:", e);
            }
        } else {
            // Fallback para invitados o local
            let pts = parseInt(localStorage.getItem('GoHappy_guest_points')) || 0;
            pts += pointsToAdd;
            localStorage.setItem('GoHappy_guest_points', pts.toString());
            window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: pts }));
        }
        return pointsToAdd;
    }
};

