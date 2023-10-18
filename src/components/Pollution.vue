<script setup>

    defineProps(['lat', 'lon']);

</script>

<template>
    <div v-if="lat !== null && lon !== null && lat !== undefined && lon !== undefined">
      <p>The pollution information for lat {{ lat }} and longitude {{ lon }}</p>
    </div>
</template>
  