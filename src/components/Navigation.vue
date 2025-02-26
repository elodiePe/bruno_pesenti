<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';

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
        <RouterLink class="one" to="/">Accueil</RouterLink>
      </li>
      <li class="navText">
        <RouterLink class="two" to="/exposition">Exposition</RouterLink>
      </li>
      <li class="navText">
        <RouterLink class="three" to="/cabinotiers">Cabinotiers</RouterLink>
      </li>
      <li class="navText">
        <RouterLink class="four" to="/catalogue">Catalogue</RouterLink>
      </li>
      <li class="navText">
        <RouterLink class="five" to="/contact">Contact</RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.navText .router-link-exact-active {
  background-color: #f0f0f0;
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
