import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDppR0-A8bEKT1sjJDst1N6uZV-EsTLSYo",
    authDomain: "kidoa-8d660.firebaseapp.com",
    projectId: "kidoa-8d660",
    storageBucket: "kidoa-8d660.firebasestorage.app",
    messagingSenderId: "552831875210",
    appId: "1:552831875210:web:1af5583c40e0d62bbf9573",
    measurementId: "G-2F3HNE2L5P"
};

// Use environment variables in a real production build
const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY || "";
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, GEMINI_KEY, GOOGLE_MAPS_API_KEY, MAP_ID };
