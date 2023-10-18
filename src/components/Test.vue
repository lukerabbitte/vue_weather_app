<script setup>

    import { useLangStore } from '@/stores/lang'
    import { useCityStore } from '@/stores/city'

    const city = useCityStore();

</script>

<template>
    <h1>The city has been passed to Test.vue as {{ city.name }}.</h1>
</template>