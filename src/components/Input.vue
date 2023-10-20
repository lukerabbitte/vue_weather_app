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
    <h2>
        <span v-if="lang.current === 'EN'">Discover upcoming weather events in any city</span>
        <span v-else>Découvrez la météo à venir dans votre ville</span>
        🌈 ☔ ⚡ ❄
    </h2>
    <p>
        <span v-if="lang.current === 'EN'">Hint: make a more specific search by putting the 2-letter country code after the city name! E.g. 'Dublin, IE'</span>
        <span v-else>Conseil : effectuez une recherche plus précise en ajoutant le code pays à deux lettres après le nom de la ville ! Par exemple, 'Paris, FR'</span>
    </p>
</div>


  <form @submit.prevent="city.changeCityName(cityName)" class="input-container">
    <input
      v-model="cityName"
      :placeholder="lang.current === 'EN' ? 'City name (e.g. Warsaw)' : 'Nom de ville (p. ex. Varsovie)'"
      class="input-field">
    <button type="submit">
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

  .input-field {
    width: 100%;
    font-size: 1.2rem;
    font-family: inherit;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
  }

  button {
    background: none;
    border: none;
    color: var(--color-text);
    padding: 20px;
    outline: none;
    font-weight: bolder;
    font-family: inherit;
  }

  button:hover {
    color: var(--color-text-hover);
    cursor: pointer;
  }
</style>