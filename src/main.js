import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import './assets/main.css';

const app = createApp(App);

router.beforeEach((to, from, next) => {
  const lang = to.params.lang || 'en';
  i18n.global.locale.value = lang;
  next();
});

app.use(router).use(i18n).mount('#app');