<template>
<div class="boxes">
        <div class="box">
          <h1>{{ $t('exposition.title') }}</h1>

          <div class="introduction">
            <p v-html="$t('exposition.description')"> </p>

            <iframe
              class="video"
              src="https://www.youtube.com/embed/bK8IWSjpMBA"
              frameborder="0"
            ></iframe>
          </div>
        </div>
        </div>
</template>