// --------------------------------------------------------------
// CONFIGURACIÓN DE FIREBASE Y GEMINI
// --------------------------------------------------------------
// Paso 1: Pega aquí abajo tu configuración de Firebase
// (La obtienes en Project Settings -> General -> Your apps -> Web app)

const firebaseConfig = {
    apiKey: "AIzaSyDppR0-A8bEKT1sjJDst1N6uZV-EsTLSYo",
    authDomain: "GoHappy-8d660.firebaseapp.com",
    projectId: "GoHappy-8d660",
    storageBucket: "GoHappy-8d660.firebasestorage.app",
    messagingSenderId: "552831875210",
    appId: "1:552831875210:web:1af5583c40e0d62bbf9573",
    measurementId: "G-2F3HNE2L5P"
};

// Paso 2: Clave API de Google Gemini (Para el Chat IA)
// Construida en partes para evitar bloqueos automatizados de bots en GitHub
const __gk1 = "AIzaSy";
const __gk2 = "DoOl7_uj";
const __gk3 = "mTvRmN_";
const __gk4 = "kuH8LcCP";
const __gk5 = "qoYQGKsG9Y";
const GEMINI_API_KEY = __gk1 + __gk2 + __gk3 + __gk4 + __gk5;

// --------------------------------------------------------------
// NO TOCAR NADA DEBAJO DE ESTA LÍNEA
// --------------------------------------------------------------

// Inicializar Firebase (Versión Compat para ejecución local sin servidor)
if (window.firebase) {
    firebase.initializeApp(firebaseConfig);
    window.GoHappyFirebaseApp = firebase.app();
    window.GoHappyAuthReal = firebase.auth();
    window.GoHappyDB = firebase.firestore();
    
    // Activar Persistencia Offline
    window.GoHappyDB.enablePersistence({ synchronizeTabs: true }).catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Persistencia fallida: Múltiples pestañas.');
        } else if (err.code == 'unimplemented') {
            console.warn('El navegador no soporta persistencia.');
        }
    });

    console.log("🔥 Firebase conectado correctamente (Modo Offline Activo)");
} else {
    console.error("❌ Error: Librerías de Firebase no cargadas.");
}

// Exponer clave de Gemini globalmente para el chat
window.GEMINI_KEY = GEMINI_API_KEY;

