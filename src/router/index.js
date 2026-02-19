import { createRouter, createWebHistory } from "vue-router";
import AccueilView from "../views/Accueil.vue";
import Contact from "../views/Contact.vue";
import Exposition from "../views/Exposition.vue";
import CabinotierView from "../views/CabinotierView.vue";
import Products from "../views/Products.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Cart from "../views/Cart.vue";
import PaymentOptions from "../views/PaymentOptions.vue";
import Catalogue from "../views/Catalogue.vue";
import NotFound from "../views/NotFound.vue";
import Cookies from "../views/Cookies.vue";
import Blog from "../views/Blog.vue";
import Confident from "../views/Confident.vue";
import Verification from "../views/Verification.vue";
import Unsuscribe_Newsletter from "../views/Unsuscribe_Newsletter.vue";
import VerificationDesinscription from "../views/VerificationDesinscription.vue";
import OrderComplete from "../views/OrderComplete.vue";
import Concours from "../views/Concours.vue";
import ConfidentConcours from "../views/ConfidentConcours.vue";
import Admin from "../views/Admin.vue";
const lang = localStorage.getItem("language") || "fr";
const supportedLangs = ["fr", "en", "it"];

function resolveLangFromPath(pathValue) {
  const firstSegment = pathValue.split("/").filter(Boolean)[0];
  if (supportedLangs.includes(firstSegment)) {
    return firstSegment;
  }
  return localStorage.getItem("language") || "fr";
}

const routes = [
  {
    path: `/:lang(fr|en|it)?/`,
    name: "Accueil",
    component: AccueilView,
  },
  {
    path: `/:lang(fr|en|it)?/order-complete`,
    name: "OrderComplete",
    component: OrderComplete,
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
    path: "/:lang(fr|en|it)?/notfound",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: (to) => ({
      name: "NotFound",
      params: { lang: resolveLangFromPath(to.path) },
    }),
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
    path: `/:lang(fr|en|it)?/produits`,
    name: "Products",
    component: Products,
  },
  {
    path: `/:lang(fr|en|it)?/produits/:id`,
    name: "ProductDetail",
    component: ProductDetail,
  },
  {
    path: `/:lang(fr|en|it)?/cart`,
    name: "Cart",
    component: Cart,
  },
  {
    path: `/:lang(fr|en|it)?/payment-options`,
    name: "PaymentOptions",
    component: PaymentOptions,
  },
  {
    path: `/:lang(fr|en|it)?/admin`,
    name: "Admin",
    component: Admin,
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
  // Handle redirect from 404.html FIRST
  const redirect = to.query.redirect;
  if (redirect && from.path === '/') {
    // This is a redirect from 404.html
    console.log('[Router] Handling 404 redirect:', redirect);
    // Extract the actual path and navigate to it
    const redirectPath = redirect.startsWith('/') ? redirect : '/' + redirect;
    const redirectLang = resolveLangFromPath(redirectPath);
    // Check if the redirectPath matches a known route (not catch-all)
    const matchedRoute = router.resolve(redirectPath);
    const isCatchAllMatch = matchedRoute.matched.some(
      (record) => record.path === '/:pathMatch(.*)*'
    );

    if (isCatchAllMatch) {
      next({ name: 'NotFound', params: { lang: redirectLang } });
    } else {
      next(redirectPath);
    }
    return;
  }

  // Skip the language check for admin route
  if (to.path === '/admin') {
    next();
    return;
  }

  const { lang } = to.params;
  if (!lang) {
    next(`/${localStorage.getItem("language") || "fr"}${to.path}`);
  } else {
    next();
  }
});

export default router;
