import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as teamApi from "@/api/team";

// Teams
export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.updateTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useSwitchTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.switchTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

// Members
export const useMembers = (teamId?: string) => {
  return useQuery({
    queryKey: ["teamMembers", teamId],
    queryFn: teamApi.getMembers,
    enabled: !!teamId,
  });
};

export const useUpdateMemberRole = (teamId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.updateMemberRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers", teamId] });
    },
  });
};

export const useRemoveMember = (teamId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers", teamId] });
    },
  });
};

// Invitations
export const useInviteMember = (teamId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.inviteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers", teamId] });
    },
  });
};

export const useCancelInvitation = (teamId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.cancelInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers", teamId] });
    },
  });
};

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teamApi.acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useInvitationInfo = (inviteCode: string) => {
  return useQuery({
    queryKey: ["invitation", inviteCode],
    queryFn: () => teamApi.getInvitationInfo(inviteCode),
    enabled: !!inviteCode,
  });
};
