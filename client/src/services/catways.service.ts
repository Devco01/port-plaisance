export interface Catway {
  _id: string
  number: number
  length: number
  width: number
  status: string
}

export interface Reservation {
  catwayNumber: string
  clientName: string
  boatName: string
  startDate: string
  endDate: string
}

const catwaysService = {
  async getAll() {
    const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/catways`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      credentials: 'same-origin'
    })
    return response.json()
  },

  async getOne(id: string) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/catways/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      credentials: 'same-origin'
    })
    return response.json()
  },

  async create(catway: { number: number; length: number; width: number }) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/catways`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(catway),
      mode: 'cors',
      credentials: 'same-origin'
    })
    return response.json()
  },

  async update(id: string, data: { number?: number; length?: number; width?: number }) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/catways/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(data),
      mode: 'cors',
      credentials: 'same-origin'
    })
    return response.json()
  },

  async delete(id: string) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/catways/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      credentials: 'same-origin'
    })
    return response.json()
  },

  // Réservations
  async getReservations(catwayId: string) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/catways/${catwayId}/reservations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      credentials: 'same-origin'
    })
    return response.json()
  },

  async createReservation(catwayId: string, reservation: Omit<Reservation, '_id'>) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/catways/${catwayId}/reservations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(reservation),
      mode: 'cors',
      credentials: 'same-origin'
    })
    return response.json()
  }
}

export default catwaysService 