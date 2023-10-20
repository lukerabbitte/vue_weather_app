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

<style scoped>
  .input-container {
    background-color: var(--color-card);
    border-radius: 8px;
    color: var(--color-text);
    margin-top: var(--nav-bar-height);
    padding: 0.5px 20px 20px 20px;
  }

  .table-container {
    background-color: var(--color-card-2);
    border-radius: 8px;
    color: var(--color-text);
    padding: 20px;
    margin-top: 25px;
  }

  footer {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 25px auto 0 auto;
  }
</style>