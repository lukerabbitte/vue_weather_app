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
            temperatureMessage.value = lang.current === 'FR'
                ? `🌡️ Température moyenne de ${averageTemp}°C. Apporter des vêtements chauds !`
                : `🌡️ Average temperature ${averageTemp}°C. Pack for cold weather!`;
        } else if (averageTemp >= 13 && averageTemp <= 23) {
            temperatureMessage.value = lang.current === 'FR'
                ? `🌡️ Température moyenne de ${averageTemp}°C. Apporter des vêtements pour le temps doux !`
                : `🌡️ Average temperature ${averageTemp}°C. Pack for mild weather!`;
        } else {
            temperatureMessage.value = lang.current === 'FR'
                ? `🌡️ Température moyenne de ${averageTemp}°C. Apporter des vêtements légers !`
                : `🌡️ Average temperature ${averageTemp}°C. Pack for hot weather!`;
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
        let highRainfallDetected = false;
        dateReports.forEach(report => {
            if (report.totalDailyRainfall > 2.5) {
                highRainfallDetected = true;
            }
        });

        if (highRainfallDetected) {
            if (lang.current === 'FR') {
                rainMessage.value = "🌧️ Risque de fortes pluies détecté. Pensez à prendre un parapluie !";
            } else {
                rainMessage.value = "🌧️ High rainfall detected. Consider bringing an umbrella!";
            }
        } else {
            rainMessage.value = "";
        }
    }

    // Generate pollution table showing days where pm2_5 is too high
    function generatePollutionInfo(jsonData) {
        const table = document.getElementById('pollutionDataTable');
        table.innerHTML = '';

        // Create the table header
        createPollutionTableHeader(table);

        const tbody = document.createElement('tbody');

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

        populatePollutionTable(datesAbove10Map, tbody);

        table.appendChild(tbody);

        // Check for high pm2.5 levels and set the mask message
        checkHighPM2_5(datesAbove10Map);
    }

    function createPollutionTableHeader(table) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Date</th>
            <th>PM2.5 Level</th>
        `;
        thead.appendChild(headerRow);
        table.appendChild(thead);
    }

    function populatePollutionTable(datesAbove10Map, tbody) {
        datesAbove10Map.forEach((pm2_5, date) => {
            const row = createPollutionTableRow(date, pm2_5);
            tbody.appendChild(row);
        });
    }

    function createPollutionTableRow(date, pm2_5) {
        const row = document.createElement('tr');

        // Create table cells for date and PM2.5 Level
        const dateCell = createTableCell(date);
        row.appendChild(dateCell);

        const pm2_5Cell = createTableCell(pm2_5);
        row.appendChild(pm2_5Cell);

        return row;
    }
    

    function checkHighPM2_5(datesAbove10Map) {
    if (datesAbove10Map.size > 0) {
        if (lang.current === 'FR') {
            maskMessage.value = '😷 Niveaux élevés de PM2.5 dans l\'atmosphère. Pensez à prendre un masque !';
        } else {
            maskMessage.value = '😷 High PM2.5 levels in the atmosphere. Consider bringing a mask!';
        }
    } else {
        if (lang.current === 'FR') {
            maskMessage.value = '🙂 Faibles niveaux de PM2.5 dans l\'atmosphère. Pas besoin de prendre un masque.';
        } else {
            maskMessage.value = '🙂 Low PM2.5 levels in the atmosphere. No need to bring a mask.';
        }
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

        return `${dayOfWeek} ${day}-${month}`;
    }


    // Watcher to ensure we fetch only when the city state changes
    watch([() => city.name, () => lang.current], () => {
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
        <div class="table" id="weather-table">
            <h2 v-if="city.name" class="tableLabel">
                <span v-if="lang.current === 'EN'">5-day weather for {{ city.name }}:</span>
                <span v-else>Météo à 5 jours pour {{ city.name }} :</span>
            </h2>

            <table id="dataTable">
                <thead>
                    <!-- Table header will go here -->
                </thead>
                <tbody>
                    <!-- Table rows will go here -->
                </tbody>
            </table>
        </div>

        <div class = alertsAndPicture>
            <div class="alerts">
                <div class="weather-alerts">
                <p> {{ rainMessage }}</p>
                <p> {{ temperatureMessage }}</p>
                <p> {{ maskMessage }}</p>
                </div>
            
                <div class="table" id="pollution-table">
                    <h4 v-if="city.name" class="tableLabel">
                        <span v-if="lang.current === 'EN'">PM2.5 breakdown for {{ city.name }}:</span>
                        <span v-else>Résumé de PM2.5 pour {{ city.name }} :</span>
                    </h4>
                    <table id="pollutionDataTable">
                        <thead>
                            <!-- Table header will go here -->
                        </thead>
                        <tbody>
                            <!-- Table rows will go here -->
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="unsplash-image">
                <UnsplashImage />
            </div>
        </div>
    </div>
</template>

<style>
    .table {
    width: 80%;
    border-collapse: collapse;
    }

    .tableLabel {
    margin-bottom: 0;
    }

    .table th, .table td {
    border: 1px solid #000;
    border-radius: 8px;
    padding: 8px;
    text-align: left;
    }

    .table th {
    font-weight: bold;
    background-color: var(--color-header);
    }

    .table tbody tr:nth-child(even) {
    background-color: var(--color-table-cell);
    }

    .table tbody tr:nth-child(odd) {
    background-color: var(--color-table-contrast);
    }

    .table tbody tr:hover {
    background-color: var(--color-table-hover);
    }

    .alertsAndPicture {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
