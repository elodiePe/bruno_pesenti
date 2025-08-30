<template>
  <div class="boxes">
    <div class="box">
      <h1>{{ $t("contact.title") }}</h1>
      <p>{{ $t("contact.description") }}</p>
      <p>
        <strong>{{ $t("contact.phone") }}</strong>
        <a href="tel:022-731-75-75">022 731 75 75</a>
      </p>
      <p>
        <strong>{{ $t("contact.address") }}</strong>
        {{ $t("contact.addressDetails") }}
      </p>
       <iframe
          class="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2671.301969766683!2d6.139181811594909!3d46.20678758346663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c654a80b38465%3A0x2e9bab052586a8ed!2sLe%20Cabinotier!5e1!3m2!1sfr!2sch!4v1717845152318!5m2!1sfr!2sch"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
    </div>
    <div class="box">
      <h2>{{ $t("contact.Form.title") }}</h2>
      <form @submit.prevent="sendEmail" class="contact-form">
        <div class="form-group">
          <label for="name">{{ $t("contact.Form.name") + "*" }}</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            placeholder="Antoine John"
            required
          />
        </div>
        <div class="form-group">
          <label for="phone">{{ $t("contact.Form.phone") }}</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            placeholder="+41 78 234 12 11"
          />
        </div>
        <div class="form-group">
          <label for="email">{{ $t("contact.Form.email") + "*" }}</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            placeholder="exemple@email.com"
            required
          />
        </div>
        <div class="form-group">
          <label for="message">{{ $t("contact.Form.message") + "*" }} </label>
          <textarea id="message" v-model="formData.message" required></textarea>
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
            <RouterLink class="six" to="/confidentialite" target="_blank">
              {{ $t("contact.Form.privacy") }} *
            </RouterLink>
          </label>
        </div>
        <div
          class="form-group"
          style="flex-direction: row; align-items: center"
        >
          <label style="margin-right: 10px">{{
            $t("contact.Form.newsletter.text")
          }}</label>
          <input
            type="radio"
            id="newsletter-yes"
            value="true"
            v-model="formData.newsletter"
            style="width: 20px; height: 20px; margin-right: 5px"
          />
          <label for="newsletter-yes" style="margin-right: 15px">{{
            $t("contact.Form.newsletter.yes")
          }}</label>
          <input
            type="radio"
            id="newsletter-no"
            value="false"
            v-model="formData.newsletter"
            style="width: 20px; height: 20px; margin-right: 5px"
          />
          <label for="newsletter-no">{{
            $t("contact.Form.newsletter.No")
          }}</label>
        </div>
        <p>* {{ $t("contact.Form.required") }}</p>
        <button type="submit" class="submit-btn">
          {{ $t("contact.Form.send") }}
        </button>
        <p v-if="successMessage" class="success-message">
          {{ successMessage }}
        </p>
        <p v-if="successNewsletter" class="success-message">
          {{ successNewsletter }}
        </p>
        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import emailjs from "emailjs-com";
import { RouterLink } from "vue-router";

const formData = ref({
  name: "",
  email: "",
  message: "",
  phone: "",
  privacyAccepted: false,
  newsletter: true,
});

const successMessage = ref("");
const errorMessage = ref("");
const successNewsletter = ref("");
function sendEmail() {
  const url =
    "https://script.google.com/macros/s/AKfycbx5WQsbUU1y0VLMkc4xvTouayxvDJTHje_tvtxAu9vIzRxptY1qgshOXQ8eHme4VNdkbQ/exec"; // Remplace par ton UR
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=demande&Name=${encodeURIComponent(
      formData.value.name
    )}&Email=${encodeURIComponent(
      formData.value.email
    )}&Message=${encodeURIComponent(
      formData.value.message
    )}&Phone=${encodeURIComponent(formData.value.phone)}`,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      if (data.successFirstemail && data.successSecondemail) {
        successMessage.value = "Votre message a été envoyé avec succès";
        // formData.value.name = "";
        // formData.value.email = "";
        // formData.value.message = "";
        // formData.value.phone = "";
        // formData.value.privacyAccepted = false;
      } else {
        errorMessage.value = "Erreur lors de l'envoi du message";
      }
    })
    .catch((error) => console.log(error));

  // Si la personne a coché oui pour la newsletter
  if (formData.value.newsletter === true) {
    const langue = localStorage.getItem("language");

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
          successNewsletter.value = "Votre inscription à la newsletter a bien été envoyée, vérifiez que vous avez bien reçu un mail pour confirmer votre inscription.";
        } else {
          errorMessage.value =
            "Erreur lors de l'inscription à la newsletter.Vérifiez votre mail ou réessayez.";
        }
      })
      .catch((error) => console.log(error));
       formData.value.name = "";
        formData.value.email = "";
        formData.value.message = "";
        formData.value.phone = "";
        formData.value.privacyAccepted = false;
  }


}
</script>

<style scoped>
.boxes {

  display: flex;
  background: #fff;
  width: 100%;
  flex-direction: row;
  gap: 0rem;
  padding-bottom: 1rem;
}

.box {
  padding: 2.5rem 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
}
.boxes .box:nth-child(2) {
  background: #3537391c;
  padding: 0rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  margin-top: 1rem;
}
h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #222;
  font-weight: 700;
  letter-spacing: 1px;
}

form .form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 96%;
}

form label {
  display: block;
  margin-bottom: 0.4rem;
  color: #444;
  font-weight: 500;
}

form .form-group input,
form textarea {
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

form input:focus,
form textarea:focus {
  border-color: #deb887;
  background: #fff;
}

form textarea {
  min-height: 90px;
  resize: vertical;
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

.success-message {
  color: #22bb33;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}

.error-message {
  color: #ff3333;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}
@media (max-width: 1050px) {
    .boxes{
    border-radius: 16px;
    padding-bottom: 0%;
    }
}
</style>
