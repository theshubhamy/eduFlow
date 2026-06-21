import api from '@/lib/api';

export const getStudents = async (page: number = 1, limit: number = 10) => {
  const { data } = await api.get(`/api/students?page=${page}&limit=${limit}`);
  return data;
};

export const getAdmissionClasses = async () => {
  const { data } = await api.get('/api/students/create');
  return data;
};

export const admitStudent = async (payload: any) => {
  const { data } = await api.post('/api/students', payload);
  return data;
};

export const deleteStudent = async (id: string) => {
  const { data } = await api.delete(`/api/students/${id}`);
  return data;
};
