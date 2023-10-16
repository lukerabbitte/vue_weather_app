<script setup>

import { ref } from 'vue';

const currentLanguage = ref('EN');

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'EN' ? 'FR' : 'EN';
};

</script>

<template>
    <nav class="navbar">
        <h1>Weather App</h1>
        <div class="i18n-button">
            <span role="img" aria-label="Earth Emoji" style="font-size: 25px;">🌍</span>
            <button class="toggle-button" @click="toggleLanguage">{{ currentLanguage }}</button>
        </div>
    </nav>
</template>

<style>

    .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background-color: #1f2b28;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    }

    .i18n-button {
        display: flex;
        align-items: center;
    }

    .toggle-button {
        border: none;
        background: none;
        color: #A1A5A4;
        cursor: pointer;
        font-size: 16px;
    }

    .toggle-button:hover {
        outline: none;
        color: #f0f0f0;
    }

</style>