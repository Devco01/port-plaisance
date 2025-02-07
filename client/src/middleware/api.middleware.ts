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

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, data, ...fetchOptions } = options;
  
  // Garder le endpoint tel quel avec /api
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  console.log('API Request:', {
    baseUrl: API_URL,
    endpoint: cleanEndpoint,
    fullUrl: `${API_URL}${cleanEndpoint}`,
    method: options.method || 'GET',
    hasToken: !!token
  });
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_URL}${cleanEndpoint}`, {
      method: options.method || 'GET',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result as T;
  } catch (error) {
    handleApiError(error);
  }
} 