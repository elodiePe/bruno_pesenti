<template>
  <div class="boxes">
  <!-- <Concours /> -->
    <div class="box">
      <section class="concours-banner">
        <div class="concours-banner__text">
          <p class="concours-banner__eyebrow">{{ $t("home.concoursBanner.eyebrow") }}</p>
          <h2>{{ $t("home.concoursBanner.title") }}</h2>
          <p>{{ $t("home.concoursBanner.description") }}</p>
          <RouterLink class="concours-banner__cta" :to="`/${lang}/concours`">
            {{ $t("home.concoursBanner.cta") }}
          </RouterLink>
        </div>
        <img
          class="concours-banner__img"
          src="../assets/img/image.png"
          alt="Montre de poche genevoise de la fin du XIXe siècle à gagner"
        />
      </section>

      <h1>Bruno Pesenti</h1>
      <div class="introduction">
        <p>
          {{ $t("home.introduction.description") }}
          <gr>{{ $t("home.introduction.highlight1") }}</gr>
          {{ $t("home.introduction.description2") }}
          <RouterLink :to="`/${lang}/cabinotiers`">{{ $t("home.introduction.link1.text") }}</RouterLink>
          <br>
          {{ $t("home.introduction.description3") }}
          <RouterLink :to="`/${lang}/exposition`">{{ $t("home.introduction.link2.text") }}</RouterLink>
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
.concours-banner {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 2px solid #ea9839;
  border-radius: 16px;
  background: #ea9839;
  color: #222221;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.concours-banner__text {
  flex: 1;
}

.concours-banner__img {
  width: 90%;
  max-width: 400px;
  border-radius: 12px;
  object-fit: cover;
}

.concours-banner__eyebrow {
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
}

.concours-banner h2 {
  margin: 0 0 0.75rem;
  font-size: 1.6rem;
  color: #222221;
}

.concours-banner p {
  margin: 0 0 1rem;
  color: #222221;
}

.concours-banner__cta {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  background: #fff;
  color: #222221;
  text-decoration: none;
  font-weight: 700;
  border: 2px solid #fff;
}

.concours-banner__cta:hover {
  background: transparent;
  color: #fff;
}

@media (max-width: 640px) {
  .concours-banner {
    padding: 1.1rem;
    flex-direction: column;
    text-align: center;
  }

  .concours-banner h2 {
    font-size: 1.3rem;
  }

  .concours-banner__img {
    width: 80%;
  }
}
</style>
