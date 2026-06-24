const SITE_URL = "https://www.brunopesenti.ch";
const SUPPORTED_LANGS = ["fr", "en", "it"];

const INDEXABLE_ROUTES = new Set([
  "Accueil",
  "exposition",
  "cabinoteriers",
  "catalogue",
  "contact",
  "blog",
  "blogArticle",
  "Confident",
  "Cookies",
  "Products",
  "ProductDetail",
  "minimusee",
  "OrderComplete",
]);

const SEO_CONTENT = {
  fr: {
    defaultTitle: "Bruno Pesenti | Horlogerie et antiquites",
    defaultDescription:
      "Decouvrez l'univers de Bruno Pesenti: horlogerie ancienne, exposition et produits disponibles a la reservation en ligne.",
    titles: {
      Accueil: "Bruno Pesenti | Horlogerie et antiquites",
      exposition: "Exposition | Bruno Pesenti",
      cabinoteriers: "Cabinotiers | Bruno Pesenti",
      catalogue: "Catalogue | Bruno Pesenti",
      contact: "Contact | Bruno Pesenti",
      blog: "Blog | Bruno Pesenti",
      blogArticle: "Article de blog | Bruno Pesenti",
      Products: "Produits | Bruno Pesenti",
      ProductDetail: "Detail du produit | Bruno Pesenti",
      minimusee: "Mini musee | Bruno Pesenti",
      Cookies: "Cookies | Bruno Pesenti",
      Confident: "Confidentialite | Bruno Pesenti",
      OrderComplete: "Commande terminee | Bruno Pesenti",
    },
    descriptions: {
      Accueil:
        "Horlogerie ancienne, restauration et antiquites: visitez l'univers de Bruno Pesenti et reservez des produits en ligne.",
      Products:
        "Consultez les produits disponibles et reservez vos pieces d'horlogerie et antiquites en ligne.",
      ProductDetail:
        "Consultez les details, photos et prix du produit selectionne chez Bruno Pesenti.",
      contact:
        "Contactez Bruno Pesenti pour une demande, une reservation ou des informations sur l'atelier.",
      blog:
        "Blog de Bruno Pesenti: actualites, articles de presse, conseils d'entretien et coulisses de l'atelier d'horlogerie.",
      blogArticle:
        "Article de blog sur l'horlogerie ancienne, les antiquites et l'univers de Bruno Pesenti.",
    },
  },
  en: {
    defaultTitle: "Bruno Pesenti | Watchmaking and Antiques",
    defaultDescription:
      "Discover Bruno Pesenti's world: antique watchmaking, exhibition, and products available for online reservation.",
    titles: {
      Accueil: "Bruno Pesenti | Watchmaking and Antiques",
      exposition: "Exhibition | Bruno Pesenti",
      cabinoteriers: "Cabinotiers | Bruno Pesenti",
      catalogue: "Catalogue | Bruno Pesenti",
      contact: "Contact | Bruno Pesenti",
      blog: "Blog | Bruno Pesenti",
      blogArticle: "Blog Article | Bruno Pesenti",
      Products: "Shop | Bruno Pesenti",
      ProductDetail: "Product Details | Bruno Pesenti",
      minimusee: "Mini Museum | Bruno Pesenti",
      Cookies: "Cookies | Bruno Pesenti",
      Confident: "Privacy | Bruno Pesenti",
      OrderComplete: "Order Complete | Bruno Pesenti",
    },
    descriptions: {
      Accueil:
        "Explore Bruno Pesenti's world of antique watchmaking, restoration services, and online product reservations.",
      Products:
        "Browse available products and reserve watchmaking and antique pieces online.",
      ProductDetail:
        "View product details, images, and pricing for your selected item.",
      contact:
        "Get in touch with Bruno Pesenti for reservations, questions, or workshop information.",
      blog:
        "Bruno Pesenti's blog: news, press articles, watch care tips and behind the scenes of the workshop.",
      blogArticle:
        "Blog article about antique watchmaking, antiques and the world of Bruno Pesenti.",
    },
  },
  it: {
    defaultTitle: "Bruno Pesenti | Orologeria e Antiquariato",
    defaultDescription:
      "Scopri il mondo di Bruno Pesenti: orologeria antica, esposizione e prodotti disponibili per la prenotazione online.",
    titles: {
      Accueil: "Bruno Pesenti | Orologeria e Antiquariato",
      exposition: "Esposizione | Bruno Pesenti",
      cabinoteriers: "Cabinotiers | Bruno Pesenti",
      catalogue: "Catalogo | Bruno Pesenti",
      contact: "Contatto | Bruno Pesenti",
      blog: "Blog | Bruno Pesenti",
      blogArticle: "Articolo Blog | Bruno Pesenti",
      Products: "Prodotti | Bruno Pesenti",
      ProductDetail: "Dettaglio Prodotto | Bruno Pesenti",
      minimusee: "Mini Museo | Bruno Pesenti",
      Cookies: "Cookie | Bruno Pesenti",
      Confident: "Privacy | Bruno Pesenti",
      OrderComplete: "Ordine Completato | Bruno Pesenti",
    },
    descriptions: {
      Accueil:
        "Scopri l'universo di Bruno Pesenti: orologeria antica, restauro e prenotazione prodotti online.",
      Products:
        "Sfoglia i prodotti disponibili e prenota online pezzi di orologeria e antiquariato.",
      ProductDetail:
        "Consulta dettagli, immagini e prezzo del prodotto selezionato.",
      contact:
        "Contatta Bruno Pesenti per informazioni, prenotazioni o richieste sull'atelier.",
      blog:
        "Blog di Bruno Pesenti: notizie, articoli, consigli e retroscena dell'officina di orologeria.",
      blogArticle:
        "Articolo del blog sull'orologeria antica e l'universo di Bruno Pesenti.",
    },
  },
};

