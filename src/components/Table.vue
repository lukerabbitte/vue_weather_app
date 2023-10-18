<script setup>
    import { ref } from 'vue';
    import { useLangStore } from '@/stores/lang'
    import { useCityStore } from '@/stores/city'

    const lang = useLangStore();
    const city = useCityStore();
    const limit = 1;
    
    const latitude = ref(null);
    const longitude = ref(null);

    const fetchGeocodingData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/geocoding?cityName=${city.name}&limit=${limit}`);
            const data = await response.json();
            console.log(data);

            if (Array.isArray(data) && data.length > 0) {
                latitude.value = data[0].lat;
                longitude.value = data[0].lon;
                console.log("fetch test")
                console.log(latitude.value, longitude.value);
            } else {
                console.error('No geocoding data available.');
                latitude.value = "unknown";
                longitude.value = "unknown";
            }
        } catch (error) {
            console.error('Error fetching geocoding data:', error);
        }
    };

    fetchGeocodingData();

</script>

<template>
    <p>The latitude for {{ city.name }} is {{ latitude }}, and longitude is {{ longitude }}.</p>
</template>