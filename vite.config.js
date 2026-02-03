import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import fs from 'fs';
import path from 'path';

function generateDuplicateIndexHtmlPlugin() {
  return {
    name: 'duplicate-index-html',
    apply: 'build',
    writeBundle() {
      const indexPath = path.resolve(__dirname, 'dist/index.html');
      
      // Routes statiques
      const staticRoutes = [
        '',  // Root
        '/cookies', 
        '/catalogue', 
        '/contact', 
        '/cabinotiers', 
        '/exposition',
        '/verification',
        '/desinscription',
        '/desinscriptionVerification',
        '/blog',
        '/confidentialite',
        '/produits',
        '/cart',
        '/payment-options',
      ];
      
      const languages = ['fr', 'en', 'it'];
      
      // Générer les pages statiques pour chaque langue
      staticRoutes.forEach(route => {
        languages.forEach(lang => {
          const indexHtml = fs.readFileSync(indexPath, 'utf-8');
          const outputPath = path.resolve(__dirname, `dist/${lang}${route}/index.html`);
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, indexHtml.replace('<html lang="fr">', `<html lang="${lang}">`));
        });
      });
      
      // Routes dynamiques : créer un fichier générique pour les pattern dynamiques
      const dynamicPatterns = [
        '/produits/:id',
        '/blog/:id',
      ];
      
      // Pour les routes dynamiques, on crée un fallback dans les dossiers parent
      dynamicPatterns.forEach(pattern => {
        languages.forEach(lang => {
          const baseRoute = pattern.split('/:')[0];
          const indexHtml = fs.readFileSync(indexPath, 'utf-8');
          // Crée un fichier generic _id.html ou index.html pour les routes dynamiques
          const outputPath = path.resolve(__dirname, `dist/${lang}${baseRoute}/_id/index.html`);
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, indexHtml.replace('<html lang="fr">', `<html lang="${lang}">`));
        });
      });
    },
    generateBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
      }
    }
  };
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), generateDuplicateIndexHtmlPlugin(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Ajoute cette section pour définir le chemin de base pour GitHub Pages
  base: '/',  // Remplace 'nom-du-repo' par le nom de ton dépôt GitHub
});
