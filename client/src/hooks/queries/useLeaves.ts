import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as leavesApi from '@/api/leaves';

export const useLeaves = () => {
  return useQuery({
    queryKey: ['leaves'],
    queryFn: leavesApi.getLeaves,
  });
};

export const useApplyLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leavesApi.applyLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};

export const useReviewLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leavesApi.reviewLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};
