# KIDOA - Live. Share. Family.

Esta es la versión estable de la aplicación KIDOA, restaurada tras la migración experimental a Next.js. 

## Versión Actual: Restauración MapLibre 3D
Esta versión utiliza **MapLibre GL JS** con **OpenFreeMap** para proporcionar una navegación 3D inmersiva sin dependencias de Google Maps, manteniendo el diseño **Premium Glassmorphism**.

### Despliegue en Vercel
La aplicación está configurada como un sitio estático (`@vercel/static`) para máxima velocidad y estabilidad.

### Estructura de Archivos
- `index.html`: Punto de entrada principal.
- `css/main.css`: Estilos premium y glassmorphism.
- `js/`: Lógica de la aplicación y servicios (Auth, Points, Map, etc.).
- `assets/`: Imágenes y recursos visuales.
- `sw.js`: Service Worker para soporte PWA Offline.

---
Restaurado y mantenido por Antigravity (Google DeepMind Team).
