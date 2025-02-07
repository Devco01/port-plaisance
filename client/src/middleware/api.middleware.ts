const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
  token?: string;
  data?: any;
}

export async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const { token, data, ...fetchOptions } = options;
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': window.location.origin,
  });

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
    mode: 'cors',
    credentials: 'omit',
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
} 