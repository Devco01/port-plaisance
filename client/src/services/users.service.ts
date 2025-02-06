import api from './api.service'

export interface User {
  username: string
  email: string
  role: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

const usersService = {
  // Routes utilisateurs avec email comme identifiant
  async getAll() {
    const response = await api.get<ApiResponse<User[]>>('/users')
    return response
  },

  async getOne(email: string) {
    const response = await api.get(`/users/${email}`)
    return response
  },

  async create(user: { username: string; email: string; password: string; role: string }) {
    const response = await api.post('/users', user)
    return response
  },

  async update(email: string, data: Partial<User & { password?: string }>) {
    const response = await api.put(`/users/${email}`, data)
    return response
  },

  async delete(email: string) {
    const response = await api.delete(`/users/${email}`)
    return response
  }
}

export default usersService 