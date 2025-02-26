<script setup>
import { ref, watch } from "vue";
const consentStatus = ref(localStorage.getItem("cookieConsent") || "unknown");


const consentMessage = ref("");

function updateConsentMessage() {
  if (consentStatus.value === "accepted") {
    consentMessage.value = "Vous avez accepté les cookies";
  } else if (consentStatus.value === "declined") {
    consentMessage.value = "Vous avez refusé les cookies";
  } else {
    consentMessage.value = "Vous n'avez pas encore donné votre consentement pour les cookies";
  }
}


updateConsentMessage();

function openCookies() {
  document.getElementById("cookieConsentBanner").style.display = "block";
  updateConsentMessage();
}

</script>
<template>
  <footer class="footer">
    <ul>
      <li><a href="https://elodieperring.figweb.site/">@Elodie Perring</a></li>
      <li><a href="https://brunopesenti.ch/">Bruno Pesenti</a></li>
      <li >2024</li>
    <li @click="openCookies" id="pointer">{{ consentMessage }}</li>
    </ul>
  </footer>
</template>
  <style scoped>
  #pointer{
    cursor: pointer;
    }
  
</style>
  