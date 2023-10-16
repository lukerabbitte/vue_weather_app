import { defineStore } from 'pinia'

export const useLangStore = defineStore('lang', {
  state: () => {
    return { current: 'EN' }
  },

  actions: {
    toggle() {
        this.current = this.current === 'EN' ? 'FR' : 'EN';
    },
  },
})