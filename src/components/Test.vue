<script setup>

    import { ref, watch } from 'vue';
    import { useCityStore } from '@/stores/city'
    import { useLangStore } from '@/stores/lang'

    const city = useCityStore();
    const limit = 1;
    const latitude = ref(null);
    const longitude = ref(null);

    const fetchGeocodingData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/geocoding?cityName=${city.name}&limit=${limit}`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                latitude.value = data[0].lat;
                longitude.value = data[0].lon;
                console.log('Latitude:', latitude.value);
                console.log('Longitude:', longitude.value);
            } else {
                console.error('No geocoding data available.');
            }
        } catch (error) {
            console.error('Error fetching geocoding data:', error);
        }
    };

    watch(() => city.name, () => {
        fetchGeocodingData();
    });


</script>


<template>
    <h1>The city has been passed to Test.vue as {{ city.name }}.</h1>
    <p>Latitude: {{ latitude }}</p>
    <p>Longitude: {{ longitude }}</p>
</template>