import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as featuresApi from '@/api/features';

// Dashboard
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: featuresApi.getDashboardStats,
  });
};

// Notices
export const useNotices = (params?: unknown) => {
  return useQuery({
    queryKey: ['notices', params],
    queryFn: () => featuresApi.getNotices(params),
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featuresApi.createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
};

// Exams
export const useExams = (params?: unknown) => {
  return useQuery({
    queryKey: ['exams', params],
    queryFn: () => featuresApi.getExams(params),
  });
};

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featuresApi.createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
};

export const useExamResults = (params?: unknown) => {
  return useQuery({
    queryKey: ['examResults', params],
    queryFn: () => featuresApi.getExamResults(params),
  });
};

export const useEnterExamMarks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featuresApi.enterExamMarks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examResults'] });
    },
  });
};

// Library
export const useLibraryBooks = (params?: unknown) => {
  return useQuery({
    queryKey: ['libraryBooks', params],
    queryFn: () => featuresApi.getLibraryBooks(params),
  });
};

export const useCreateLibraryBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featuresApi.createLibraryBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryBooks'] });
    },
  });
};

export const useLibraryLoans = (params?: unknown) => {
  return useQuery({
    queryKey: ['libraryLoans', params],
    queryFn: () => featuresApi.getLibraryLoans(params),
  });
};

export const useIssueLibraryBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featuresApi.issueLibraryBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryLoans'] });
      queryClient.invalidateQueries({ queryKey: ['libraryBooks'] });
    },
  });
};

export const useReturnLibraryBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featuresApi.returnLibraryBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryLoans'] });
      queryClient.invalidateQueries({ queryKey: ['libraryBooks'] });
    },
  });
};

// Leaves
export const useLeaves = (params?: unknown) => {
  return useQuery({
    queryKey: ['leaves', params],
    queryFn: () => featuresApi.getLeaves(params),
  });
};

export const useApplyLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featuresApi.applyLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};

export const useApproveLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featuresApi.approveLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};

// Timetable
export const useTimetable = (params?: unknown) => {
  return useQuery({
    queryKey: ['timetable', params],
    queryFn: () => featuresApi.getTimetable(params),
  });
};

export const useCreateTimetableEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featuresApi.createTimetableEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
};

export const useDeleteTimetableEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featuresApi.deleteTimetableEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
};
