import { apiRequest } from '@/middleware/api.middleware';

export interface Catway {
  catwayNumber: string;
  catwayType: "long" | "short";
  catwayState: string;
}

export interface Reservation {
  _id: string;
  catwayNumber: string;
  clientName: string;
  boatName: string;
  startDate: string;
  endDate: string;
}

const catwaysService = {
  getAll: async () => {
    try {
      const response = await apiRequest('/api/catways');
      console.log('=== DEBUG SERVICE CATWAYS ===');
      console.log('Réponse API:', response);
      
      if (!response.success || !Array.isArray(response.data)) {
        throw new Error('Format de réponse invalide');
      }

      // Vérifier la structure des données
      const validCatways = response.data.map((catway: Catway) => {
        if (!catway.catwayNumber || !catway.catwayType || !catway.catwayState) {
          console.error('Catway invalide:', catway);
        }
        return catway;
      });

      console.log('Catways validés:', validCatways);
      return response;
    } catch (error) {
      console.error('Erreur getAll catways:', error);
      throw error;
    }
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

  getAllReservations: async () => {
    console.log('=== DEBUG getAllReservations ===');
    const token = localStorage.getItem('token') || undefined;
    console.log('Token:', token ? 'Présent' : 'Absent');
    
    try {
      const response = await apiRequest('/api/catways/reservations/all', { token });
      console.log('Réponse getAllReservations:', response);
      return response;
    } catch (error) {
      console.error('Erreur getAllReservations:', error);
      throw error;
    }
  }
}

export default catwaysService 