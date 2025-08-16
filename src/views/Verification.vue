<template>
      <div class="boxes">
    <div class="box">
    <div>
        <h1>{{ $t("Newsletter.verification.title") }}</h1>
         <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email" style="margin-right: 10px">
              {{ $t("Newsletter.verification.email") }}
            </label>
            <input
              v-model="formData.email"
              name="email"
              type="email"
              required
              placeholder="Antoine.john@gmail.com"
            />
          </div>
          <div class="form-group">
            <label for="code" style="margin-right: 10px">
              {{ $t("Newsletter.verification.code") }}
            </label>
            <input
              v-model="formData.code"
              name="code"
              type="text"
              required
              placeholder="11Sh21"
            />
          </div>

          <button type="submit" class="submit-btn">
        {{ $t("Newsletter.verification.button") }}
          </button>
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
          <p v-if="errorMessage" class="error-message">
            {{ errorMessage}}
          </p>
        </form>
    </div>
    </div>
        </div>


</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
    code: '',
    email: '',
});
const successMessage = ref("");
const errorMessage = ref("");
function handleSubmit() {

    const url = "https://script.google.com/macros/s/AKfycbyzDwjS76lOvhttf-aAF-zd6mrqRKs0hrhKj_teVSaj2HkKjbZXpvnokf93d1ri_U5twg/exec"; // Remplace par ton URL
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=verification&Email=${encodeURIComponent(formData.value.email)}&Code=${encodeURIComponent(formData.value.code)}`
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })

    .then((data) => {
      if (data.success) {
        successMessage.value = "Votre compte a été inscrit avec succès.";
        formData.value.email = ""; // Réinitialise le champ email
        formData.value.code = ""; // Réinitialise le champ code
      } else{
        errorMessage.value = "La vérification n'a pas fonctionné. Vérifiez l'email, le code ou réessayez.";
      }

    })
    .catch((error) => {
      console.log(error);
      errorMessage.value = "Erreur technique, veuillez réessayer.";
      successMessage.value = "";
    
    });
}
</script>
<style scoped>

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
form input:focus {
  border-color: #deb887;
  background: #fff;
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
/* .boxes {
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
    background: #3537391c;
  padding: 0rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  margin-top: 1rem;
} */

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
.submit-btn:hover {
  background: #c7c7c7;
}
</style>