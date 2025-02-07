import { apiRequest } from '@/middleware/api.middleware';

export interface User {
  username: string;
  email: string;
  role: string;
}

const usersService = {
  // Routes utilisateurs avec email comme identifiant
  getAll: () => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest('/api/users', { token })
  },

  getUser: (email: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/users/${email}`, { token })
  },

  create: (user: { username: string; email: string; password: string; role: string }) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest('/api/users', {
      method: 'POST',
      token,
      data: user
    })
  },

  update: (email: string, data: Partial<User & { password?: string }>) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/users/${email}`, {
      method: 'PUT',
      token,
      data
    })
  },

  delete: (email: string) => {
    const token = localStorage.getItem('token') || undefined
    return apiRequest(`/api/users/${email}`, {
      method: 'DELETE',
      token
    })
  }
}

export default usersService 