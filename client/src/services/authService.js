import axios from 'axios';
import config from '../config/config';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Login
export const login = async (email, password) => {
    const url = `${config.apiUrl}/login`;
    console.log('🚀 Tentative de connexion:', {
        url,
        email,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });

    try {
        const response = await axios.post(
            url,
            {
                email,
                password
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        );

        console.log('✅ Réponse serveur:', {
            status: response.status,
            hasData: !!response.data,
            hasToken: !!response.data?.token
        });

        if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
            console.log('✅ Token stocké:', {
                hasToken: !!response.data.token,
                length: response.data.token.length
            });
            axios.defaults.headers.common['Authorization'] =
                `Bearer ${response.data.token}`;
            return response.data;
        } else {
            throw new Error('Token non reçu du serveur');
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
};

// Register
export const register = async userData => {
    try {
        const response = await axios.post(
            `${API_URL}/users/register`,
            userData
        );

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            return response.data;
        }

        throw new Error('Token non reçu');
    } catch (error) {
        console.error("Erreur d'inscription:", error);
        throw error;
    }
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// Get current user token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Get current user info from token
export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            // Decode token and get user info
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => {
                        return (
                            '%' +
                            ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                        );
                    })
                    .join('')
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Erreur de décodage du token:', error);
            return null;
        }
    }
    return null;
};

export default {
    login,
    register,
    logout,
    isAuthenticated,
    getToken,
    getCurrentUser
};
