
# 🚀 Guía de Migración FitStat AI v4.0

Este documento es el manual técnico para la instalación, despliegue y mantenimiento de la arquitectura FitStat.

## 📦 Instalación del Proyecto

### Requisitos Previos
- **Node.js**: v18.0.0+ 
- **NPM / PNPM**: Gestor de dependencias.
- **API Key**: Gemini API Key en variables de entorno.

### Instalación
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
echo "API_KEY=tu_clave_aqui" > .env
```

## 🧩 Estructura del Proyecto

### `/backend` (Lógica y Datos)
- **`/ai`**: Orquestación de modelos generativos (Chat, Parser, Predictor).
- **`/services`**: Motores de cálculo biomecánico y metabólico.
- **`/models`**: (Próximamente) Definiciones de esquemas para DB.

### `/frontend` (Interfaz)
- **`/components`**: UI modular (Dashboard, Atlas, Nutri).
- **`/hooks`**: Hooks de estado local y conexión con servicios.
- **`/stores`**: Gestión de estado global con **Zustand**.
- **`/types`**: Definiciones de TypeScript unificadas.

## 🚀 Inicialización en Antigravity
1. Abre el directorio raíz en el editor.
2. El sistema servirá `index.html`.
3. El mapa de importaciones en `index.html` redirige los módulos a la carpeta `/frontend`.

## 🌐 Deploy (Vercel)
1. Conecta el repo a Vercel.
2. Configura el **Root Directory** como `./`.
3. Añade la variable de entorno `API_KEY`.
4. El comando de build debe ser `npm run build` o similar que procese los archivos TSX.

## 🛠 Buenas Prácticas
- **Separación de Responsabilidades**: No pongas lógica de cálculo de calorías dentro de un componente. Usa `backend/services/healthMath.ts`.
- **Zustand Actions**: Toda mutación de datos debe pasar por una acción en el store.
- **Protocolo de IA**: Cada prompt debe estar versionado en `backend/ai`.

---
*FitStat AI - Health Engineering Protocol*
