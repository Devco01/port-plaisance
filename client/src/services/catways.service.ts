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
    catwayNumber: string | number
  }
  clientName: string
  boatName: string
  startDate: string
  endDate: string
  status?: string
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
    console.log('getReservations appelé pour catway:', catwayId)
    return apiRequest(`/api/catways/${catwayId}/reservations`, { token })
      .then(response => {
        console.log('Réponse du serveur:', response)
        return response
      })
      .catch(err => {
        console.error('Erreur API:', err)
        throw err
      })
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
  },

  getAllReservations: () => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest('/api/catways/reservations/all', { token })
  }
}

export default catwaysService 