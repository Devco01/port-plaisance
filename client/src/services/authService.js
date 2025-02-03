import axios from 'axios';
import config from '../config/config';

const login = async (email, password) => {
    const url = `${config.apiUrl}/login`;
    console.log('🚀 Tentative de connexion:', {
        url,
        email,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
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
            axios.defaults.headers.common['Authorization'] = `