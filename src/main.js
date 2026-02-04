import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import "./assets/main.css";
import { loadCart } from "./utils/localStorage.js";

// Clean up corrupted cart on app start
try {
  loadCart(); // This will clean up if corrupted
} catch (error) {
  console.error("Error during localStorage cleanup:", error);
}

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
