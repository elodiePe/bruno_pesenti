<template>
    <div class="boxes">
    <div class="box">
      <h1>Oups!!</h1>
      <p>
        Toutes mes excuses, cette page n'existe plus
      </p>
      <div class="router">        <RouterLink to="/">Retour à l'accueil</RouterLink>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router';
  </script>
  
  <style scoped>
.router {
    text-decoration: none;
    background-color: #4c6a65;
    cursor: pointer;
    border-radius: 10px;
    padding: 10px;
    width: 15%;
    }
    .router:hover {
    background-color: #6c8a85;
    }
  </style>