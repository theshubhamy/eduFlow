import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as noticesApi from '@/api/notices';

export const useNotices = () => {
  return useQuery({
    queryKey: ['notices'],
    queryFn: noticesApi.getNotices,
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noticesApi.createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
};
