import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import "./assets/main.css";

// === ULTRA-AGGRESSIVE CLEANUP ===
// This runs IMMEDIATELY before anything else
(function() {
  try {
    console.log('[INIT] Starting aggressive localStorage cleanup');
    
    // Force clear all problematic keys
    const keysToCheck = ['cart', 'bookmarks'];
    
    for (const key of keysToCheck) {
      try {
        const value = localStorage.getItem(key);
        
        if (!value) {
          console.log(`[INIT] ${key} is empty, skipping`);
          continue;
        }
        
        const trimmed = value.trim();
        
        // Check if it's valid JSON
        let isValid = false;
        try {
          if ((trimmed.startsWith('{') || trimmed.startsWith('['))) {
            const parsed = JSON.parse(trimmed);
            // Additional validation
            if (key === 'cart' && !Array.isArray(parsed)) {
              throw new Error('Cart must be an array');
            }
            isValid = true;
          }
        } catch (e) {
          isValid = false;
        }
        
        if (!isValid) {
          console.warn(`[INIT] Removing invalid ${key}:`, value.substring(0, 100));
          localStorage.removeItem(key);
        } else {
          console.log(`[INIT] ${key} is valid`);
        }
      } catch (error) {
        console.error(`[INIT] Error checking ${key}:`, error);
        localStorage.removeItem(key);
      }
    }
    
    console.log('[INIT] Cleanup complete');
  } catch (error) {
    console.error('[INIT] FATAL ERROR during cleanup:', error);
  }
})();

const app = createApp(App);

// i18n.global.locale.value = savedLanguage;
router.beforeEach((to, from, next) => {
  const savedLanguage = localStorage.getItem("language");
  i18n.global.locale.value = savedLanguage;
  const lang = savedLanguage;
  i18n.global.locale.value = lang;
  localStorage.setItem("language", lang);
  // Handle redirection from 404.html
  const redirect = to.query.redirect;
  if (redirect) {
    next({ path: redirect });
  } else {
    next();
  }
});

app.use(router).use(i18n).mount("#app");
