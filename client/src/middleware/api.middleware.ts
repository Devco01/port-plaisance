const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
  token?: string;
  data?: any;
}

export async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const { token, data, ...fetchOptions } = options;
  
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || 'GET', `${API_URL}${endpoint}`);
      
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(xhr.statusText));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network Error'));
      
      xhr.send(config.body);
    });
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
} 