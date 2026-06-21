import api from '@/lib/api';

// Teams
export const createTeam = async (teamData: unknown) => {
  const { data } = await api.post('/api/teams', teamData);
  return data;
};

export const updateTeam = async ({ teamId, ...teamData }: Record<string, unknown>) => {
  const { data } = await api.patch(`/api/teams/${teamId}`, teamData);
  return data;
};

export const deleteTeam = async (teamId: string) => {
  const { data } = await api.delete(`/api/teams/${teamId}`);
  return data;
};

export const switchTeam = async (teamId: string) => {
  const { data } = await api.post(`/api/teams/${teamId}/switch`);
  return data;
};

// Members
export const getMembers = async () => {
  const { data } = await api.get('/api/members');
  return data;
};

export const updateMemberRole = async ({ teamId, memberUserId, role }: Record<string, unknown>) => {
  const { data } = await api.patch(`/api/teams/${teamId}/members/${memberUserId}`, { role });
  return data;
};

export const removeMember = async ({ teamId, memberUserId }: Record<string, unknown>) => {
  const { data } = await api.delete(`/api/teams/${teamId}/members/${memberUserId}`);
  return data;
};

// Invitations
export const inviteMember = async ({ teamId, email, role }: Record<string, unknown>) => {
  const { data } = await api.post(`/api/teams/${teamId}/invitations`, { email, role });
  return data;
};

export const cancelInvitation = async ({ teamId, inviteCode }: Record<string, unknown>) => {
  const { data } = await api.delete(`/api/teams/${teamId}/invitations/${inviteCode}`);
  return data;
};

export const acceptInvitation = async (inviteCode: string) => {
  const { data } = await api.post(`/api/invitations/${inviteCode}/accept`);
  return data;
};

export const getInvitationInfo = async (inviteCode: string) => {
  const { data } = await api.get(`/api/invitations/${inviteCode}/accept`);
  return data;
};
