<script setup>
  import { ref, watch } from 'vue';
  import { useCityStore } from '@/stores/city';
  import { useLangStore } from '@/stores/lang';
  const city = useCityStore();
  const lang = useLangStore();

  const unsplashPhotos = ref([]);
  const mostLikedPhoto = ref(null);

  const fetchUnsplashPhotos = async () => {
    try {
      const response = await fetch(`http://localhost:8080/unsplash_photos?city=${city.name}`);
      const data = await response.json();

      const results = data.results;
      unsplashPhotos.value = results;

      // Find the photo with the most likes
      if (results.length > 0) {
        mostLikedPhoto.value = results.reduce((prev, current) =>
          prev.likes > current.likes ? prev : current
        );
      }
    } catch (error) {
      console.error('Error fetching Unsplash photos:', error);
    }
  };

  // Watcher to ensure we fetch only when the city state changes
  watch(() => city.name, () => {
    fetchUnsplashPhotos();
  });
</script>

<template>
  <div class="unsplash-grid">
    <div v-if="mostLikedPhoto">
      <img :src="mostLikedPhoto.urls.regular" alt="Unsplash Photo" class="unsplash-photo" />
    </div>
  </div>
</template>

<style scoped>
  .unsplash-grid {
    background-color: var(--color-card-3);
    border-radius: 8px;
    padding: 10px;
    margin: 15px 50px 0 50px;

  }
  .unsplash-photo {
    width: 100%;
  }
</style>
