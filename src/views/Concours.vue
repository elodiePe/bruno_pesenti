<template>
  <div class="boxes">
      <div class="box">
      <h1>{{ $t("concours.title") }}</h1>
          <!-- <p >{{ $t("concours.dates") }}</p> -->
      <p v-html="$t('concours.description') + ' - ' + $t('concours.dates')"></p>
      <p>{{ $t("concours.rules") }}</p>
              <button
                type="button"
                class="submit-btn2"
                @click="scrollToForm"
              >
                {{ $t("concours.cta2") }}
              </button>

      <p>{{ $t("concours.questions") }}</p>
       <img src="../assets/img/concours.png" alt=""></img>
    </div>
    <div class="box">
      <h1>{{ $t("concours.form.title") }}</h1>
      <form @submit.prevent="sendEmail" class="contact-form">
        <div class="form-group">
          <label for="name">{{ $t("concours.form.name") }} *</label>
          <input v-model="formData.name" id="name" name="name" required placeholder="Antoine John" />
        </div>
        <div class="form-group">
          <label for="email">{{ $t("concours.form.email") }} *</label>
          <input v-model="formData.email" id="email" name="email" type="email" required placeholder="exemple@email.com" />
        </div>
        <div class="form-group">
          <label for="reveils">{{ $t("concours.form.reveils") }} *</label>
          <input v-model="formData.reveils" id="reveils" name="reveils" type="number" min="0" required />
        </div>
        <div class="form-group" style="flex-direction: row">
          <input type="checkbox" id="privacy" v-model="formData.privacyAccepted" required style="width: 20px; height: 20px; margin-right: 10px" />
          <label for="privacy">  <RouterLink class="six" to="/confidentialite" target="_blank">
              {{ $t("contact.Form.privacy") }} 
            </RouterLink> {{ $t("concours.form.politics1") }} <RouterLink class="six" to="/concourspolitique" target="_blank">
              {{ $t("concours.form.politics") }}
            </RouterLink> {{ $t("concours.form.politics2") }} *</label>
        </div>

                <p>* {{ $t("concours.form.required") }}</p>

        <button type="submit" class="submit-btn">{{ $t("concours.form.send") }}</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successNewsletter" class="success-message">{{ successNewsletter }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </form>
    </div>
      <div class="boxess">
<h1>Comment participer au concours ?</h1>
<div class="steps">
    <div class="step">
         <h2>{{ $t("concours.steps.step1.title") }}</h2>
    <p>{{ $t("concours.steps.step1.description") }}</p>
    <img src="../assets/img/vitrine.jpeg" alt="" ></img>
    </div>


    <div class="step">
        <h2>{{ $t("concours.steps.step2.title") }}</h2>
        <p>{{ $t("concours.steps.step2.description") }}</p>
    </div>
    <div class="step">
        <h2>{{ $t("concours.steps.step3.title") }}</h2>
        <p>{{ $t("concours.steps.step3.description") }}</p>
        <p>{{ $t("concours.steps.step3.Newsletter") }}</p>
    </div>


  
   
</div>
  </div>
  </div>

</template>

<script setup>

import { ref } from 'vue';

const successMessage = ref("");
const errorMessage = ref("");
const successNewsletter = ref("");

const formData = ref({
  name: '',
  email: '',
  reveils: '',
  privacyAccepted: false,
});


function sendEmail() {
  const url =
    "https://script.google.com/macros/s/AKfycbyGWKNPnqnWfytNKMg4QP5MAb4Voz9lIXAKh8I7aVer7rjpFCI5seFnFB5wlLcQPb_aww/exec"; // Remplace par ton URL
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=concours&Name=${encodeURIComponent(
      formData.value.name
    )}&Email=${encodeURIComponent(
      formData.value.email
    )}&Reveils=${encodeURIComponent(
      formData.value.reveils
    )}`,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      if (data.success ) {
        successMessage.value = "Votre inscription a bien été envoyée.";
        // formData.value.name = "";
        // formData.value.email = "";
        // formData.value.message = "";
        // formData.value.phone = "";
        // formData.value.privacyAccepted = false;
      } else {
        successMessage.value = "Votre participation a bien été envoyée, vérifiez que vous avez bien reçu un mail de confirmation.";
      }
    })
    .catch((error) => console.log(error));

  // Si la personne a coché oui pour la newsletter
  if (formData.value.privacyAccepted === true) {
    const langue = localStorage.getItem("language") || "fr";

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
          successNewsletter.value = "Votre inscription à la newsletter a bien été envoyée, vérifiez que vous avez bien reçu un mail pour confirmer votre inscription.";
          formData.value.name = "";
          formData.value.email = "";
        } else {
          errorMessage.value =
            "Erreur lors de l'inscription à la newsletter.Vérifiez votre mail ou réessayez.";
        }
      })
      .catch((error) => console.log(error));
       formData.value.name = "";
        formData.value.email = "";
        formData.value.message = "";
        formData.value.reveils = "";
        formData.value.privacyAccepted = false;
  }


}
function scrollToForm() {
  const formElement = document.querySelector('.boxess');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth' });
  }
}

</script>

<style scoped>

.step img {
    width: fit-content;

}
div .box{
    background-color: transparent;
 

}
div img {
    width: 50%;
}
.boxes {
  display: flex;
  /* background: #fff; */
      background: linear-gradient(175deg, #ea9839 65%, #fff 50%);

  width: 100%;
  flex-direction: row;
  gap: 0rem;
  padding-bottom: 1rem;
}

.box {
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
}
.box:first-child {
padding-left: 0;
}
.boxes .box:nth-child(2) {
border-radius: 16px;
  background: #ffffff;
  /* border: 2px solid #ea9839; */
  padding: 0rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  margin-top: 1rem;
}
.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 96%;
}
.form-group input {
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
.submit-btn2{
    width: 100%;
  padding: 0.8rem;

  background: #fff;
  color: #222221;
  border: 2px solid#fff;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}
.submit-btn2:hover {
  border: 2px solid #fff;
  background: #ea9839;
}
.submit-btn {
  width: 100%;
  padding: 0.8rem;

  background: #ea9839;
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
.error-message {
  color: #ff3333;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}
.success-message {
  color: #2ecc40;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}
label{
    text-align: left;
}
.steps{
    /* margin-left: 6rem;
    margin-right: 6rem; */
    display: flex;
    /* flex-wrap: wrap; */
    gap: 2rem;
    justify-content: space-between;
}
.step{
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    padding: 1rem;
padding-top: 0rem;
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition: box-shadow 0.2s;
    border: 1px solid #ea9839;
    height: fit-content;
    }
    .boxess {
      padding-top: 4rem;
  width: 87%;

  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.boxess h1{
  align-items: center;
  text-align: center;
  padding-bottom: 1.5rem;
}

@media (max-width: 1050px) {
    .boxes{
    border-radius: 16px;}
    .steps {
      width: 100%;
      flex-direction: column;
      align-items: center;
    }
    .steps .step {
      /* max-width: 300px; */
      width: 100%;
    }

.box:first-child {
padding-left: 1rem;
}

  .boxess {
    width: 80%;
    flex-direction: column;
    align-items: stretch;
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 7rem;
  }


  }

</style>