<template>
  <div class="boxes">
    <div class="box">
      <h1>{{ $t("exposition.title") }}</h1>

      <div class="introduction">
        <section>
          <p v-html="$t('exposition.description')"></p>
          <div class="buttons">
     
            <RouterLink class="five" to="/contact">{{
              $t("exposition.contact")
            }}</RouterLink>

          </div>


        </section>

        <iframe
          class="video"
          src="https://www.youtube.com/embed/bK8IWSjpMBA"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>
<style scoped>
div.buttons {
  display: flex;
  flex-direction: row;
gap: 10px;
  width: 50%;
  margin-top: 20px;
}

.five {
  background-color: #deb887;
  text-decoration: none;
  color: #000000;
  padding: 5px 10px;
  border-radius: 4px;
  font-family: Arial, sans-serif;
}
.five:hover {
  background-color: #e0e0e0;
  text-decoration: none;
}

</style>
