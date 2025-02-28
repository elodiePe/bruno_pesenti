<script setup>
import { ref, onMounted } from "vue";

const checkConsent = ref(null);
const consentStatus = ref(null);

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
    deactivateGoogleAnalytics();
}

function checkCookieConsent() {
    var consent = localStorage.getItem("cookieConsent");

    if (consent === "accepted") {
        checkConsent.value = true;
    } else if (consent === "declined") {
        checkConsent.value = false;
    } else {
        checkConsent.value = null;
    }
}
function deactivateGoogleAnalytics() {
        // Supprimer le script Google Analytics du document
        var script = document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=G-WWGQ6ML999"]');
        if (script) {
            script.remove();
        }

        // Réinitialiser la couche de données de Google Analytics
        if (window.dataLayer) {
            window.dataLayer = [];
        }
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

onMounted(() => {
    checkCookieConsent();
});
</script>

<template>
    <div class="boxes">
        <div class="box">
            <p v-if="checkConsent"> {{ $t('footer.cookies.accepted') }}</p>
            <p v-else> {{ $t('footer.cookies.declined') }}</p>
            <h1>{{ $t("cookiePolicy.title") }}</h1>
            <p>{{ $t("cookiePolicy.description") }}</p>
            <h2>{{ $t("cookiePolicy.title2") }}</h2>
            <p>{{ $t("cookiePolicy.description2") }}</p>
            <h2>{{ $t("cookiePolicy.title3") }}</h2>
            <p>{{ $t("cookiePolicy.description3") }}</p>
            <p>
                {{ $t("cookiePolicy.more") }}
                <a
                    href="https://policies.google.com/technologies/cookies"
                    target="_blank"
                    >politique de confidentialité de Google</a
                >.
            </p>
            <div class="buttons">
                <button v-show="checkConsent === null || checkConsent === false" @click="acceptCookies">{{ $t("cookiePolicy.buttons.accept") }}</button>
                <button v-show="checkConsent === null || checkConsent === true" @click="declineCookies">{{ $t("cookiePolicy.buttons.decline") }}</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.buttons {
    margin-top: 20px;
}

button {
    margin: 0 10px;
    padding: 10px 20px;
    cursor: pointer;
}
</style>
