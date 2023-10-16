<script setup>
    import { ref } from 'vue';
    import { useLangStore } from '@/stores/lang'

    const lang = useLangStore()
    const cityName = ref('');   // TODO move this state to App.vue as it is needed in Table!
    
    const handleCity = () => {
        console.log('Submitted city name:', cityName.value);
    };

</script>

<template>
    <div class="input-container">
    <input
      type="text"
      id="cityInput"
      v-model="cityName"
      :placeholder="lang.current === 'EN' ? 'City name (e.g. Warsaw)' : 'Nom de ville (p. ex. Varsovie)'"
    />
    <button @click="handleCity">
      {{lang.current === 'EN' ? 'Search' : 'Rechercher'}}
    </button>
  </div>
</template>

<style scoped>
  .input-container {
    margin: 70px 0 30px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: baseline;
  }

  #cityInput {
    width: 28ch;
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