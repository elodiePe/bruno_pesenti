import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import "./assets/main.css";

const app = createApp(App);

// i18n.global.locale.value = savedLanguage;
router.beforeEach((to, from, next) => {
  const savedLanguage = localStorage.getItem("language");
  i18n.global.locale.value = savedLanguage;
  const lang = savedLanguage;
  i18n.global.locale.value = lang;
  localStorage.setItem("language", lang);
  next();
});

app.use(router).use(i18n).mount("#app");
