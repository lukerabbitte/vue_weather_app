<script setup>
    import { ref } from 'vue';
    import { useLangStore } from '@/stores/lang'

    const lang = useLangStore()

    const dummyCity='Warsaw'
    const countryCode='PL';
    const limit = 1;
    
    const latitude = ref(null);
    const longitude = ref(null);

    const fetchGeocodingData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/geocoding?cityName=${dummyCity}&countryCode=${countryCode}&limit=${limit}`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                latitude.value = data[0].lat;
                longitude.value = data[0].lon;
                console.log("fetch test")
                console.log(latitude.value, longitude.value);
            } else {
                console.error('No geocoding data available.');
            }
        } catch (error) {
            console.error('Error fetching geocoding data:', error);
        }
    };

    fetchGeocodingData();

</script>

<template>
    <p>Hello, the city's latitude is {{ latitude }}, and the city's longitude is {{ longitude }}.</p>
</template>