<script setup>

  import NavBar from './components/NavBar.vue';
  import Input from './components/Input.vue';
  import Table from './components/Table.vue';
  import { useCityStore } from '@/stores/city';

  const city = useCityStore();

</script>

<template>
  <div>
    <header>
      <NavBar />
    </header>


    <main>
      <div class="container">
        <div class="input-container">
          <Input />
        </div>
        <div class="table-container">
          <Table />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

  .container {
    display: flex;
    flex-direction: column;
  }

  .input-container {
    background-color: var(--color-card);
    border-radius: 8px;
    padding: 1px 16px 16px 16px;
    margin-top: var(--nav-bar-height);
    margin-bottom: 20px;
  }

  .table-container {
    background-color: var(--color-card-2);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
  }
</style>