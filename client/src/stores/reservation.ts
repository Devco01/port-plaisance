import { defineStore } from 'pinia'
import { reservationsAPI } from '@/services/api'
import type { Reservation } from '@/types'

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    reservations: [] as Reservation[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchReservations(catwayId: string) {
      this.loading = true
      try {
        const response = await reservationsAPI.getAllForCatway(catwayId)
        this.reservations = response.data
      } catch (error) {
        this.error = 'Erreur lors du chargement des réservations'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
})
