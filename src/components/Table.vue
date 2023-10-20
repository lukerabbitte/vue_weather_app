<script setup>

    import { ref, watch } from 'vue';
    import { useCityStore } from '@/stores/city'
    import { useLangStore } from '@/stores/lang'
    import UnsplashImage from './UnsplashImage.vue';

    const city = useCityStore();
    const lang = useLangStore();
    const limit = 1;
    const latitude = ref(null);
    const longitude = ref(null);
    
    const rainMessage = ref('');
    const temperatureMessage = ref('');
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
                generateDataTable(data);
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

    // Main function for generating Table
    function generateDataTable(jsonData) {
        const table = document.getElementById('dataTable');
        table.innerHTML = '';

        // Create the table header
        createTableHeader(table);

        const tbody = document.createElement('tbody');

        // Generate 'date reports' which aggregate data per day rather than per 3hrs in the API
        const dateReports = new Map();

        // Go through each 'item' object in the '.list' array in the JSON response
        jsonData.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];

            if (!dateReports.has(date)) {
            dateReports.set(date, {
                minTemp: item.main.temp,
                maxTemp: item.main.temp,
                minWindSpeed: item.wind.speed,
                maxWindSpeed: item.wind.speed,
                totalDailyRainfall: item.rain ? item.rain['3h'] : 0,
                dailyTempTotal: item.main.temp,
                timestampCount: 1,
            });
            } else {
            const report = dateReports.get(date);
            report.minTemp = Math.min(report.minTemp, item.main.temp);
            report.maxTemp = Math.max(report.maxTemp, item.main.temp);
            report.minWindSpeed = Math.min(report.minWindSpeed, item.wind.speed);
            report.maxWindSpeed = Math.max(report.maxWindSpeed, item.wind.speed);
            report.totalDailyRainfall += item.rain ? item.rain['3h'] : 0;
            report.dailyTempTotal += item.main.temp;
            report.timestampCount++;
            }
        });

        populateTableWithDateReports(dateReports, tbody);

        table.appendChild(tbody);

        // Calculate the overall average temperature
        const numberOfDays = dateReports.size;
        const tempTotal = calculateAverageTemperature(dateReports);
        const averageTemp = (tempTotal / numberOfDays).toFixed(2);

        if (averageTemp < 13) {
            temperatureMessage.value =  `🌡️ Average temperature ${averageTemp}°C. Pack for cold weather!`;
        } else if (averageTemp >= 13 && averageTemp <= 23) {
            temperatureMessage.value = `🌡️ Average temperature ${averageTemp}°C. Pack for mild weather!`;
        } else {
            temperatureMessage.value = `🌡️ Average temperature ${averageTemp}°C. Pack for hot weather!`;
        }

        // Check for high rainfall and set the rain message
        checkHighRainfall(dateReports);
    }

    // Helper function to create table header
    function createTableHeader(table) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Date</th>
            <th>Min Temp (°C)</th>
            <th>Max Temp (°C)</th>
            <th>Min Wind Speed (m/s)</th>
            <th>Max Wind Speed (m/s)</th>
            <th>Total Rainfall (mm)`;
        thead.appendChild(headerRow);
        table.appendChild(thead);
    }

    // Helper function to append table row
    function populateTableWithDateReports(dateReports, tbody) {
        dateReports.forEach((report, date) => {
            const row = createTableRow(date, report);
            tbody.appendChild(row);
        });
    }

    // Helper function to create table row
    function createTableRow(date, report) {
        const row = document.createElement('tr');

        // Create table cells for each daily data report
        const dateCell = createTableCell(date);
        row.appendChild(dateCell);

        const minTempCell = createTableCell(report.minTemp.toFixed(2));
        row.appendChild(minTempCell);

        const maxTempCell = createTableCell(report.maxTemp.toFixed(2));
        row.appendChild(maxTempCell);

        const minWindSpeedCell = createTableCell(report.minWindSpeed.toFixed(2));
        row.appendChild(minWindSpeedCell);

        const maxWindSpeedCell = createTableCell(report.maxWindSpeed.toFixed(2));
        row.appendChild(maxWindSpeedCell);

        const totalRainfallCell = createTableCell(report.totalDailyRainfall.toFixed(2));
        row.appendChild(totalRainfallCell);

        return row;
    }

    // Helper function to create table cell
    function createTableCell(text) {
        const cell = document.createElement('td');
        cell.textContent = text;
        return cell;
    }

    function calculateAverageTemperature(dateReports) {
        let tempTotal = 0;

        dateReports.forEach(report => {
            tempTotal += report.dailyTempTotal / report.timestampCount;
        });

        return tempTotal;
    }

    function checkHighRainfall(dateReports) {
        dateReports.forEach(report => {
            if (report.totalDailyRainfall > 2.5) {
                rainMessage.value = "🌧️ High rainfall detected. Consider bringing an umbrella!";
            }
        });
    }

    // Helper function to generate and display pollution info
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

        // Interact with DOM to add each pollution report as a list item.
        if (datesAbove10Map.size > 0) {
            datesAbove10Map.forEach((pm2_5, date) => {
                const li = document.createElement('li');
                li.textContent = `On ${date} the pm2_5 level is ${pm2_5}`;
                dateList.appendChild(li);
            });
            maskMessage.value = '😷 High pm2_5 levels in the atmosphere. Consider bringing a mask!';
        } else {
            maskMessage.value = '🙂 Low pm2_5 levels in the atmosphere. No need to bring a mask.';
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
        <div class="weather-breakdown">
            <h2 v-if="city.name">5-day weather for {{ city.name }}:</h2>
            <table id="dataTable">
                <thead>
                    <!-- Table header will be generated dynamically by JavaScript -->
                </thead>
                <tbody>
                    <!-- Table rows will be generated dynamically by JavaScript -->
                </tbody>
            </table>
        </div>
        <div class="weather-alerts">
            <p> {{ rainMessage }}</p>
            <p> {{ temperatureMessage }}</p>
            <h1 v-if="lat && lon">Pollution information for lat {{ lat }} and longitude {{ lon }}</h1>
            <p> {{ maskMessage }}</p>
            <ul id="pollutionDateList">
                <!-- Display fetched pollution data -->
            </ul>
        </div>
        <div class="unsplash-image">
            <UnsplashImage />
        </div>
    </div>
</template>
