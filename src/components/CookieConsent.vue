<template>
  <div class="cookie-consent-banner" id="cookieConsentBanner">
    <div>
      <h1> {{ $t('cookiePolicy.title') }}</h1>
      <p>
       {{ $t('cookiePolicy.description') }}
      </p>
      <h2>{{ $t('cookiePolicy.title2') }}</h2>
      <p>
        {{ $t('cookiePolicy.description2') }}
      </p>
      <h2>{{ $t('cookiePolicy.title3') }}</h2>
      <p>
        {{ $t('cookiePolicy.description3') }}
      </p>
      <p>
        {{ $t('cookiePolicy.more') }}
        <a
          href="https://policies.google.com/technologies/cookies"
          target="_blank"
          >politique de confidentialité de Google</a
        >.
      </p>
      <button @click="declineCookies">{{ $t('cookiePolicy.buttons.decline') }}</button>
      <button @click="acceptCookies">{{ $t('cookiePolicy.buttons.accept') }}</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch} from 'vue';

const checkConsent = ref(null);
const consentStatus = ref("");
// watch(consentStatus, (value) => {
//   localStorage.setItem("cookieConsent", value);
// window.location.reload();
  
// });
// onMounted(() => {
//   checkConsent.value = checkCookieConsent();
//   if (localStorage.getItem("cookieConsent") === null) {
//     document.getElementById("cookieConsentBanner").style.display = "block";
//   } else if (localStorage.getItem("cookieConsent") === "accepted") {
//     activateGoogleAnalytics();
//   }
// });

// Fonction pour accepter les cookies
function acceptCookies() {
  localStorage.setItem("cookieConsent", "accepted");
  consentStatus.value = "accepted";
  document.getElementById("cookieConsentBanner").style.display = "none";
  checkCookieConsent();
  // Activer Google Analytics
  activateGoogleAnalytics();
}

// Fonction pour refuser les cookies
function declineCookies() {
  localStorage.setItem("cookieConsent", "declined");
  consentStatus.value = "declined";
  document.getElementById("cookieConsentBanner").style.display = "none";
  checkCookieConsent();
}
function renderCookieConsentBanner() {
  var banner = document.getElementById("cookieConsentBanner");
  banner.style.display = "block";
}


// Vérifier si l'utilisateur a déjà donné son consentement
window.onload = function () {
  checkCookieConsent();
  if (localStorage.getItem("cookieConsent") === null) {
    document.getElementById("cookieConsentBanner").style.display = "block";
  } else if (localStorage.getItem("cookieConsent") === "accepted") {
    // Activer Google Analytics si le consentement est déjà donné
    activateGoogleAnalytics();
  }
};

// Fonction pour vérifier le consentement aux cookies
function checkCookieConsent() {
  var consentStatus = localStorage.getItem("cookieConsent");
  var consentMessage = "";

  if (consentStatus === "accepted") {
    consentMessage = "Vous avez accepté les cookies : modifier";
  } else if (consentStatus === "declined") {
    consentMessage = "Vous avez refusé les cookies : modifier";
  } else {
    consentMessage =
      "Vous n'avez pas encore donné votre consentement pour les cookies : modifier";
  }

//   document.getElementById("cookieConsentStatus").innerText = consentMessage;
}

// Fonction pour activer Google Analytics
function activateGoogleAnalytics() {
  // Créer un élément script pour charger Google Analytics
  var script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-WWGQ6ML999"; // Remplacez 'UA-XXXXXX-X' par votre identifiant de suivi Google Analytics
  script.async = true;
  document.head.appendChild(script);

  // Initialiser Google Analytics après le chargement du script
  script.onload = function () {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-WWGQ6ML999"); // Remplacez 'UA-XXXXXX-X' par votre identifiant de suivi Google Analytics
  };
}

</script>
