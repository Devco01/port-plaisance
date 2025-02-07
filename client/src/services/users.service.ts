const usersService = {
  // Routes utilisateurs avec email comme identifiant
  async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'
    })
    return response.json()
  },

  async getOne(email: string) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${email}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'
    })
    return response.json()
  },

  async create(user: { username: string; email: string; password: string; role: string }) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(user),
      mode: 'cors',
      credentials: 'include'
    })
    return response.json()
  },

  async update(email: string, data: Partial<User & { password?: string }>) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${email}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
      mode: 'cors',
      credentials: 'include'
    })
    return response.json()
  },

  async delete(email: string) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${email}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      mode: 'cors',
      credentials: 'include'
    })
    return response.json()
  }
}

export default usersService 