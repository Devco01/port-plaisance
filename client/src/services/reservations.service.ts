import api from './api.service'

export interface Reservation {
  _id: string
  catwayNumber: string
  clientName: string
  boatName: string
  startDate: string
  endDate: string
  status: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

const reservationsService = {
  async getAll() {
    const response = await api.get<ApiResponse<Reservation[]>>('/reservations')
    return response
  },

  async getReservations(catwayNumber: string) {
    const response = await api.get<ApiResponse<Reservation[]>>(`/catways/${catwayNumber}/reservations`)
    return response
  },
  
  async getCurrent() {
    const response = await api.get<ApiResponse<Reservation[]>>('/reservations/current')
    return response
  },
  
  async create(data: Partial<Reservation>) {
    const response = await api.post<ApiResponse<Reservation>>('/reservations', data)
    return response
  },
  
  async update(id: string, data: Partial<Reservation>) {
    const response = await api.put<ApiResponse<Reservation>>(`/reservations/${id}`, data)
    return response
  },
  
  async delete(id: string) {
    const response = await api.delete<ApiResponse<void>>(`/reservations/${id}`)
    return response
  }
}

export default reservationsService 