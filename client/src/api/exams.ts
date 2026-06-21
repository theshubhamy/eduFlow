import api from "@/lib/api";

export const getExams = async (classId?: string) => {
  const url = classId ? `/api/exams?class_id=${classId}` : "/api/exams";
  const { data } = await api.get(url);
  return data;
};

export const getExamResults = async (examId: string) => {
  const { data } = await api.get(`/api/exams/results?examId=${examId}`);
  return data;
};

export const scheduleExam = async (payload: any) => {
  const { data } = await api.post("/api/exams", payload);
  return data;
};

export const submitGrades = async (payload: {
  examId: string;
  marks: any[];
}) => {
  const { data } = await api.post("/api/exams/marks", payload);
  return data;
};
