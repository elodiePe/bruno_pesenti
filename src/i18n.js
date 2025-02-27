import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";

const messages = {
  en,
  fr,
  it,
};

const i18n = createI18n({
  legacy: false,
  locale: 'fr', // default locale
  fallbackLocale: 'fr',
  messages,
});

export default i18n;