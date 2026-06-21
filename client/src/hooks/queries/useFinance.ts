import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as financeApi from '@/api/finance';

// Fees
export const useFees = (params?: unknown) => {
  return useQuery({
    queryKey: ['fees', params],
    queryFn: () => financeApi.getFees(params),
  });
};

export const useCreateFeeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.createFeeCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
};

export const useAllocateFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.allocateFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
};

// Payments
export const usePayments = (params?: unknown) => {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => financeApi.getPayments(params),
  });
};

export const useCollectPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeApi.collectPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['fees'] }); // Collecting payment might affect fees
    },
  });
};

// We don't necessarily need a mutation for downloading receipt or exporting finance,
// since they just return blobs. Often they are handled via standard async functions or specialized hooks.
