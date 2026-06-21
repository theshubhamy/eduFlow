import api from '@/lib/api';

export const getNotices = async () => {
  const { data } = await api.get('/api/notices');
  return data;
};

export const createNotice = async (payload: { title: string; content: string; targetAudience: string }) => {
  const { data } = await api.post('/api/notices', payload);
  return data;
};
