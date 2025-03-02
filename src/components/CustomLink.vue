<template>
    <span v-html="processedContent"></span>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    content: {
      type: String,
      required: true,
    },
  });
  
  const router = useRouter();
  
  const processedContent = computed(() => {
    return props.content.replace(/<routerLink='([^']+)'>([^<]+)<\/routerLink>/g, (match, path, text) => {
      return `<a href="${router.resolve(path).href}">${text}</a>`;
    });
  });
  </script>