import api from '@/lib/api';

export const getLeaves = async () => {
  const { data } = await api.get('/api/leaves');
  return data;
};

export const applyLeave = async (payload: { type: string; startDate: string; endDate: string; reason: string }) => {
  const { data } = await api.post('/api/leaves', payload);
  return data;
};

export const reviewLeave = async (payload: { leaveId: string; status: "approved" | "rejected" }) => {
  const { data } = await api.post('/api/leaves/approve', payload);
  return data;
};
