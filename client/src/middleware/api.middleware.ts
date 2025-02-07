const API_URL = import.meta.env.VITE_API_URL;

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

export async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const { token, data, ...fetchOptions } = options;
  
  // Nettoyer l'endpoint pour éviter les doubles slashes
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const config = {
    ...fetchOptions,
    headers,
  };

  let body: string | null = null;
  if (data) {
    body = JSON.stringify(data);
  }

  try {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || 'GET', `${API_URL}${cleanEndpoint}`);
      xhr.withCredentials = true;
      
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = xhr.response ? JSON.parse(xhr.response) : {};
            resolve(data);
          } catch (e) {
            handleApiError({ message: 'Invalid JSON response', status: xhr.status });
          }
        } else {
          handleApiError({
            message: xhr.statusText || 'Unknown error',
            status: xhr.status,
            data: xhr.response ? JSON.parse(xhr.response) : null
          });
        }
      };
      
      xhr.onerror = () => {
        console.error('XHR Error:', xhr.status, xhr.statusText);
        handleApiError({
          message: 'Network Error',
          status: xhr.status,
          data: { url: `${API_URL}${cleanEndpoint}` }
        });
      };
      
      xhr.send(body);
    });
  } catch (error) {
    handleApiError(error);
  }
} 