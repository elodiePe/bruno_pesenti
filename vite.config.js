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
    async writeBundle() {
      const indexPath = path.resolve(__dirname, 'dist/index.html');
      
      // Routes statiques
      const staticRoutes = [
        '',  // Root
        '/cookies', 
        '/catalogue', 
        '/admin',
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

      // Route admin (sans préfixe de langue)

      
      // Routes dynamiques : générer les pages produits avec les IDs réels
      try {
        const productsUrl = process.env.PRODUCTS_SEED_URL || 'https://api.brunopesenti.ch/api/products';
        const response = await fetch(productsUrl);
        const json = await response.json();
        const products = Array.isArray(json) ? json : (json?.data || []);

        products.forEach(product => {
          if (!product || !product._id) return;
          languages.forEach(lang => {
            const indexHtml = fs.readFileSync(indexPath, 'utf-8');
            const outputPath = path.resolve(
              __dirname,
              `dist/${lang}/produits/${product._id}/index.html`
            );
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, indexHtml.replace('<html lang="fr">', `<html lang="${lang}">`));
          });
        });
      } catch (error) {
        console.warn('Failed to generate dynamic product pages:', error);
      }

      // Créer un fallback générique pour les IDs de produits non pré-générés
      // Cela permet le rechargement des pages de produits créés après la build
      languages.forEach(lang => {
        const indexHtml = fs.readFileSync(indexPath, 'utf-8');
        // Créer dist/{lang}/produits/_id/index.html comme fallback
        const fallbackPath = path.resolve(__dirname, `dist/${lang}/produits/_id/index.html`);
        fs.mkdirSync(path.dirname(fallbackPath), { recursive: true });
        fs.writeFileSync(fallbackPath, indexHtml.replace('<html lang="fr">', `<html lang="${lang}">`));
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
