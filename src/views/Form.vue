<template>
      <div class="boxes">
    <div class="box">
    <div>
        <h1>React to Sheet</h1>
        <form @submit.prevent="handleSubmit">
            <input v-model="formData.name" name="name" placeholder="Name 1" /> <br/>
            <input v-model="formData.email" name="email" placeholder="Email 1" /> <br/>
            <button type="submit">Add</button>
        </form>
    </div>
    </div>
        </div>


</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
    name: '',
    email: '',
});

function handleSubmit() {
    const langue = localStorage.getItem('language');
    const url = "https://script.google.com/macros/s/AKfycbzjEngEt4UANtQ6iOZu8RN0WCIuv6NFx2SVeMjfR0qNwmhtldKeSgcrVj_ij21LD3tr/exec"; // Remplace par ton URL
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `Name=${encodeURIComponent(formData.value.name)}&Email=${encodeURIComponent(formData.value.email)}&Langue=${encodeURIComponent(langue)}`
    })
        .then(res => res.text())
        .then(data => {
            alert(data);
        })
        .catch(error => console.log(error));
}
</script>
