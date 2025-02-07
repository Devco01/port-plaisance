import { apiRequest } from '@/middleware/api.middleware';

export interface LoginResponse {
  success: boolean
  error?: string
  token: string
  user: {
    username: string
    email: string
    role: string
  }
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      data: { email, password },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.success) {
      // Nettoyage préventif
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Stockage des nouvelles données
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return response;
    } else {
      throw new Error(response.error || 'Erreur de connexion');
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
    const token = localStorage.getItem('token') || undefined;
    if (!token) {
      throw new Error('Non authentifié');
    }

    const data = await apiRequest('/api/auth/me', {
      token
    });
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
}; 