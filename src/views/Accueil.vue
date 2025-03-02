<template>
  <div class="boxes">
    <div class="box">
      <h1>Bruno Pesenti</h1>
      <div class="introduction">

        <p v-html="$t('home.introduction.description')">
        </p>
        <img
          src="../assets/img/bruno.png"
          alt="image de bruno pesenti de dos dans son atelier à Genève"
        />
      </div>
      <h1>{{ $t('home.atelier.title') }}</h1>
      <div class="introduction">
        <p v-html="$t('home.atelier.description')"></p>
        <iframe
          class="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2671.301969766683!2d6.139181811594909!3d46.20678758346663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c654a80b38465%3A0x2e9bab052586a8ed!2sLe%20Cabinotier!5e1!3m2!1sfr!2sch!4v1717845152318!5m2!1sfr!2sch"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </div>
</template>
<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
const lang = localStorage.getItem('language') || 'fr';
</script>
