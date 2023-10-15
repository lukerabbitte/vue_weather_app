<script setup>

import { ref } from 'vue';

const currentLanguage = ref('en');

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'en' ? 'fr' : 'en';
};

</script>

<template>
    <nav class="navbar">
      <button @click="toggleLanguage">{{ currentLanguage }}</button>
    </nav>
</template>