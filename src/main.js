import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import "./assets/main.css";

// === CRITICAL: Clean up corrupted localStorage on app start ===
function cleanupCorruptedStorage() {
  try {
    // List of keys that should be valid JSON
    const jsonKeys = ['cart', 'bookmarks'];
    
    for (const key of jsonKeys) {
      const item = localStorage.getItem(key);
      
      if (!item) continue; // Skip if empty
      
      try {
        // Try to parse
        const trimmed = item.trim();
        
        // Check if it looks like valid JSON
        if ((!trimmed.startsWith('[') && !trimmed.startsWith('{')) || 
            trimmed === '[]' && key === 'cart') {
          // This is invalid or empty, remove it
          console.warn(`[Startup] Removing ${key === 'cart' ? 'empty/corrupted' : 'invalid'} ${key}:`, item.substring(0, 50));
          localStorage.removeItem(key);
          continue;
        }
        
        // Try to actually parse it to verify validity
        JSON.parse(trimmed);
      } catch (parseError) {
        // Parse failed - definitely corrupted
        console.warn(`[Startup] Removing corrupted ${key} (parse failed):`, item.substring(0, 50));
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('[Startup] Error during storage cleanup:', error);
  }
}

// Run cleanup BEFORE creating app
cleanupCorruptedStorage();

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
