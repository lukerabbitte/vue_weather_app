<script setup>

  import NavBar from './components/NavBar.vue';
  import Input from './components/Input.vue';
  import Table from './components/Table.vue';

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

    <footer>
      ✧˖°⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡°˖✧
    </footer>
  </div>
</template>