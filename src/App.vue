<script setup>
  import { ref } from 'vue';
  import HelloWorld from './components/HelloWorld.vue'
  import NavBar from './components/NavBar.vue'
  import { useLangStore } from '@/stores/lang'

  const lang = useLangStore()
  const appId = 'e689a22a0aa07bb6cfa7018f8db86a92'

  const cityName = ref('');

  const submitCity = () => {
    console.log('Submitted city name:', cityName.value);
  };

</script>

<template>

  <NavBar />
  
  <div class="input-container">
    <input
      type="text"
      id="cityInput"
      v-model="cityName"
      :placeholder="lang.current === 'EN' ? 'City name (e.g. Warsaw)' : 'Nom de ville (p. ex. Varsovie)'"
    />
    <button @click="submitCity">Search</button>
  </div>


</template>

<style scoped>

  .input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }

  #cityInput {
    width: 25ch;
    margin: 5px;
    font-size: 1.1rem;
  }

  button {
    background: none;
    border: none;
    color: white;
    padding: 5px 1px;
  }

  button:hover {
    color: rgb(102, 206, 187);
    cursor: pointer;
  }

</style>