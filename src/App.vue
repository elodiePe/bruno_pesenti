<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import Navigation from "./components/Navigation.vue";
import Footer from "./components/Footer.vue";
import CookieConsent from "./components/CookieConsent.vue";
import Header from "./components/Header.vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";



</script>
<template>
  <CookieConsent></CookieConsent>
<Header></Header>
  <section class="informations">
    <Navigation></Navigation>
    
    <RouterView />
    <Footer></Footer>
  </section>
</template>
