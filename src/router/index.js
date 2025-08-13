import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/Accueil.vue'
import Contact from '../views/Contact.vue'
import Exposition from '../views/Exposition.vue'
import CabinotierView from '../views/CabinotierView.vue'
import Catalogue from '../views/Catalogue.vue'
import NotFound from '../views/NotFound.vue'
import Cookies from '../views/Cookies.vue'
import Blog from '../views/Blog.vue'
import Confidentiality from '@/views/Confidentiality.vue'
import Form from '@/views/Form.vue'
import Unsuscribe_Newsletter from '@/views/Unsuscribe_Newsletter.vue'
const lang = localStorage.getItem('language') || 'fr';

const routes = [
  {
    path: `/:lang(fr|en|it)?/`,
    name: 'Accueil',
    component: AccueilView,
  },
  {
    path: `/:lang(fr|en|it)?/exposition`,
    name: 'exposition',
    component: Exposition,
  },
  {
    path: `/:lang(fr|en|it)?/cabinotiers`,
    name: 'cabinoteriers',
    component: CabinotierView,
  },
  {
    path: `/:lang(fr|en|it)?/catalogue`,
    name: 'catalogue',
    component: Catalogue,
  },
  {
    path: `/:lang(fr|en|it)?/contact`,
    name: 'contact',
    component: Contact,
  },
    {
    path: `/:lang(fr|en|it)?/blog`,
    name: 'blog',
    component: Blog,
  },
      {
    path: `/:lang(fr|en|it)?/blog/:id`,
    name: 'BlogArticle',
    component: Blog,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
    {
    path: "/:lang(fr|en|it)?/confidentialite",
    name: 'Confidentiality',
    component: Confidentiality,
  },
      {
    path: "/:lang(fr|en|it)?/verification",
    name: 'From',
    component: Form,
  },
        {
    path: "/:lang(fr|en|it)?/Desinscription",
    name: 'Unsuscribe_Newsletter',
    component: Unsuscribe_Newsletter,
  },
  {
    name: 'Cookies',
    component: Cookies,
  },
  {
    path: "/:lang(fr|en|it)?/cookies",
    name: 'Cookies',
    component: Cookies,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const { lang } = to.params;
  if (!lang) {
    next(`/${localStorage.getItem('language') || 'fr'}${to.path}`);
  } else {
    next();
  }
});

export default router;
