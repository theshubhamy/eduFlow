import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as subjectsApi from '@/api/subjects';

export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: subjectsApi.getSubjects,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectsApi.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectsApi.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};
