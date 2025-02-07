import { apiRequest } from '@/middleware/api.middleware';

export interface Reservation {
  _id: string
  catwayNumber: string
  clientName: string
  boatName: string
  startDate: string
  endDate: string
  status: string
}

const reservationsService = {
  getAll: () => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest('/reservations', { token })
  },

  getReservations: (catwayNumber: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/catways/${catwayNumber}/reservations`, { token })
  },
  
  getCurrent: () => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest('/reservations/current', { token })
  },
  
  create: (reservation: Omit<Reservation, '_id'>) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest('/reservations', {
      method: 'POST',
      token,
      data: reservation
    })
  },
  
  update: (id: string, data: Partial<Reservation>) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/reservations/${id}`, {
      method: 'PUT',
      token,
      data
    })
  },
  
  delete: (id: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/reservations/${id}`, {
      method: 'DELETE',
      token
    })
  }
}

export default reservationsService 