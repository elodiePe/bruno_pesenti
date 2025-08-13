<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import Navigation from "./components/Navigation.vue";
import Footer from "./components/Footer.vue";
import CookieConsent from "./components/CookieConsent.vue";
import Header from "./components/Header.vue";
import { useI18n } from "vue-i18n";
import { errorMessages } from "vue/compiler-sfc";
const formData = ref({
  name: "",
  email: "",
});

const errorMessage = ref("");
const showNewsletterPopup = ref(false);

function openNewsletterPopup() {
  showNewsletterPopup.value = true;
  sessionStorage.removeItem("newsletterClosed");
}

defineExpose({ openNewsletterPopup }); // <-- expose la fonction

onMounted(() => {
  // Show popup after 3 seconds (only if not already closed in this session)
  if (!sessionStorage.getItem("newsletterClosed")) {
    setTimeout(() => {
      showNewsletterPopup.value = true;
    }, 3000);
  }
});
function handleSubmit() {
  const langue = localStorage.getItem("language");
  const url =
    "https://script.google.com/macros/s/AKfycbwy814udc3xW5Iqi0-ksKoQwKelXMUKnLq4rFBr5ZWtEi3vY8jZpkLq_kem76-mDIW3/exec"; // Remplace par ton URL
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `Name=${encodeURIComponent(
      formData.value.name
    )}&Email=${encodeURIComponent(
      formData.value.email
    )}&Langue=${encodeURIComponent(langue)}`,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        formData.value.name = "";
        formData.value.email = "";
        closeNewsletterPopup(); // <-- Ferme le popup après soumission
      } else {
        errorMessage.value =  "Erreur lors de l'inscription à la newsletter.Vérifiez votre mail ou réessayez.";
      }
  
    })
    .catch((error) => console.log(error));
  
}

function closeNewsletterPopup() {

  errorMessage.value = "";
  
  formData.value.name = "";
  formData.value.email = "";
  showNewsletterPopup.value = false;
  sessionStorage.setItem("newsletterClosed", "1");
}
</script>

<template>
  <CookieConsent />
  <Header />
  <section class="informations">
    <Navigation />
    <RouterView />
    <Footer @open-newsletter="openNewsletterPopup" />
  </section>

  <!-- Newsletter Popup -->
  <div v-if="showNewsletterPopup" class="newsletter-popup">
    <div class="newsletter-content">
      <button class="close-btn" @click="closeNewsletterPopup">×</button>
      <h2>{{ $t("Newsletter.subscribing.title") }}</h2>
      <p>{{ $t("Newsletter.subscribing.description") }}</p>
      <!-- Replace this form with your Mailchimp/Brevo/Google Form if needed -->
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input
            v-model="formData.name"
            name="name"
            placeholder="Antoine John"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="formData.email"
            name="email"
            placeholder="antoine.john@gmail.com"
            required
          />
        </div>
           <div class="form-group" style="flex-direction: row">
          <input
            type="checkbox"
            id="privacy"
            v-model="formData.privacyAccepted"
            style="width: 20px; height: 20px; margin-right: 10px"
            required
          />
           <label for="privacy">
            <RouterLink class="six" to="/confidentialite">
              {{ $t("contact.Form.privacy") }} *
            </RouterLink>
          </label>
           </div>
   <p v-if="errorMessage" class="error-message">
            {{ errorMessage}}
          </p>
        <button type="submit" class="submit-btn">{{ $t("Newsletter.subscribing.button") }}</button>
      </form>
      
    </div>
  </div>
</template>

<style scoped>
form .form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 96%;
}
form .form-group input {
  width: 100%;
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  padding-left: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #4c6a6523;
  font-size: 1rem;
  outline: none;
}
.form-group input {
  width: 80%;
}
.submit-btn {
  width: 100%;
  padding: 0.8rem;
  background: #deb887;
  color: #fff;
  border: #deb887;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}
.submit-btn:hover {
  background: #c7c7c7;
}
.newsletter-popup {
  position: fixed;
  z-index: 9999;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.newsletter-content {
  background: #fff;
  border-radius: 14px;
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  box-shadow: 0 8px 32px #0002;
  max-width: 350px;
  width: 90%;
  text-align: center;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: #888;
}
.newsletter-form button:hover {
  background: #a04e0a;
}
.error-message {
  color: #ff3333;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}
</style>
