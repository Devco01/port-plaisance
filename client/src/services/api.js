import axios from 'axios';

const api = axios.create({
    baseURL:
        process.env.NODE_ENV === 'production'
            ? 'https://port-plaisance.onrender.com'
            : 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Token ajouté aux headers:', {
            url: config.url,
            hasToken: !!token,
            tokenStart: token.substring(0, 20) + '...' // Log sécurisé du token
        });
    }
    return config;
});

// Intercepteur pour les erreurs
api.interceptors.response.use(
    response => response,
    error => {
        console.error('🔥 Erreur API:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    const response = await api.post('/api/login', { email, password });
    return response.data;
};

export const register = async userData => {
    const response = await api.post('/api/register', userData);
    return response.data;
};

export const getCatways = async () => {
    const response = await api.get('/api/catways');
    return response.data;
};

export const createReservation = async reservationData => {
    const response = await api.post(
        `/api/catways/${reservationData.catwayNumber}/reservations`,
        reservationData
    );
    return response.data;
};

export const getReservations = async () => {
    const response = await api.get('/api/catways');
    return response.data;
};

// Méthodes CRUD pour les catways
export const createCatway = async catwayData => {
    const response = await api.post('/api/catways', catwayData);
    return response.data;
};

export const updateCatway = async (id, catwayData) => {
    const response = await api.put(`/api/catways/${id}`, catwayData);
    return response.data;
};

export const deleteCatway = async id => {
    const response = await api.delete(`/api/catways/${id}`);
    return response.data;
};

// Méthodes CRUD pour les réservations
export const updateReservation = async (id, reservationData) => {
    const response = await api.put(
        `/api/catways/${reservationData.catwayNumber}/reservations/${id}`,
        reservationData
    );
    return response.data;
};

export const deleteReservation = async id => {
    const response = await api.delete(`/api/catways/${id}/reservations/${id}`);
    return response.data;
};

// Méthodes CRUD pour les utilisateurs
export const getUsers = async () => {
    const response = await api.get('/api/users');
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/api/users/${userData.email}`, userData);
    return response.data;
};

export const deleteUser = async id => {
    const response = await api.delete(`/api/users/${id.email}`);
    return response.data;
};

export default api;
