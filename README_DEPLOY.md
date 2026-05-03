# 🚀 Despliegue de C.8.L. MUSIC AI

Esta aplicación está configurada como una unidad "Full-Stack" lista para ser desplegada en cualquier proveedor que soporte Node.js (Vercel, Railway, Render, etc.).

## Pasos para Producción

### 1. Construir el Frontend
Vite debe generar los archivos estáticos que el servidor Express servirá.
```bash
npm run build
```
Esto creará una carpeta `dist` en la raíz del proyecto.

### 2. Configurar Variables de Entorno y Firebase
Asegúrate de que tu proveedor de hosting tenga configurada la siguiente variable:
- `GEMINI_API_KEY`: Tu clave de API de Google AI Studio.

**Firebase:**
Asegúrate de completar los datos en `src/firebase.ts` con las credenciales de tu proyecto `gen-lang-client-0744582882` antes de compilar (`npm run build`).

### 3. Iniciar el Servidor
El servidor Express detectará la carpeta `dist` y servirá tanto la API como la interfaz de usuario.
```bash
npm run server
```

## Estructura de Despliegue
- **Backend**: Express en `server.ts`.
- **Frontend**: React (Vite) en `src/`.
- **Base de Datos/Auth**: Firebase (Configurado en `src/firebase.ts`).

## Notas Importantes
- El servidor escucha en el puerto `process.env.PORT` o `3001` por defecto.
- Las llamadas a la API son relativas (`/api/...`), por lo que no hay problemas de CORS en producción.
- Para desarrollo local con Hot Reload, sigue usando `npm run start`.

---
**C.8.L. AGENCY // OMNI-PROTOCOLO**
