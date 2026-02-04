import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import "./assets/main.css";

// === CRITICAL: Clean up corrupted localStorage on app start ===
function cleanupCorruptedStorage() {
  try {
    const cartItem = localStorage.getItem('cart');
    
    // If cart exists and is not valid JSON, delete it
    if (cartItem) {
      const trimmed = cartItem.trim();
      // Check if it looks like valid JSON array or object
      if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
        console.warn('[Startup] Removing corrupted cart data:', cartItem);
        localStorage.removeItem('cart');
      } else {
        // Try to parse it
        try {
          JSON.parse(cartItem);
        } catch (e) {
          console.warn('[Startup] Cart data is invalid JSON, removing:', e);
          localStorage.removeItem('cart');
        }
      }
    }
  } catch (error) {
    console.error('[Startup] Error during storage cleanup:', error);
  }
}

// Run cleanup before creating app
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
