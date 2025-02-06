import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ... reste du code 