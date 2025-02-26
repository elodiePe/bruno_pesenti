import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/Accueil.vue'
import Contact from '../views/Contact.vue'
import Exposition from '../views/Exposition.vue'
import CabinotierView from '../views/CabinotierView.vue'
import Catalogue from '../views/Catalogue.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Accueil',
      component: AccueilView,
    },
    {
      path: '/exposition',
      name: 'exposition',
      component: Exposition,
    },
    {
      path: '/cabinotiers',
      name: 'cabinoteriers',
      component: CabinotierView,
    },
    {
      path: '/catalogue',
      name: 'catalogue',
      component: Catalogue,
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
    },
  ],
})

export default router
