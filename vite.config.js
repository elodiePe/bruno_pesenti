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
      const routes = [
        '/:lang(fr|en|it)?/', 
        '/:lang(fr|en|it)?/cookies', 
        '/:lang(fr|en|it)?/catalogue', 
        '/:lang(fr|en|it)?/contact', 
        '/:lang(fr|en|it)?/cabinotiers', 
        '/:lang(fr|en|it)?/exposition',
        '/:lang(fr|en|it)?/verification',
        '/:lang(fr|en|it)?/desinscription',
        '/:lang(fr|en|it)?/desinscriptionVerification',
        '/:lang(fr|en|it)?/blog',
        '/:lang(fr|en|it)?/confidentialite',
        '/:lang(fr|en|it)?/concourspolitique'
      ];
      routes.forEach(route => {
        const lang = route.match(/:lang\((.*?)\)/)[1].split('|');
        lang.forEach(l => {
          const indexHtml = fs.readFileSync(indexPath, 'utf-8');
          const outputPath = path.resolve(__dirname, `dist/${l}${route.replace('/:lang(fr|en|it)?', '')}/index.html`);
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, indexHtml.replace('<html lang="fr">', `<html lang="${l}">`));
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
