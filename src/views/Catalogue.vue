<template>
  <div class="boxes">
    <div class="box">
      <h1 v-html="$t('catalogue.title')"> </h1>
      <div class="introduction">
        <section>
          <p v-html="$t('catalogue.description')"></p>
          <p>{{ $t("catalogue.description2") }} 
            <RouterLink to="/contact">{{ $t("catalogue.textLink") }}</RouterLink>
          </p>
        </section>

        <img
          src="../assets/img/catalogue_img.png"
          alt="illustration qui illustre des cabinotiers qui travaillent"
        />
      </div>
    </div>
  </div>
</template>
