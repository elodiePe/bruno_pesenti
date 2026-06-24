<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();
function getCookieConsent() {
  return localStorage.getItem('cookieConsent') === 'accepted';
}

function clearAllStorageAndCookies() {
  Object.keys(localStorage).forEach(key => {
    if (key !== 'cart') {
      localStorage.removeItem(key);
    }
  });
  sessionStorage.clear();
  document.cookie.split(';').forEach(function(c) {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
  });
}

const changeLanguage = (lang) => {
  locale.value = lang;
  if (getCookieConsent()) {
    localStorage.setItem('language', lang);
  } else {
    clearAllStorageAndCookies();
  }
  router.push({ path: `/${lang}${route.path.replace(/^\/(en|fr|it)/, '')}` });
};
watch(route, (newRoute) => {
  const lang = newRoute.path.split('/')[1];
  if (['en', 'fr', 'it'].includes(lang)) {
    locale.value = lang;
    if (getCookieConsent()) {
      localStorage.setItem('language', lang);
    } else {
      clearAllStorageAndCookies();
    }
  }
});

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleClickOutside = (event) => {
  const menu = document.querySelector('.navigation');
  const burger = document.querySelector('.burger');
  if (menu && burger && !menu.contains(event.target) && !burger.contains(event.target)) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <!-- BURGER BUTTON (mobile only) -->
  <div :class="['burger', { 'burger-open': isMenuOpen }]" @click="toggleMenu">
    <span></span>
    <span></span>
    <span></span>
  </div>

  <!-- DESKTOP NAV -->
  <div class="nav-desktop">
    <ul>
      <li><RouterLink :to="{ name: 'Accueil' }">{{ $t('navigation.home') }}</RouterLink></li>
      <li><RouterLink :to="{ name: 'Products' }">{{ $t('navigation.produits') }}</RouterLink></li>
      <li><RouterLink :to="{ name: 'blog' }">{{ $t('navigation.blog') }}</RouterLink></li>
      <li><RouterLink :to="{ name: 'exposition' }">{{ $t('navigation.exposition') }}</RouterLink></li>
      <li class="drop">
        <span>Autre ▾</span>
        <ul class="drop-menu">
          <li><RouterLink :to="{ name: 'cabinoteriers' }">{{ $t('navigation.cabinotiers') }}</RouterLink></li>
          <li><RouterLink :to="{ name: 'catalogue' }">{{ $t('navigation.catalogue') }}</RouterLink></li>
        </ul>
      </li>
      <li class="spacer"></li>
      <li><RouterLink :to="{ name: 'contact' }">{{ $t('navigation.contact') }}</RouterLink></li>
      <li class="lang-wrap">
        <select @change="changeLanguage($event.target.value)" :value="locale">
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="it">IT</option>
        </select>
      </li>
    </ul>
  </div>

  <!-- MOBILE BURGER NAV -->
  <div :class="['nav-mobile', { 'nav-mobile-open': isMenuOpen }]">
    <ul>
      <li><RouterLink @click="isMenuOpen = false" :to="{ name: 'Accueil' }">{{ $t('navigation.home') }}</RouterLink></li>
      <li><RouterLink @click="isMenuOpen = false" :to="{ name: 'Products' }">{{ $t('navigation.produits') }}</RouterLink></li>
      <li><RouterLink @click="isMenuOpen = false" :to="{ name: 'blog' }">{{ $t('navigation.blog') }}</RouterLink></li>
      <li><RouterLink @click="isMenuOpen = false" :to="{ name: 'exposition' }">{{ $t('navigation.exposition') }}</RouterLink></li>
      <li><RouterLink @click="isMenuOpen = false" :to="{ name: 'cabinoteriers' }">{{ $t('navigation.cabinotiers') }}</RouterLink></li>
      <li><RouterLink @click="isMenuOpen = false" :to="{ name: 'catalogue' }">{{ $t('navigation.catalogue') }}</RouterLink></li>
      <li><RouterLink @click="isMenuOpen = false" :to="{ name: 'contact' }">{{ $t('navigation.contact') }}</RouterLink></li>
      <li class="lang-wrap">
        <select @change="changeLanguage($event.target.value)" :value="locale">
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="it">IT</option>
        </select>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* ===== DESKTOP NAV ===== */
.nav-desktop {
  display: block;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background-color: #4c6a65;
  border-radius: 10px 10px 0 0;
  padding: 0.5rem 1rem;
  padding-top: 1rem;
  padding-bottom:1rem;
}

.nav-desktop ul {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.7rem;
}

.nav-desktop a {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #deb887;
  color: #000;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.nav-desktop a:hover,
.nav-desktop a.router-link-active {
  background-color: #4c6a65 !important;
  color: #fff !important;
}

/* Desktop dropdown */
.nav-desktop .drop {
  position: relative;
  list-style: none;
}

.nav-desktop .drop > span {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #deb887;
  color: #000;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.nav-desktop .drop > span:hover {
  background-color: #4c6a65;
  color: #fff;
}

.nav-desktop .drop-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #4c6a65;
  border-radius: 10px;
  padding: 0.4rem;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  list-style: none;
  white-space: nowrap;
  gap: 0;
}

.nav-desktop .drop:hover .drop-menu,
.nav-desktop .drop-menu:hover {
  display: block;
}

.nav-desktop .drop-menu a {
  margin: 2px 0;
}

.nav-desktop .drop-menu a.router-link-active {
  background-color: #4c6a65 !important;
  color: #fff !important;
}

/* Spacer */
.nav-desktop .spacer {
  flex: 1;
}

/* Language selector desktop */
.nav-desktop .lang-wrap select {
  background-color: #4c6a65;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.nav-desktop .lang-wrap select:hover {
  background-color: #3a524e;
}

/* ===== MOBILE NAV ===== */
.burger {
  display: none;
}

.nav-mobile {
  display: none;
}

@media (max-width: 1050px) {
  .nav-desktop {
    display: none;
  }

  .burger {
    display: block;
    position: fixed;
    width: 40px;
    height: 40px;
    border-radius: 20%;
    top: 20px;
    right: 2rem;
    background-color: transparent;
    cursor: pointer;
    z-index: 1001;
  }

  .burger span {
    display: block;
    width: 40px;
    height: 8px;
    border-radius: 30%;
    background-color: #c86412;
    margin: 8px auto;
    transition: all 0.3s;
  }

  .burger-open span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
  }
  .burger-open span:nth-child(2) {
    opacity: 0;
  }
  .burger-open span:nth-child(3) {
    transform: rotate(-45deg) translate(8px, -8px);
  }

  .nav-mobile {
    display: none;
    position: fixed;
    top: 60px;
    right: 2rem;
    background: #4c6a65;
    border-radius: 10px;
    padding: 1rem 1.5rem;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .nav-mobile-open {
    display: block;
  }

  .nav-mobile ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;
  }

  .nav-mobile a {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 4px;
    background-color: #deb887;
    color: #000;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .nav-mobile a:hover,
  .nav-mobile a.router-link-active {
    background-color: #4c6a65 !important;
    color: #fff !important;
  }

  .nav-mobile .lang-wrap select {
    background-color: #4c6a65;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }
}

</style>

<style>
.nav-desktop a.router-link-active,
.nav-mobile a.router-link-active {
  background-color: #4c6a65 !important;
  color: #fff !important;
}
</style>
