import { apiRequest } from '@/middleware/api.middleware';

export interface Catway {
  _id: string
  number: number
  length: number
  width: number
  status: string
}

export interface Reservation {
  _id: string
  catway: {
    number: string
  }
  clientName: string
  boatName: string
  startDate: string
  endDate: string
}

const catwaysService = {
  getAll: () => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest('/api/catways', { token })
  },

  getCatway: (id: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${id}`, { token })
  },

  create: (data: any) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest('/api/catways', {
      method: 'POST',
      token,
      data
    })
  },

  update: (id: string, data: any) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${id}`, {
      method: 'PUT',
      token,
      data
    })
  },

  delete: (id: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${id}`, {
      method: 'DELETE',
      token
    })
  },

  // Réservations
  getReservations: (catwayId: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${catwayId}/reservations`, { token })
  },

  createReservation: (catwayId: string, reservation: Omit<Reservation, '_id' | 'catway'>) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${catwayId}/reservations`, {
      method: 'POST',
      token,
      data: reservation
    })
  },

  updateReservation: (catwayId: string, reservationId: string, data: Partial<Omit<Reservation, '_id' | 'catway'>>) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${catwayId}/reservations/${reservationId}`, {
      method: 'PUT',
      token,
      data
    })
  },

  deleteReservation: (catwayId: string, reservationId: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${catwayId}/reservations/${reservationId}`, {
      method: 'DELETE',
      token
    })
  }
}

export default catwaysService 