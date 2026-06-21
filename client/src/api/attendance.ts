import api from '@/lib/api';

export const getAttendanceClasses = async () => {
  const { data } = await api.get('/api/attendance');
  return data;
};

export const getAttendanceRoster = async (classId: string, date: string) => {
  const { data } = await api.get(`/api/attendance/create?class_id=${classId}&date=${date}`);
  return data;
};

export const saveAttendance = async (payload: { class_id: string; date: string; attendance: Record<string, string> }) => {
  const { data } = await api.post('/api/attendance', payload);
  return data;
};
