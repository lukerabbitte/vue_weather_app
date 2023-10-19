<script setup>

    import { useLangStore } from '@/stores/lang'
    const lang = useLangStore()

</script>

<template>
    <nav class="navbar">
        <h1>Weather App</h1>
        <div class="i18n-button">
            <span role="img" aria-label="Earth Emoji" style="font-size: 25px;">🌍</span>
            <button class="toggle-button" @click="lang.toggle">{{ lang.current }}</button>
        </div>
    </nav>
</template>

<style scoped>
    .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        background-color: var(--color-header);
        position: fixed;
        height: 70px;
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