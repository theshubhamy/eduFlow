import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as classesApi from '@/api/classes';

export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getClasses,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classesApi.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: classesApi.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};
