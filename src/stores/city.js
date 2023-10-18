import { defineStore } from 'pinia'

export const useCityStore = defineStore('city', {
  state: () => {
    return { name: '' }
  },

  actions: {
    changeCityName(cityName) {
      this.name = cityName;
    },
  },
})