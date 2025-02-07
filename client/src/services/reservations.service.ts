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
  async getAll() {
    const token = localStorage.getItem('token')
    return apiRequest('/reservations', { token })
  },

  async getReservations(catwayNumber: string) {
    const token = localStorage.getItem('token')
    return apiRequest(`/catways/${catwayNumber}/reservations`, { token })
  },
  
  async getCurrent() {
    const token = localStorage.getItem('token')
    return apiRequest('/reservations/current', { token })
  },
  
  async create(reservation: Omit<Reservation, '_id'>) {
    const token = localStorage.getItem('token')
    return apiRequest('/reservations', {
      method: 'POST',
      token,
      data: reservation
    })
  },
  
  async update(id: string, data: Partial<Reservation>) {
    const token = localStorage.getItem('token')
    return apiRequest(`/reservations/${id}`, {
      method: 'PUT',
      token,
      data
    })
  },
  
  async delete(id: string) {
    const token = localStorage.getItem('token')
    return apiRequest(`/reservations/${id}`, {
      method: 'DELETE',
      token
    })
  }
}

export default reservationsService 