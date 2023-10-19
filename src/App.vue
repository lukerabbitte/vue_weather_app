<script setup>

  import { onMounted } from 'vue';
  import NavBar from './components/NavBar.vue';
  import Input from './components/Input.vue';
  import Table from './components/Table.vue';

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  onMounted(() => {
    scrollToTop();
  });
  
</script>

<template>
  <div>
    <header>
      <NavBar />
    </header>

    <main>
      <Input />
      <Table />
    </main>
  </div>
</template>
