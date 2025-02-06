import { defineStore } from 'pinia'
import { catwaysAPI } from '@/services/api'
import type { Catway } from '@/types'

export const useCatwayStore = defineStore('catway', {
  state: () => ({
    catways: [] as Catway[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchCatways() {
      this.loading = true
      try {
        const response = await catwaysAPI.getAll()
        this.catways = response.data
      } catch (error) {
        this.error = 'Erreur lors du chargement des catways'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
})
