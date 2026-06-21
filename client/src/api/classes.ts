import api from '@/lib/api';

export const getClasses = async () => {
  const { data } = await api.get('/api/classes');
  return data;
};

export const createClass = async (payload: any) => {
  const { data } = await api.post('/api/classes', payload);
  return data;
};

export const deleteClass = async (id: string) => {
  const { data } = await api.delete(`/api/classes/${id}`);
  return data;
};
