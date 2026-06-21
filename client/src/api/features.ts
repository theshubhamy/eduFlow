import api from '@/lib/api';

// Dashboard
export const getDashboardStats = async () => {
  const { data } = await api.get('/api/dashboard/stats');
  return data;
};

// Notices
export const getNotices = async (params?: unknown) => {
  const { data } = await api.get('/api/notices', { params });
  return data;
};

export const createNotice = async (noticeData: unknown) => {
  const { data } = await api.post('/api/notices', noticeData);
  return data;
};

// Exams
export const getExams = async (params?: unknown) => {
  const { data } = await api.get('/api/exams', { params });
  return data;
};

export const createExam = async (examData: unknown) => {
  const { data } = await api.post('/api/exams', examData);
  return data;
};

export const getExamResults = async (params?: unknown) => {
  const { data } = await api.get('/api/exams/results', { params });
  return data;
};

export const enterExamMarks = async (marksData: unknown) => {
  const { data } = await api.post('/api/exams/marks', marksData);
  return data;
};

// Library
export const getLibraryBooks = async (params?: unknown) => {
  const { data } = await api.get('/api/library/books', { params });
  return data;
};

export const createLibraryBook = async (bookData: unknown) => {
  const { data } = await api.post('/api/library/books', bookData);
  return data;
};

export const getLibraryLoans = async (params?: unknown) => {
  const { data } = await api.get('/api/library/loans', { params });
  return data;
};

export const issueLibraryBook = async (issueData: unknown) => {
  const { data } = await api.post('/api/library/loans/issue', issueData);
  return data;
};

export const returnLibraryBook = async (returnData: unknown) => {
  const { data } = await api.post('/api/library/loans/return', returnData);
  return data;
};

// Leaves
export const getLeaves = async (params?: unknown) => {
  const { data } = await api.get('/api/leaves', { params });
  return data;
};

export const applyLeave = async (leaveData: unknown) => {
  const { data } = await api.post('/api/leaves', leaveData);
  return data;
};

export const approveLeave = async (approveData: unknown) => {
  const { data } = await api.post('/api/leaves/approve', approveData);
  return data;
};

// Timetable
export const getTimetable = async (params?: unknown) => {
  const { data } = await api.get('/api/timetable', { params });
  return data;
};

export const createTimetableEntry = async (entryData: unknown) => {
  const { data } = await api.post('/api/timetable', entryData);
  return data;
};

export const deleteTimetableEntry = async (id: string) => {
  const { data } = await api.delete(`/api/timetable/${id}`);
  return data;
};
