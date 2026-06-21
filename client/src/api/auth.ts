import api from '@/lib/api';

export const getCurrentUser = async () => {
  const { data } = await api.post('/api/auth/me');
  return data;
};

export const login = async (credentials: Record<string, unknown>) => {
  const { data } = await api.post('/api/auth/login', credentials);
  return data;
};

export const register = async (userData: Record<string, unknown>) => {
  const { data } = await api.post('/api/auth/register', userData);
  return data;
};

export const logout = async () => {
  const { data } = await api.post('/api/auth/logout');
  return data;
};
