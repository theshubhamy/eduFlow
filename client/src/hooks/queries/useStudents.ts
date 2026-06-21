import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as studentsApi from '@/api/students';

export const useStudents = (page: number = 1, limit: number = 10, enabled = true) => {
  return useQuery({
    queryKey: ['students', page, limit],
    queryFn: () => studentsApi.getStudents(page, limit),
    enabled,
  });
};

export const useAdmissionClasses = (enabled = true) => {
  return useQuery({
    queryKey: ['admissionClasses'],
    queryFn: studentsApi.getAdmissionClasses,
    enabled,
  });
};

export const useAdmitStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.admitStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};
