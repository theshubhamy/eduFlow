import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as attendanceApi from "@/api/attendance";

export const useAttendanceClasses = () => {
  return useQuery({
    queryKey: ["attendanceClasses"],
    queryFn: attendanceApi.getAttendanceClasses,
  });
};

export const useAttendanceRoster = (classId: string, date: string) => {
  return useQuery({
    queryKey: ["attendanceRoster", classId, date],
    queryFn: () => attendanceApi.getAttendanceRoster(classId, date),
    enabled: !!classId && !!date,
  });
};

export const useSaveAttendance = (classId: string, date: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.saveAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendanceRoster", classId, date],
      });
    },
  });
};
