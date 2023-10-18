<script setup>
    import { ref } from 'vue';
    import { useLangStore } from '@/stores/lang'

    const lang = useLangStore()
    
    const props = defineProps({cityName: String});  // TODO turn cityName into state, rather than this prop passing. Doesn't seem to work.

    const limit = 1;
    
    const latitude = ref(null);
    const longitude = ref(null);

    const fetchGeocodingData = async () => {
        try {
            console.log('City: ', cityName);
            const response = await fetch(`http://localhost:8080/geocoding?cityName=${cityName}&limit=${limit}`);
            const data = await response.json();
            console.log(data);

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
    <p>The latitude for {{ cityName }} is {{ latitude }}, and longitude is {{ longitude }}.</p>
</template>