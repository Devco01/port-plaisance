import api from './api.service'

export interface LoginResponse {
  success: boolean
  data: {
    token: string
    user: {
      id: string
      username: string
      email: string
      role: string
    }
  }
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success) {
      // Nettoyage préventif
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Stockage des nouvelles données
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      return response.data;
    } else {
      throw new Error(response.data.error || 'Erreur de connexion');
    }
  } catch (error: any) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    // Nettoyage du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return { success: true };
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Non authentifié');
    }

    const response = await api.get('/auth/me');

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
}; 