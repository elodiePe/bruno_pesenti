<template>
  <div class="cookie-consent-banner" id="cookieConsentBanner">
    <div>
      <h1>Politique de Cookies</h1>
      <p>
        Mon site web utilise des cookies pour améliorer votre expérience et
        analyser le trafic. J'utilise Google Analytics afin de savoir combien de
        personnes visitent mon site, et d'où elles viennent.
      </p>
      <h2>Cookies Google Analytics</h2>
      <p>
        Google Analytics est un service d'analyse de site internet fourni par
        Google Inc. ("Google"). Google utilise les données collectées pour
        suivre et examiner l'utilisation de notre site web, pour préparer des
        rapports sur ses activités et les partager avec d'autres services
        Google.
      </p>
      <h2>Consentement</h2>
      <p>
        En acceptant, vous acceptez l'utilisation de cookies. Vous pouvez
        changez d'avis en allant voir le pied de page du site web
      </p>
      <p>
        Pour plus d'informations sur les cookies utilisés par Google Analytics,
        vous pouvez consulter la
        <a
          href="https://policies.google.com/technologies/cookies"
          target="_blank"
          >politique de confidentialité de Google</a
        >.
      </p>
      <button @click="declineCookies">Refuser</button>
      <button @click="acceptCookies">Accepter</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch} from 'vue';

const checkConsent = ref(null);
const consentStatus = ref("");
watch(consentStatus, (value) => {
  localStorage.setItem("cookieConsent", value);
window.location.reload();
  
});
onMounted(() => {
  checkConsent.value = checkCookieConsent();
  if (localStorage.getItem("cookieConsent") === null) {
    document.getElementById("cookieConsentBanner").style.display = "block";
  } else if (localStorage.getItem("cookieConsent") === "accepted") {
    activateGoogleAnalytics();
  }
});

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
