<template>
  <div class="boxes">
    <div class="box">
      <h1 v-html="$t('catalogue.title')"> </h1>
      <div class="introduction">
        <p v-html="$t('catalogue.description')"> </p>
        <img
          src="../assets/img/catalogue_img.png"
          alt="illustration qui illustre des cabinotiers qui travaillent"
        />
      </div>
    </div>
  </div>
</template>
