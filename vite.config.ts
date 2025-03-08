import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Asegúrate de que la base es correcta para GitHub Pages
export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/timeline/', // 🚀 Reemplaza "timeline" con el nombre del repo en GitHub
});
