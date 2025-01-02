import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Ajout d'intercepteurs pour mieux gérer les erreurs
instance.interceptors.response.use(
    response => response,
    error => {
        console.error('Erreur API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default instance;