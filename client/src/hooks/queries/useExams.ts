import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as examsApi from '@/api/exams';

export const useExams = (classId?: string) => {
  return useQuery({
    queryKey: ['exams', classId || 'all'],
    queryFn: () => examsApi.getExams(classId),
  });
};

export const useExamResults = (examId: string) => {
  return useQuery({
    queryKey: ['examResults', examId],
    queryFn: () => examsApi.getExamResults(examId),
    enabled: !!examId,
  });
};

export const useScheduleExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examsApi.scheduleExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
};

export const useSubmitGrades = (examId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: examsApi.submitGrades,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examResults', examId] });
    },
  });
};
