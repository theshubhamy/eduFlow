import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  profileApi,
  type UpdateProfilePayload,
  type ChangePasswordPayload,
} from "@/api/profile";
import { useLogout } from "./useAuth";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      profileApi.changePassword(payload),
  });
}

export function useDeleteAccount() {
  const logoutMutation = useLogout();
  return useMutation({
    mutationFn: () => profileApi.deleteAccount(),
    onSuccess: () => {
      logoutMutation.mutate();
    },
  });
}
