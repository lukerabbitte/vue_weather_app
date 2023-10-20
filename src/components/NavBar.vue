<script setup>
    import { useLangStore } from '@/stores/lang'
    const lang = useLangStore();
    
    import { useDark, useToggle } from "@vueuse/core";
    const isDark = useDark(); 
    const toggleDark = useToggle(isDark);
</script>

<template>
    <nav class="navbar">
        <h1>Weather App</h1>

        <div class="buttons">
            <div class="i18n-button">
                <span role="img" aria-label="Earth Emoji" style="font-size: 25px;">🌍</span>
                <button class="toggle-button" @click="lang.toggle">{{ lang.current === 'EN' ? 'English' : 'Français' }}</button>
            </div>

            <div class="dark-mode-button">
                <span v-if="isDark" role="img" aria-label="Dark Emoji" style="font-size: 25px;">🌙</span>
                <span v-else role="img" aria-label="Dark Emoji" style="font-size: 25px;">☀️</span>
                <button class="toggle-button" @click="toggleDark()">{{ isDark ? 'Dark' : 'Light' }}</button>
            </div>
        </div>

    </nav>
</template>

<style scoped>
    .navbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        background-color: var(--color-header);
        position: fixed;
        height: var(--nav-bar-height);
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
    }

    .buttons {
        margin-right: 25px;
        display: flex;
        justify-content: space-between;
    }

    .i18n-button {
        display: flex;
        align-items: center;
    }

    .dark-mode-button {
        display: flex;
        align-items: center;
        margin-left: 5px;
    }

    .toggle-button {
        border: none;
        background: none;
        color: var(--color-text);
        cursor: pointer;
        font-size: 16px;
    }

    .toggle-button:hover {
        outline: none;
        color: #f0f0f0;
    }  


</style>