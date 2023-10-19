<script setup>

    import { ref } from 'vue';
    import { useLangStore } from '@/stores/lang'
    const lang = useLangStore();
    defineProps(['lat', 'lon']);
    const maskMessage = ref('');

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


</script>

<template>
    <div>
        <p>The pollution information for lat {{ lat }} and longitude {{ lon }}</p>
        <ul id="pollutionDateList">
            <!-- Display fetched pollution data -->
        </ul>
        <p>{{ maskMessage }}</p>
    </div>
</template>
