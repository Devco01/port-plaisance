import { apiRequest } from '@/middleware/api.middleware';

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
    const token = localStorage.getItem('token')
    return apiRequest('/catways', { token })
  },

  async getOne(id: string) {
    const token = localStorage.getItem('token')
    return apiRequest(`/catways/${id}`, { token })
  },

  async create(catway: { number: number; length: number; width: number }) {
    const token = localStorage.getItem('token')
    return apiRequest('/catways', {
      method: 'POST',
      token,
      data: catway
    })
  },

  async update(id: string, data: { number?: number; length?: number; width?: number }) {
    const token = localStorage.getItem('token')
    return apiRequest(`/catways/${id}`, {
      method: 'PUT',
      token,
      data
    })
  },

  async delete(id: string) {
    const token = localStorage.getItem('token')
    return apiRequest(`/catways/${id}`, {
      method: 'DELETE',
      token
    })
  },

  // Réservations
  async getReservations(catwayId: string) {
    const token = localStorage.getItem('token')
    return apiRequest(`/catways/${catwayId}/reservations`, { token })
  },

  async createReservation(catwayId: string, reservation: Omit<Reservation, '_id'>) {
    const token = localStorage.getItem('token')
    return apiRequest(`/catways/${catwayId}/reservations`, {
      method: 'POST',
      token,
      data: reservation
    })
  }
}

export default catwaysService 