import api from './api.service'

export interface Catway {
  _id: string
  number: number
  length: number
  width: number
  status: string
}

export interface Reservation {
  catwayNumber: string
  clientName: string
  boatName: string
  startDate: string
  endDate: string
}

const catwaysService = {
  async getAll() {
    try {
      console.log('Appel getAll catways')
      const response = await api.get('/catways')
      console.log('Réponse catways:', response)
      return response.data
    } catch (error) {
      console.error('Erreur getAll catways:', error)
      throw error
    }
  },

  async create(catway: Omit<Catway, '_id'>) {
    const response = await api.post('/catways', catway)
    return response.data
  },

  async update(id: string, state: string) {
    const response = await api.put(`/catways/${id}`, { status: state })
    return response.data
  },

  async delete(id: string) {
    const response = await api.delete(`/catways/${id}`)
    return response.data
  },

  // Réservations
  async getReservations(catwayId: string) {
    const response = await api.get(`/catways/${catwayId}/reservations`)
    return response.data
  },

  async createReservation(catwayId: string, reservation: Omit<Reservation, '_id'>) {
    const response = await api.post(`/catways/${catwayId}/reservations`, reservation)
    return response.data
  }
}

export default catwaysService 