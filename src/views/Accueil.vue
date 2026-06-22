<template>
  <div class="boxes">
  <!-- <Concours /> -->
    <div class="box">
      <section class="shop-banner">
        <p class="shop-banner__eyebrow">{{ $t("home.shopBanner.eyebrow") }}</p>
        <h2>{{ $t("home.shopBanner.title") }}</h2>
        <p>{{ $t("home.shopBanner.description") }}</p>
        <RouterLink class="shop-banner__cta" to="/produits">
          {{ $t("home.shopBanner.cta") }}
        </RouterLink>
      </section>
      <h1>Bruno Pesenti</h1>
      <div class="introduction">
        <p>
          {{ $t("home.introduction.description") }}
          <gr>{{ $t("home.introduction.highlight1") }}</gr>
          {{ $t("home.introduction.description2") }}
          <RouterLink to="/cabinotiers">{{ $t("home.introduction.link1.text") }}</RouterLink>
          <br>
          {{ $t("home.introduction.description3") }}
          <RouterLink to="/exposition">{{ $t("home.introduction.link2.text") }}</RouterLink>
          <gr>{{ $t("home.introduction.highlight2") }}</gr>
        </p>

     

        <img
          src="../assets/img/bruno.png"
          alt="image de bruno pesenti de dos dans son atelier à Genève"
        />
      </div>
      <h1>{{ $t("home.atelier.title") }}</h1>
      <div class="introduction">
        <p v-html="$t('home.atelier.description')"> </p>
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
import CustomLink from "../components/CustomLink.vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import Concours from "../components/Concours.vue";
const lang = localStorage.getItem("language") || "fr";
</script>

<style scoped>
.shop-banner {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #d9c2a0;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(222, 184, 135, 0.18), rgba(76, 106, 101, 0.08));
  text-align: left;
}

.shop-banner__eyebrow {
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4c6a65;
}

.shop-banner h2 {
  margin: 0 0 0.75rem;
  font-size: 1.6rem;
  color: #2f2f2f;
}

.shop-banner p {
  margin: 0 0 1rem;
  color: #444;
}

.shop-banner__cta {
  display: inline-block;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: #4c6a65;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
}

.shop-banner__cta:hover {
  background: #3f5a56;
}

@media (max-width: 640px) {
  .shop-banner {
    padding: 1.1rem;
  }

  .shop-banner h2 {
    font-size: 1.3rem;
  }
}
</style>
