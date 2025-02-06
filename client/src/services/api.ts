import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { 
    User, 
    Catway, 
    Reservation, 
    ReservationFormData,
    LoginCredentials, 
    ApiResponse,
    NewCatway
} from '@/types/api';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';

// En développement, le proxy s'occupe de rediriger vers le bon port
const API_URL = '';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Erreur API:", error.response?.data || error.message);
        if (error.response?.status === 401) {
            const authStore = useAuthStore();
            authStore.logout();
        }
        return Promise.reject(error);
    }
);

// Configuration de base
const makeRequest = async <T>({ 
  url, 
  method, 
  data = null 
}: { 
  url: string; 
  method: string; 
  data?: any; 
}): Promise<ApiResponse<T>> => {
  try {
    console.log('🚀 Requête envoyée:', { url, method, data })
    const response = await axios({ url, method, data })
    console.log('✅ Réponse reçue:', response)
    return response.data
  } catch (error) {
    console.error('❌ Erreur:', error)
    throw error
  }
}

// Endpoints Catways
const getCatways = (): Promise<AxiosResponse<ApiResponse<Catway[]>>> => api.get('/catways');
const getCatway = (id: number): Promise<AxiosResponse<ApiResponse<Catway>>> => api.get(`/catways/${id}`);
const createCatway = (data: Partial<Catway>): Promise<AxiosResponse<ApiResponse<Catway>>> => api.post('/catways', data);
const updateCatway = (id: number, data: Partial<Catway>): Promise<AxiosResponse<ApiResponse<Catway>>> => api.put(`/catways/${id}`, data);
const deleteCatway = (id: number): Promise<AxiosResponse<ApiResponse<void>>> => api.delete(`/catways/${id}`);

// Endpoints Réservations
const getReservations = async (): Promise<AxiosResponse<ApiResponse<Reservation[]>>> => {
    try {
        // Récupérer d'abord la liste des catways
        const catwaysResponse = await api.get<ApiResponse<Catway[]>>('/catways');
        const catways = catwaysResponse.data.data;
        
        // Récupérer les réservations pour chaque catway
        const reservationsPromises = catways.map((catway: Catway) => 
            api.get<ApiResponse<Reservation[]>>(`/catways/${catway.catwayNumber}/reservations`)
        );
        
        const reservationsResponses = await Promise.all(reservationsPromises);
        
        // Combiner toutes les réservations
        const allReservations = reservationsResponses.flatMap(response => response.data.data || []);
        
        return {
            data: {
                success: true,
                data: allReservations
            }
        } as AxiosResponse<ApiResponse<Reservation[]>>;
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        throw error;
    }
};

const getCurrentReservations = async (): Promise<AxiosResponse<ApiResponse<Reservation[]>>> => {
    try {
        console.log("=== Récupération des réservations en cours ===");
        
        // Récupérer d'abord la liste des catways
        const catwaysResponse = await api.get<ApiResponse<Catway[]>>('/catways');
        const catways = catwaysResponse.data.data;
        
        // Récupérer toutes les réservations pour chaque catway
        const reservationsPromises = catways.map(async (catway: Catway) => {
            const response = await api.get<ApiResponse<Reservation[]>>(`/catways/${catway.catwayNumber}/reservations`);
            return response.data.data;
        });
        
        const allReservationsArrays = await Promise.all(reservationsPromises);
        
        // Filtrer pour ne garder que les réservations en cours
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        console.log("Date actuelle (locale):", today.toLocaleString());
        
        const currentReservations = allReservationsArrays
            .flat()
            .filter(reservation => {
                const startDate = new Date(reservation.startDate);
                const endDate = new Date(reservation.endDate);
                
                // Normaliser les dates en ignorant l'heure
                const normalizedStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                const normalizedEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                
                console.log("Vérification réservation:", {
                    id: reservation._id,
                    clientName: reservation.clientName,
                    startDate: normalizedStart.toLocaleDateString(),
                    today: today.toLocaleDateString(),
                    endDate: normalizedEnd.toLocaleDateString(),
                    isActive: normalizedStart <= today && normalizedEnd >= today
                });
                
                return normalizedStart <= today && normalizedEnd >= today;
            });
        
        console.log("Réservations en cours filtrées:", currentReservations);
        
        return {
            data: {
                success: true,
                data: currentReservations
            }
        } as AxiosResponse<ApiResponse<Reservation[]>>;
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations courantes:', error);
        throw error;
    }
};

const getReservationsByCatway = (catwayId: string): Promise<AxiosResponse<ApiResponse<Reservation[]>>> => {
    return api.get(`/catways/${catwayId}/reservations`);
}

const getReservation = (catwayId: string, reservationId: string): Promise<AxiosResponse<ApiResponse<Reservation>>> => 
    api.get(`/catways/${catwayId}/reservations/${reservationId}`)

const createReservation = (data: ReservationFormData): Promise<AxiosResponse<ApiResponse<Reservation>>> => {
    console.log('Création réservation:', data);
    // Utiliser directement catwayId comme catwayNumber
    return api.post(`/catways/${data.catwayId}/reservations`, {
        clientName: data.clientName,
        boatName: data.boatName,
        startDate: data.startDate,
        endDate: data.endDate
    });
};

const updateReservation = (data: ReservationFormData & { _id: string }): Promise<AxiosResponse<ApiResponse<Reservation>>> => 
    api.put(`/catways/${data.catwayId}/reservations/${data._id}`, data)

const deleteReservation = (catwayId: string, reservationId: string): Promise<AxiosResponse<ApiResponse<void>>> => 
    api.delete(`/catways/${catwayId}/reservations/${reservationId}`)

// Interfaces pour les utilisateurs
interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  nom?: string;
  prenom?: string;
}

interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
  nom?: string;
  prenom?: string;
}

// Endpoints Utilisateurs
const getUsers = (): Promise<AxiosResponse<ApiResponse<User[]>>> => api.get('/users');
const getUser = (email: string): Promise<AxiosResponse<ApiResponse<User>>> => api.get(`/users/${email}`);
const createUser = (data: CreateUserData): Promise<AxiosResponse<ApiResponse<User>>> => api.post('/users', data);
const updateUser = (email: string, data: UpdateUserData): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.put(`/users/${email}`, data);
const deleteUser = (email: string): Promise<AxiosResponse<ApiResponse<void>>> => api.delete(`/users/${email}`);

// Authentification
export const login = async (email: string, password: string) => {
    try {
        console.log("Envoi de la requête de connexion:", { email, password });
        const response = await api.post("/auth/login", { 
            email: email.trim(), 
            password: password.trim() 
        });
        console.log("Réponse de connexion:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Erreur de connexion:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        return await api.post("/auth/logout");
    } catch (error) {
        console.error("❌ Erreur de déconnexion:", error);
        throw error;
    }
};

export const getCurrentUser = () => api.get("/auth/me");

// Vérifier l'URL de l'API
console.log("API URL:", api.defaults.baseURL);

export {
    getCatways,
    getCatway,
    createCatway,
    updateCatway,
    deleteCatway,
    getReservations,
    getCurrentReservations,
    getReservationsByCatway,
    getReservation,
    createReservation,
    updateReservation,
    deleteReservation,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};

export default api;
