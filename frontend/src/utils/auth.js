const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const setToken = (token) => {
  if (!token) {
    console.error('Attempted to set null/undefined token');
    return;
  }
  // Remove 'Bearer ' prefix if it exists
  const cleanToken = token.replace('Bearer ', '');
  localStorage.setItem(TOKEN_KEY, cleanToken);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
}; 