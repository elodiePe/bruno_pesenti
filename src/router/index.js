import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/Accueil.vue'
import Contact from '../views/Contact.vue'
import Exposition from '../views/Exposition.vue'
import CabinotierView from '../views/CabinotierView.vue'
import Catalogue from '../views/Catalogue.vue'
import NotFound from '../views/NotFound.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:lang(en|fr)?',
      name: 'Accueil',
      component: AccueilView,
    },
    {
      path: '/:lang(en|fr)?/exposition',
      name: 'exposition',
      component: Exposition,
    },
    {
      path: '/:lang(en|fr)?/cabinotiers',
      name: 'cabinoteriers',
      component: CabinotierView,
    },
    {
      path: '/:lang(en|fr)?/catalogue',
      name: 'catalogue',
      component: Catalogue,
    },
    {
      path: '/:lang(en|fr)?/contact',
      name: 'contact',
      component: Contact,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    }
  ],
})

export default router
