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
    return apiRequest('/api/reservations', { token })
  },

  getReservations: (catwayNumber: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${catwayNumber}/reservations`, { token })
  },
  
  getCurrent: async () => {
    try {
      const token = localStorage.getItem('token') || undefined;
      const response = await apiRequest('/api/reservations/current', {
        token
      });
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      throw error;
    }
  },
  
  create: (catwayNumber: string, reservation: Omit<Reservation, '_id'>) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${catwayNumber}/reservations`, {
      method: 'POST',
      token,
      data: reservation
    })
  },
  
  update: (catwayNumber: string, reservationId: string, data: Partial<Reservation>) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${catwayNumber}/reservations/${reservationId}`, {
      method: 'PUT',
      token,
      data
    })
  },
  
  delete: (catwayNumber: string, reservationId: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/catways/${catwayNumber}/reservations/${reservationId}`, {
      method: 'DELETE',
      token
    })
  }
}

export default reservationsService 