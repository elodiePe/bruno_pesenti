<script setup>
import { ref, onMounted } from "vue";
import { disableGoogleAnalytics, enableGoogleAnalytics } from "../utils/googleAnalytics";

const checkConsent = ref(null);
const consentStatus = ref(null);

function getCookieConsent() {
    return localStorage.getItem("cookieConsent") === "accepted";
}

function clearAllStorageAndCookies() {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
}

function acceptCookies() {
    localStorage.setItem("cookieConsent", "accepted");
    consentStatus.value = "accepted";
    
    document.getElementById("cookieConsentBanner").style.display = "none";
    checkCookieConsent();
    activateGoogleAnalytics();
}

function declineCookies() {
    disableGoogleAnalytics();
    clearAllStorageAndCookies();
    consentStatus.value = "declined";
    document.getElementById("cookieConsentBanner").style.display = "none";
    checkCookieConsent();
    deactivateGoogleAnalytics();
}

function checkCookieConsent() {
    let consent = localStorage.getItem("cookieConsent");
    if (consent === "accepted") {
        checkConsent.value = true;
    } else {
        checkConsent.value = false;
        clearAllStorageAndCookies();
    }
}
function deactivateGoogleAnalytics() {
        disableGoogleAnalytics();
    }
// Fonction pour activer Google Analytics
function activateGoogleAnalytics() {
    enableGoogleAnalytics(window.location.pathname + window.location.search);
}

onMounted(() => {
    checkCookieConsent();
    if (!getCookieConsent()) {
        clearAllStorageAndCookies();
    }
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
