import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as libraryApi from '@/api/library';

export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: libraryApi.getBooks,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryApi.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useLoans = () => {
  return useQuery({
    queryKey: ['loans'],
    queryFn: libraryApi.getLoans,
  });
};

export const useIssueBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryApi.issueBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: libraryApi.returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    },
  });
};
