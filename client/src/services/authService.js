import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Login
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, {
            email,
            password
        });
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            return response.data;
        }
        
        throw new Error('Token non reçu');
    } catch (error) {
        console.error('Erreur de connexion:', error);
        throw error;
    }
};

// Register
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, userData);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            return response.data;
        }
        
        throw new Error('Token non reçu');
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        throw error;
    }
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
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
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

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