function removeLangPrefix(path) {
  const withoutLang = path.replace(/^\/(fr|en|it)(?=\/|$)/, "");
  return withoutLang || "/";
}

function ensureMeta(attrName, attrValue, content) {
  let meta = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attrName, attrValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function ensureLink(rel, href, hreflang) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;

  let link = document.head.querySelector(selector);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    if (hreflang) {
      link.setAttribute("hreflang", hreflang);
    }
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
}

function resolveLanguage(to) {
  const langParam = String(to.params?.lang || "").toLowerCase();
  if (SUPPORTED_LANGS.includes(langParam)) {
    return langParam;
  }
  const stored = String(localStorage.getItem("language") || "fr").toLowerCase();
  return SUPPORTED_LANGS.includes(stored) ? stored : "fr";
}

export function updateSeoForRoute(to) {
  const lang = resolveLanguage(to);
  const seoConfig = SEO_CONTENT[lang] || SEO_CONTENT.fr;
  const routeName = String(to.name || "");

  // Set the html lang attribute dynamically
  document.documentElement.setAttribute("lang", lang);

  const title = seoConfig.titles[routeName] || seoConfig.defaultTitle;
  const description =
    seoConfig.descriptions[routeName] || seoConfig.defaultDescription;

  document.title = title;
  ensureMeta("name", "description", description);

  const isIndexable = INDEXABLE_ROUTES.has(routeName);
  ensureMeta("name", "robots", isIndexable ? "index,follow" : "noindex,nofollow");

  const basePath = removeLangPrefix(to.path);
  const currentLocalizedPath = `/${lang}${basePath === "/" ? "/" : basePath}`;
  ensureLink("canonical", `${SITE_URL}${currentLocalizedPath}`);

  for (const alternateLang of SUPPORTED_LANGS) {
    const localizedPath = `/${alternateLang}${basePath === "/" ? "/" : basePath}`;
    ensureLink("alternate", `${SITE_URL}${localizedPath}`, alternateLang);
  }
  ensureLink("alternate", `${SITE_URL}/fr${basePath === "/" ? "/" : basePath}`, "x-default");

  ensureMeta("property", "og:title", title);
  ensureMeta("property", "og:description", description);
  ensureMeta("property", "og:type", "website");
  ensureMeta("property", "og:url", `${SITE_URL}${currentLocalizedPath}`);
}
