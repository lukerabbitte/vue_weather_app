<script setup>

  import { ref, defineProps } from 'vue';
  import NavBar from './components/NavBar.vue'
  import Input from './components/Input.vue'
  import Table from './components/Table.vue'

  const cityName = ref('');
  
</script>

<template>

  <NavBar />
  <Input @change-city-name="
        (data) => {
          cityName = data;
        }
      " />

  <Table :city-name=cityName />

  
  <ul>
  </ul>
  
</template>