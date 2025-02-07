const API_URL = '';  // Doit rester vide car le proxy Vite gère les redirections

console.log('API URL:', API_URL);

interface RequestOptions extends RequestInit {
  token?: string;
  data?: any;
}

interface ApiError extends Error {
  status?: number;
  data?: any;
}

function handleApiError(error: any): never {
  const apiError = new Error(error.message) as ApiError;
  apiError.status = error.status;
  apiError.data = error.data;
  
  // Log détaillé pour le débogage
  console.error('API Error:', {
    message: error.message,
    status: error.status,
    data: error.data,
    stack: error.stack
  });
  
  throw apiError;
}

export const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
  const token = localStorage.getItem('token');
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 