<script setup>

    import { ref, watch } from 'vue';
    import { useCityStore } from '@/stores/city'
    import { useLangStore } from '@/stores/lang'

    const city = useCityStore();
    const lang = useLangStore();
    const limit = 1;
    const latitude = ref(null);
    const longitude = ref(null);
    const maskMessage = ref('');

    // Geocoding call
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

    // Weather call
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

    // Pollution call
    const fetchPollutionData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/air_pollution?lat=${latitude.value}&lon=${longitude.value}`);
            const data = await response.json();

            if (response.ok) {
                maskMessage.value = 'the call was all good.'
                generatePollutionInfo(data);
            } else {
                console.error('Error: Pollution data is not in the expected format.');
            }
        } catch (error) {
            console.error('Error fetching pollution data:', error);
        }
    };

    // Helper function to generate weather list in DOM
    function generateLiElements(jsonData) {
        const dataList = document.getElementById('dataList');
        dataList.innerHTML = '';

        const dateReports = new Map();

        jsonData.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];

            if (!dateReports.has(date)) {
                dateReports.set(date, {
                    minTemp: item.main.temp,
                    maxTemp: item.main.temp,
                    minWindSpeed: item.wind.speed,
                    maxWindSpeed: item.wind.speed,
                    totalRainfall: item.rain ? item.rain['3h'] : 0,
                });
            } else {
                const report = dateReports.get(date);
                report.minTemp = Math.min(report.minTemp, item.main.temp);
                report.maxTemp = Math.max(report.maxTemp, item.main.temp);
                report.minWindSpeed = Math.min(report.minWindSpeed, item.wind.speed);
                report.maxWindSpeed = Math.max(report.maxWindSpeed, item.wind.speed);
                report.totalRainfall += item.rain ? item.rain['3h'] : 0;
            }
        });

        dateReports.forEach((report, date) => {
            const li = document.createElement('li');
            li.textContent = `Date: ${date}, Temperature (min-max): ${report.minTemp}°C - ${report.maxTemp}°C, Wind Speed (min-max): ${report.minWindSpeed} m/s - ${report.maxWindSpeed} m/s, Total Rainfall: ${report.totalRainfall} mm`;
            dataList.appendChild(li);
        });
    }

    // Helper function to generate pollution info in DOM
    function generatePollutionInfo(jsonData) {
        const dateList = document.getElementById('pollutionDateList');
        dateList.innerHTML = '';

        const datesAbove10Map = new Map();

        jsonData.list
            .filter(item => item.components.pm2_5 > 10)
            .forEach(item => {
                const date = formatDate(item.dt);
                const pm2_5 = item.components.pm2_5;
                if (datesAbove10Map.has(date)) {
                    if (pm2_5 > datesAbove10Map.get(date)) {
                        datesAbove10Map.set(date, pm2_5);
                    }
                } else {
                    datesAbove10Map.set(date, pm2_5);
                }
            });

        if (datesAbove10Map.size > 0) {
            datesAbove10Map.forEach((pm2_5, date) => {
                const li = document.createElement('li');
                li.textContent = `The highest pm2_5 on ${date} is ${pm2_5}`;
                dateList.appendChild(li);
            });

            maskMessage.value = 'High pm2_5 levels in the atmosphere. Consider bringing a mask!';
        } else {
            maskMessage.value = 'Low pm2_5 levels in the atmosphere. No need to bring a mask.';
        }
    }

    // Helper function to make legible date
    function formatDate(timestamp) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; // Where Sunday - Saturday is 0-6
        const date = new Date(timestamp * 1000);
        
        const dayOfWeek = daysOfWeek[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${dayOfWeek} ${day}-${month}-${year}`;
    }


    // Watcher to ensure we fetch only when the city state changes
    watch(() => city.name, () => {
        fetchGeocodingAndWeatherData();
    });

    // Ensure API calls resolve in sensible order
    const fetchGeocodingAndWeatherData = async () => {
        await fetchGeocodingData(); // Gets the coordinates
        await fetchWeatherData();   // Gets the weather data
        await fetchPollutionData(); // Gets the PM2_5 data
    };
</script>

<template>
    <div>
        <div>
            <h1 v-if="city.name">Weather information for {{ city.name }}</h1>
            <p>Latitude: {{ latitude }}</p>
            <p>Longitude: {{ longitude }}</p>

            <ul id="dataList">
                <!-- Display fetched weather data -->
            </ul>
        </div>
        <div>
            <h1 v-if="lat && lon">Pollution information for lat {{ lat }} and longitude {{ lon }}</h1>
            <ul id="pollutionDateList">
                <!-- Display fetched pollution data -->
            </ul>
            <p> {{ maskMessage }}</p>
        </div>
    </div>
</template>
