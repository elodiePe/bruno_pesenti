<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";

const { t, locale } = useI18n();
const consentStatus = ref(localStorage.getItem("cookieConsent") || "unknown");

const consentMessage = ref("");

function updateConsentMessage() {
  if (consentStatus.value === "accepted") {
    consentMessage.value = t("footer.cookies.accepted");
  } else if (consentStatus.value === "declined") {
    consentMessage.value = t("footer.cookies.declined");
  } else {
    consentMessage.value = t("footer.cookies.other");
  }
}
watch(locale, updateConsentMessage);

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
      <li>2024</li>
      <li><RouterLink to="/cookies">cookies</RouterLink></li>
      <li>
        <RouterLink class="six" to="/confidentialite">{{
          $t("confidentiality.title")
        }}</RouterLink>
      </li>
      <li>
        <a
          id="newsletter-link"
          href="#"
          @click.prevent="$emit('open-newsletter')"
        >
          {{ $t("Newsletter.subscribing.title") }}
        </a>
      </li>
      <!-- <li>
        <RouterLink class="six" to="/desinscription">{{
          $t("Newsletter.unsubscribing.title")
        }}</RouterLink>
      </li> -->

      <li>
        <a
          href="https://fr.tripadvisor.ch/Attraction_Review-g188057-d33001420-Reviews-Lecabinotier-Geneva.html'"
          target="_blank"
        >
          <img
            src="../assets/img/tripadvisor.png"
            alt="TripAdvisor"
            style="height: 20px"
          />
        </a>
      </li>
    </ul>
  </footer>
</template>
<style scoped>
#pointer {
  cursor: pointer;
}
</style>
