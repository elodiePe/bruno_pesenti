const GA_ID = import.meta.env.VITE_GA_ID;
const GA_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

function ensureGtagQueue() {
  if (typeof window === "undefined") {
    return false;
  }

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  return true;
}

export function hasGoogleAnalyticsConsent() {
  return typeof window !== "undefined" && localStorage.getItem("cookieConsent") === "accepted";
}

export function loadGoogleAnalytics() {
  if (!GA_ID || !ensureGtagQueue()) {
    return;
  }

  if (!document.querySelector(`script[src="${GA_SCRIPT_SRC}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = GA_SCRIPT_SRC;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
}

export function trackGoogleAnalyticsPageView(pagePath = window.location.pathname + window.location.search) {
  if (!GA_ID || !hasGoogleAnalyticsConsent() || !ensureGtagQueue()) {
    return;
  }

  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function enableGoogleAnalytics(pagePath) {
  if (!GA_ID || !hasGoogleAnalyticsConsent()) {
    return;
  }

  loadGoogleAnalytics();
  trackGoogleAnalyticsPageView(pagePath);
}

export function disableGoogleAnalytics() {
  if (typeof window === "undefined") {
    return;
  }

  const script = document.querySelector(`script[src="${GA_SCRIPT_SRC}"]`);
  if (script) {
    script.remove();
  }

  if (window.dataLayer) {
    window.dataLayer = [];
  }

  if (window.gtag) {
    delete window.gtag;
  }
}