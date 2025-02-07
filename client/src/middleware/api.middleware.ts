const API_URL = '';  // Doit rester vide car le proxy Vite gère les redirections

console.log('API URL:', API_URL);
console.log('Current origin:', window.location.origin);

interface RequestOptions extends RequestInit {
  token?: string;
  data?: any;
  credentials?: RequestCredentials;
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
  console.log('Request options:', { endpoint, ...options });  // Debug
  const token = localStorage.getItem('token');
  
  const body = options.data ? JSON.stringify(options.data) : undefined;
  console.log('Request body:', body);  // Debug

  const defaultOptions: RequestOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    method: options.method || 'GET',
    body,
    credentials: 'same-origin'
  };

  console.log('Final request options:', defaultOptions);  // Debug

  try {
    const fullUrl = `${window.location.origin}/api${endpoint}`;
    console.log('Requesting:', fullUrl);
    
    const response = await fetch(fullUrl, {
      ...defaultOptions,
    });

    const responseData = await response.json();
    console.log('Response:', responseData);  // Debug

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      throw {
        message: responseData.message || `HTTP error! status: ${response.status}`,
        status: response.status,
        data: responseData
      };
    }

    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 