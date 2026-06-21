import api from '@/lib/api';

// Students
export const getStudents = async (params?: unknown) => {
  const { data } = await api.get('/api/students', { params });
  return data;
};

export const getStudentFormContext = async () => {
  const { data } = await api.get('/api/students/create');
  return data;
};

export const createStudent = async (studentData: unknown) => {
  const { data } = await api.post('/api/students', studentData);
  return data;
};

// Classes
export const getClasses = async () => {
  const { data } = await api.get('/api/classes');
  return data;
};

export const createClass = async (classData: unknown) => {
  const { data } = await api.post('/api/classes', classData);
  return data;
};

export const deleteClass = async (id: string) => {
  const { data } = await api.delete(`/api/classes/${id}`);
  return data;
};

// Subjects
export const getSubjects = async () => {
  const { data } = await api.get('/api/subjects');
  return data;
};

export const createSubject = async (subjectData: unknown) => {
  const { data } = await api.post('/api/subjects', subjectData);
  return data;
};

export const deleteSubject = async (id: string) => {
  const { data } = await api.delete(`/api/subjects/${id}`);
  return data;
};

// Attendance
export const getAttendanceClasses = async () => {
  const { data } = await api.get('/api/attendance');
  return data;
};

export const getAttendanceFormContext = async (params: unknown) => {
  const { data } = await api.get('/api/attendance/create', { params });
  return data;
};

export const createAttendance = async (attendanceData: unknown) => {
  const { data } = await api.post('/api/attendance', attendanceData);
  return data;
};
