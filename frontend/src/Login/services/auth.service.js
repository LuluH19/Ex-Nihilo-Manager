import api from '../../api/axios';

export const authService = {
    async loginUser(userType, email, password) {
        try {
            const response = await api.post(`/${userType}/login`, { email, password });
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de la connexion: ' + error.response?.data?.message || error.message);
        }
    },

    async registerUser(userType, formData) {
        try {
            const response = await api.post(`/${userType}/register`, formData);
            return response.data;
        } catch (error) {
            throw new Error('Erreur lors de l\'inscription: ' + error.response?.data?.message || error.message);
        }
    }
}; 