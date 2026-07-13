const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://184.168.126.71:8000/api';

/**
 * Custom fetch wrapper to handle authorization and API errors.
 */
async function fetchApi(endpoint, options = {}) {
  // Retrieve token if we are on the client side
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('master_admin_token');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Parse JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }

    if (!response.ok) {
      // Handle unauthorized explicitly
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('master_admin_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
        // Return a promise that never resolves to halt execution while redirecting
        return new Promise(() => { });
      }

      // Handle forbidden specifically (wrong role)
      if (response.status === 403 && typeof window !== 'undefined') {
        localStorage.removeItem('master_admin_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
        return new Promise(() => { });
      }

      throw new Error(data?.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint, options) => fetchApi(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => fetchApi(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) => fetchApi(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (endpoint, options) => fetchApi(endpoint, { method: 'DELETE', ...options }),
};
