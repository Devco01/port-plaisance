import { apiRequest } from '@/middleware/api.middleware';

export interface User {
  username: string;
  email: string;
  role: string;
}

const usersService = {
  // Routes utilisateurs avec email comme identifiant
  async getAll() {
    const token = localStorage.getItem('token')
    return apiRequest('/users', { token })
  },

  async getOne(email: string) {
    const token = localStorage.getItem('token')
    return apiRequest(`/users/${email}`, { token })
  },

  async create(user: { username: string; email: string; password: string; role: string }) {
    const token = localStorage.getItem('token')
    return apiRequest('/users', {
      method: 'POST',
      token,
      data: user
    })
  },

  async update(email: string, data: Partial<User & { password?: string }>) {
    const token = localStorage.getItem('token')
    return apiRequest(`/users/${email}`, {
      method: 'PUT',
      token,
      data
    })
  },

  async delete(email: string) {
    const token = localStorage.getItem('token')
    return apiRequest(`/users/${email}`, {
      method: 'DELETE',
      token
    })
  }
}

export default usersService 