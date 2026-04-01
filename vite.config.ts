import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement (système, .env, Vercel)
  // Le troisième argument '' permet de charger toutes les variables, pas seulement celles préfixées par VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Cette section remplace "process.env.GEMINI_API_KEY" par la vraie valeur lors de la construction du site
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY)
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    server: {
      port: 5173,
      host: true
    }
  };
});