import { createRouter, createWebHistory } from "vue-router";
import AccueilView from "../views/Accueil.vue";
import Contact from "../views/Contact.vue";
import Exposition from "../views/Exposition.vue";
import CabinotierView from "../views/CabinotierView.vue";
import Catalogue from "../views/Catalogue.vue";
import NotFound from "../views/NotFound.vue";
import Cookies from "../views/Cookies.vue";
import Blog from "../views/Blog.vue";
import Confident from "../views/Confident.vue";
import Verification from "../views/Verification.vue";
import Unsuscribe_Newsletter from "../views/Unsuscribe_Newsletter.vue";
import VerificationDesinscription from "../views/VerificationDesinscription.vue";
import Concours from "../views/Concours.vue";
import ConfidentConcours from "../views/ConfidentConcours.vue";
const lang = localStorage.getItem("language") || "fr";

const routes = [
  {
    path: `/:lang(fr|en|it)?/`,
    name: "Accueil",
    component: AccueilView,
  },
  {
    path: `/:lang(fr|en|it)?/exposition`,
    name: "exposition",
    component: Exposition,
  },
  {
    path: `/:lang(fr|en|it)?/cabinotiers`,
    name: "cabinoteriers",
    component: CabinotierView,
  },
  {
    path: `/:lang(fr|en|it)?/catalogue`,
    name: "catalogue",
    component: Catalogue,
  },
  {
    path: `/:lang(fr|en|it)?/contact`,
    name: "contact",
    component: Contact,
  },
  {
    path: `/:lang(fr|en|it)?/blog`,
    name: "blog",
    component: Blog,
  },
  {
    path: `/:lang(fr|en|it)?/blog/:id`,
    name: "blogArticle",
    component: Blog,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/:lang(fr|en|it)?/confidentialite",
    name: "Confident",
    component: Confident,
  },
  {
    path: "/:lang(fr|en|it)?/verification",
    name: "verification",
    component: Verification,
  },
  {
    path: "/:lang(fr|en|it)?/desinscription",
    name: "unsuscribe_newsletter",
    component: Unsuscribe_Newsletter,
  },
  {
    path: "/:lang(fr|en|it)?/desinscriptionVerification",
    name: "VerificationDesinscription",
    component: VerificationDesinscription,
  },
  {
    name: "Cookies",
    component: Cookies,
  },
  {
    path: "/:lang(fr|en|it)?/cookies",
    name: "Cookies",
    component: Cookies,
  }
  //   {
  //   path: "/:lang(fr|en|it)?/concours",
  //   name: "Concours",
  //   component: Concours,
  // },
  //     {
  //   path: "/:lang(fr|en|it)?/concourspolitique",
  //   name: "ConfidentConcours",
  //   component: ConfidentConcours,
  // }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const { lang } = to.params;
  if (!lang) {
    next(`/${localStorage.getItem("language") || "fr"}${to.path}`);
  } else {
    next();
  }
});

export default router;
