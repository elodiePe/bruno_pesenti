<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();
const changeLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('language', lang);
  router.push({ path: `/${lang}${route.path.replace(/^\/(en|fr|it)/, '')}` });

};
watch(route, (newRoute) => {
  const lang = newRoute.path.split('/')[1];
  if (['en', 'fr', 'it'].includes(lang)) {
    locale.value = lang;
    localStorage.setItem('language', lang);
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
  <div :class="['burger', { 'burger-open': isMenuOpen }]" @click="toggleMenu">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div :class="['navigation', { 'navigation-open': isMenuOpen }]">
    <ul class="nav no-search">
      <li class="navText">
        <RouterLink class="one" to="/">{{ $t('navigation.home') }}</RouterLink>
      </li>
      <li class="navText">
        <RouterLink class="two" to="/exposition">{{ $t('navigation.exposition') }}</RouterLink>
      </li>
      <li class="navText">
        <RouterLink class="three" to="/cabinotiers">{{ $t('navigation.cabinotiers') }}</RouterLink>
      </li>
      <li class="navText">
        <RouterLink class="four" to="/catalogue">{{ $t('navigation.catalogue') }}</RouterLink>
      </li>
      <li class="navText">
        <RouterLink class="five" to="/contact">{{ $t('navigation.contact') }}</RouterLink>
      </li>
      <li class="navText">
        <select @change="changeLanguage($event.target.value)" :value="locale" >
          <option value="en">{{ $t('navigation.language.english') }}</option>
          <option value="fr">{{ $t('navigation.language.french') }}</option>
          <option value="it">{{ $t('navigation.language.italian') }}</option>
        </select>
      </li>
    </ul>
  </div>
  <!-- <button @click="changeLanguage('en')">{{ $t('navigation.language.english') }}</button>
  <button @click="changeLanguage('fr')">{{ $t('navigation.language.french') }}</button> -->
</template>

<style scoped>
.navText .router-link-exact-active {
  background-color: #f0f0f0; /* Change this to your desired active color */
  color: #c86412; /* Change this to your desired active text color */
}

.navText .router-link-active {
  background-color: #e0e0e0; /* Change this to your desired hover color */
  color: #c86412; /* Change this to your desired hover text color */
}

.one:active {
  background-color: #e0e0e0;
}
.one:hover {
  background-color: #e0e0e0;
}
.two:hover {
  background-color: #e0e0e0;
}
.three:hover {
  background-color: #e0e0e0;
}
.four:hover {
  background-color: #e0e0e0;
}
.five:hover {
  background-color: #e0e0e0;
}
.burger {
  display: none;
}

@media (max-width: 1050px) {
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
    z-index: 2;
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
    transform: rotate(45deg) translate(7px, 7px);
  }
  .burger-open span:nth-child(2) {
    opacity: 0;
  }
  .burger-open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }
  .navigation {
    z-index: 1;
    display: none;
    position: fixed;
    top: 60px;
    right: 2rem;
    padding-right: 3rem;
    width: 20%;
    flex-direction: column;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    line-height: 3rem;
  }
  .navigation-open {
    display: flex;
  }
  .navigation ul {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
