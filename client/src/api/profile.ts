import api from "@/lib/api";

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export interface ChangePasswordPayload {
  current_password?: string;
  password?: string;
}

export const profileApi = {
  updateProfile: async (payload: UpdateProfilePayload) => {
    const res = await api.patch("/api/auth/profile", JSON.stringify(payload));
    return res.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const res = await api.put("/api/auth/password", JSON.stringify(payload));
    return res.data;
  },

  deleteAccount: async () => {
    const res = await api.delete("/api/auth/profile");
    return res.data;
  },
};
