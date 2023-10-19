<script setup>

    import { ref, watch } from 'vue';
    import { useCityStore } from '@/stores/city'
    import { useLangStore } from '@/stores/lang'
    import Pollution from './Pollution.vue';

    const city = useCityStore();
    const lang = useLangStore();
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

    const fetchWeatherData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/weather?lat=${latitude.value}&lon=${longitude.value}&lang=${lang.current}`);
            const data = await response.json();

            if (response.ok) {
                generateLiElements(data);
            } else {
                console.error('Error: Weather data is not in the expected format.');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };
   
    
    // Helper function to interact with DOM
    function generateLiElements(jsonData) {
        const dataList = document.getElementById('dataList');

        dataList.innerHTML = '';

        jsonData.list.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `Temperature: ${item.main.temp} °C`;
            dataList.appendChild(li);
        });
    }

    // Fetch only when the city state changes
    watch(() => city.name, () => {
        fetchGeocodingAndWeatherData();
    });

    // Ensure API calls resolve in sensible order
    const fetchGeocodingAndWeatherData = async () => {
        await fetchGeocodingData(); // Gets the coordinates
        await fetchWeatherData();   // Gets the weather data
    };

</script>


<template>
    <div>
        <h1>The city has been passed to Table.vue as {{ city.name }}.</h1>
        <p>Latitude: {{ latitude }}</p>
        <p>Longitude: {{ longitude }}</p>

        <ul id="dataList">
            <!-- Display fetched weather data -->
        </ul>
        <div v-if="latitude && longitude">
            <Pollution :lat = "latitude" :lon = "longitude" />
        </div>
    </div>
</template>