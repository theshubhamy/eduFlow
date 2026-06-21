import api from '@/lib/api';

export const getSubjects = async () => {
  const { data } = await api.get('/api/subjects');
  return data;
};

export const createSubject = async (payload: any) => {
  const { data } = await api.post('/api/subjects', payload);
  return data;
};

export const deleteSubject = async (id: string) => {
  const { data } = await api.delete(`/api/subjects/${id}`);
  return data;
};
