import axios from 'axios';
import config from '../config/config';

const login = async (email, password) => {
    const url = `${config.apiUrl}/users/login`;
    console.log('🚀 Tentative de connexion:', {
        url,
        email
    });
    try {
        const response = await axios.post(url, {
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            return response.data;
        } else {
            throw new Error('Token non reçu du serveur');
        }
    } catch (error) {
        console.error('❌ Erreur de connexion:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config,
            url: error.config?.url
        });
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        throw error;
    }
};

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
};

const getToken = () => {
    return localStorage.getItem('token');
};

// Intercepteur pour ajouter le token à toutes les requêtes
axios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs d'authentification
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export { login, isAuthenticated, logout, getToken }; 