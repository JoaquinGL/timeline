import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Reemplaza "joaquingl" con tu usuario de GitHub y "timeline" con el nombre del repo
export default defineConfig({
  plugins: [react()],
  base: '/timeline/', // 🔥 Asegura que el path base sea el correcto
});
