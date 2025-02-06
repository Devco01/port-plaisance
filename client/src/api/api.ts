﻿import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = Bearer \;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Erreur API:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            // Gérer la déconnexion ici si nécessaire
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default api;
