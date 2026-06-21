import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as academicApi from '@/api/academic';

// Students
export const useStudents = (params?: unknown) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => academicApi.getStudents(params),
  });
};

export const useStudentFormContext = () => {
  return useQuery({
    queryKey: ['students', 'formContext'],
    queryFn: academicApi.getStudentFormContext,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicApi.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Classes
export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: academicApi.getClasses,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicApi.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicApi.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

// Subjects
export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: academicApi.getSubjects,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicApi.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicApi.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

// Attendance
export const useAttendanceClasses = () => {
  return useQuery({
    queryKey: ['attendanceClasses'],
    queryFn: academicApi.getAttendanceClasses,
  });
};

export const useAttendanceFormContext = (params: unknown) => {
  return useQuery({
    queryKey: ['attendanceFormContext', params],
    queryFn: () => academicApi.getAttendanceFormContext(params),
    enabled: !!params,
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: academicApi.createAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceClasses'] });
    },
  });
};
