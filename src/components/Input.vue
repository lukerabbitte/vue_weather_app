<script setup>
    import { ref } from 'vue';
    import { useLangStore } from '@/stores/lang'
    import { useCityStore } from '@/stores/city'

    const lang = useLangStore();
    const city = useCityStore();

    const cityName = ref('');

</script>

<template>

  <div>
    <h2>Discover upcoming weather events in any city</h2>
    <p>Hint: make a more specific search by putting the 2-letter country code after the city name! E.g. 'Dublin, IE'</p>
  </div>

  <form @submit.prevent="city.changeCityName(cityName)" class="input-container">
    <input
      v-model="cityName"
      :placeholder="lang.current === 'EN' ? 'City name (e.g. Warsaw)' : 'Ville (p. ex. Varsovie)'">

    <button type="submit" >
      {{lang.current === 'EN' ? 'Search' : 'Rechercher'}}
    </button>
  </form>

</template>

<style scoped>
  .input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: baseline;
  }

  #cityInput {
    width: 30ch;
    font-size: 1.1rem;
  }

  button {
    background: none;
    border: none;
    color: var(--color-text);
    padding: 5px;
    align-items:flex-end;
    outline: none;
  }

  button:hover {
    color: var(--color-text-hover);
    cursor: pointer;
  }
</style>