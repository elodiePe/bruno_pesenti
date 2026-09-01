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
      const readIndexHtml = () => fs.readFileSync(indexPath, 'utf-8');
      const writeLocalizedIndexHtml = (outputPath, lang) => {
        const indexHtml = readIndexHtml();
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, indexHtml.replace('<html lang="fr">', `<html lang="${lang}">`));
      };
      
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
        '/order-complete',
        '/cart',
        '/payment-options',
        '/concours',
        '/concourspolitique',
        '/minimusee',
      ];
      
      const languages = ['fr', 'en', 'it'];
      
      // Générer les pages statiques pour chaque langue
      staticRoutes.forEach(route => {
        languages.forEach(lang => {
          const outputPath = path.resolve(__dirname, `dist/${lang}${route}/index.html`);
          writeLocalizedIndexHtml(outputPath, lang);
        });
      });

      // Routes dynamiques : générer les pages produits avec les IDs réels
      const dynamicSitemapUrls = [];
      try {
        const productsUrl = process.env.PRODUCTS_SEED_URL || 'https://api.brunopesenti.ch/api/products';
        const response = await fetch(productsUrl);
        const json = await response.json();
        const products = Array.isArray(json) ? json : (json?.data || []);

        products.forEach(product => {
          if (!product || !product._id) return;
          dynamicSitemapUrls.push(...languages.map(lang => `https://www.brunopesenti.ch/${lang}/produits/${product._id}`));
          languages.forEach(lang => {
            const outputPath = path.resolve(
              __dirname,
              `dist/${lang}/produits/${product._id}/index.html`
            );
            writeLocalizedIndexHtml(outputPath, lang);
          });
        });
      } catch (error) {
        console.warn('Failed to generate dynamic product pages:', error);
      }

      try {
        const blogUrl = process.env.BLOG_SEED_URL || 'https://api.brunopesenti.ch/api/blog';
        const response = await fetch(blogUrl);
        const json = await response.json();
        const articles = Array.isArray(json) ? json : (json?.data || []);

        articles.forEach(article => {
          if (!article || !article._id) return;
          dynamicSitemapUrls.push(...languages.map(lang => `https://www.brunopesenti.ch/${lang}/blog/${article._id}`));
          languages.forEach(lang => {
            const outputPath = path.resolve(__dirname, `dist/${lang}/blog/${article._id}/index.html`);
            writeLocalizedIndexHtml(outputPath, lang);
          });
        });
      } catch (error) {
        console.warn('Failed to generate dynamic blog pages:', error);
      }

      // Créer un fallback générique pour les IDs de produits non pré-générés
      // Cela permet le rechargement des pages de produits créés après la build
      languages.forEach(lang => {
        // Créer dist/{lang}/produits/_id/index.html comme fallback
        const fallbackPath = path.resolve(__dirname, `dist/${lang}/produits/_id/index.html`);
        writeLocalizedIndexHtml(fallbackPath, lang);
      });

      // Générer un sitemap de production qui inclut les routes dynamiques connues à la build
      const sitemapPath = path.resolve(__dirname, 'dist/sitemap.xml');
      const sitemapEntries = [
        'https://www.brunopesenti.ch/fr/',
        'https://www.brunopesenti.ch/en/',
        'https://www.brunopesenti.ch/it/',
        'https://www.brunopesenti.ch/fr/exposition',
        'https://www.brunopesenti.ch/en/exposition',
        'https://www.brunopesenti.ch/it/exposition',
        'https://www.brunopesenti.ch/fr/cabinotiers',
        'https://www.brunopesenti.ch/en/cabinotiers',
        'https://www.brunopesenti.ch/it/cabinotiers',
        'https://www.brunopesenti.ch/fr/catalogue',
        'https://www.brunopesenti.ch/en/catalogue',
        'https://www.brunopesenti.ch/it/catalogue',
        'https://www.brunopesenti.ch/fr/contact',
        'https://www.brunopesenti.ch/en/contact',
        'https://www.brunopesenti.ch/it/contact',
        'https://www.brunopesenti.ch/fr/blog',
        'https://www.brunopesenti.ch/en/blog',
        'https://www.brunopesenti.ch/it/blog',
        'https://www.brunopesenti.ch/fr/produits',
        'https://www.brunopesenti.ch/en/produits',
        'https://www.brunopesenti.ch/it/produits',
        'https://www.brunopesenti.ch/fr/minimusee',
        'https://www.brunopesenti.ch/en/minimusee',
        'https://www.brunopesenti.ch/it/minimusee',
        'https://www.brunopesenti.ch/fr/confidentialite',
        'https://www.brunopesenti.ch/en/confidentialite',
        'https://www.brunopesenti.ch/it/confidentialite',
        'https://www.brunopesenti.ch/fr/cookies',
        'https://www.brunopesenti.ch/en/cookies',
        'https://www.brunopesenti.ch/it/cookies',
        'https://www.brunopesenti.ch/fr/order-complete',
        'https://www.brunopesenti.ch/en/order-complete',
        'https://www.brunopesenti.ch/it/order-complete',
        'https://www.brunopesenti.ch/fr/concours',
        'https://www.brunopesenti.ch/en/concours',
        'https://www.brunopesenti.ch/it/concours',
        ...dynamicSitemapUrls,
      ];

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries
        .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
        .join('\n')}\n</urlset>\n`;
      fs.writeFileSync(sitemapPath, sitemapXml);
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
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: '/',  // Remplace 'nom-du-repo' par le nom de ton dépôt GitHub
});
