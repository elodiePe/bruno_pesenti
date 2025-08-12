<template>
  <div class="boxes">
    <div class="box">
      <div>
        <h1>{{ $t("Newsletter.unsubscribing.title") }}</h1>
        <p>{{ $t("Newsletter.unsubscribing.description") }}</p>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email" style="margin-right: 10px">{{
              $t("Newsletter.unsubscribing.label")
            }}</label>
            <input
              v-model="formData.email"
              name="email"
              placeholder="Antoine.john@gmail.com"
            />
          </div>
          <button type="submit" class="submit-btn">
            {{ $t("Newsletter.unsubscribing.button") }}
          </button>
          <p v-if="successMessage" class="success-message">
            {{ $t("Newsletter.unsubscribing.successMessage") }}
          </p>
          <p v-if="errorMessage" class="error-message">
            {{ $t("Newsletter.unsubscribing.errorMessage") }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { errorMessages } from "vue/compiler-sfc";

const formData = ref({
  name: "",
  email: "",
});
const successMessage = ref("");
const errorMessage = ref("");
function handleSubmit() {
  const url =
    "https://script.google.com/macros/s/AKfycbzjEngEt4UANtQ6iOZu8RN0WCIuv6NFx2SVeMjfR0qNwmhtldKeSgcrVj_ij21LD3tr/exec"; // Remplace par ton URL
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=supprimer&Email=${encodeURIComponent(formData.value.email)}`,
  })
    .then((res) => {
      return res.text();
    })

    .then((data) => {
      alert(data);
    })
    .catch((error) => {
      console.log(error);
    
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
