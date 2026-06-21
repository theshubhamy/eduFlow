import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as timetableApi from '@/api/timetable';

export const useTimetable = (classId: string) => {
  return useQuery({
    queryKey: ['timetable', classId],
    queryFn: () => timetableApi.getTimetable(classId),
  });
};

export const useCreateTimetableEntry = (classId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timetableApi.createTimetableEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable', classId] });
    },
  });
};

export const useDeleteTimetableEntry = (classId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: timetableApi.deleteTimetableEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable', classId] });
    },
  });
};
