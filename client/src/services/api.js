import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export const login = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
};

export const getCatways = async () => {
    const response = await api.get('/catways');
    return response.data;
};

export const createReservation = async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
};

export const getReservations = async () => {
    const response = await api.get('/reservations');
    return response.data;
};

// Méthodes CRUD pour les catways
export const createCatway = async (catwayData) => {
    const response = await api.post('/catways', catwayData);
    return response.data;
};

export const updateCatway = async (id, catwayData) => {
    const response = await api.put(`/catways/${id}`, catwayData);
    return response.data;
};

export const deleteCatway = async (id) => {
    const response = await api.delete(`/catways/${id}`);
    return response.data;
};

// Méthodes CRUD pour les réservations
export const updateReservation = async (id, reservationData) => {
    const response = await api.put(`/reservations/${id}`, reservationData);
    return response.data;
};

export const deleteReservation = async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
};

// Méthodes CRUD pour les utilisateurs
export const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

export default api;
