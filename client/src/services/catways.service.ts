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
  getAll: () => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest('/catways', { token })
  },

  getById: (id: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/catways/${id}`, { token })
  },

  create: (data: any) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest('/catways', {
      method: 'POST',
      token,
      data
    })
  },

  update: (id: string, data: any) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/catways/${id}`, {
      method: 'PUT',
      token,
      data
    })
  },

  delete: (id: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/catways/${id}`, {
      method: 'DELETE',
      token
    })
  },

  // Réservations
  getReservations: (catwayId: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/catways/${catwayId}/reservations`, { token })
  },

  createReservation: (catwayId: string, reservation: Omit<Reservation, '_id'>) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/catways/${catwayId}/reservations`, {
      method: 'POST',
      token,
      data: reservation
    })
  }
}

export default catwaysService 