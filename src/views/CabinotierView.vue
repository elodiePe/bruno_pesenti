<template>
  <div class="boxes">
    <div class="box">
      <h1>{{ $t("cabinotiers.title") }}</h1>
      <div class="introduction">
        <section>
          <p v-html="$t('cabinotiers.description')"></p>

          <div class="buttons">
            <RouterLink class="five" to="/catalogue">{{
              $t("cabinotiers.buttons.catalogue")
            }}</RouterLink>
            <RouterLink class="four" to="/exposition">{{
              $t("cabinotiers.buttons.exposition")
            }}</RouterLink>
          </div>
        </section>
        <img
          src="../assets/img/cabinotierimg.png"
          alt="illustration qui illustre des cabinotiers qui travaillent"
        />
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
  background-color:#4c6a65;
  text-decoration: none;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 4px;
  font-family: Arial, sans-serif;
}
.four {
  background-color:#deb887;
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
.four:hover {
  background-color: #e0e0e0;
  text-decoration: none;
}


</style>
