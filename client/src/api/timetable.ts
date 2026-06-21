import api from '@/lib/api';

export const getTimetable = async (classId: string) => {
  const url = classId ? `/api/timetable?class_id=${classId}` : '/api/timetable';
  const { data } = await api.get(url);
  return data;
};

export const createTimetableEntry = async (payload: any) => {
  const { data } = await api.post('/api/timetable', payload);
  return data;
};

export const deleteTimetableEntry = async (id: string) => {
  const { data } = await api.delete(`/api/timetable/${id}`);
  return data;
};
