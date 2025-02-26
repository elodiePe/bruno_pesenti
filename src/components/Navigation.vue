<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>
<template>
    
  <div class="navigation">
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
.one:hover{
    background-color: #e0e0e0;
}
.two:hover{
    background-color: #e0e0e0;
}
.three:hover{
    background-color: #e0e0e0;
}
.four:hover{
    background-color: #e0e0e0;
}
.five:hover{
    background-color: #e0e0e0;
}
</style>
