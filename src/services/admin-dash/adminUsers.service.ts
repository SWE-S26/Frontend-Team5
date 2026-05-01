import api from "@/lib/api";
import {
  AdminUser,
  AdminUsersParams,
  AdminUsersResponse,
  SuspendUserPayload,
} from "@/types/admin";

export const adminUsersService = {
  listUsers: async (params?: AdminUsersParams): Promise<AdminUsersResponse> => {
    const response = await api.get("/api/admin/v1/users", { params });
    return response.data;
  },

  suspendUser: async (userId: string, payload: SuspendUserPayload): Promise<AdminUser> => {
    const response = await api.patch(`/api/admin/v1/users/${userId}/suspend`, payload);
    return response.data;
  },

  unsuspendUser: async (userId: string): Promise<AdminUser> => {
    const response = await api.patch(`/api/admin/v1/users/${userId}/unsuspend`);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/admin/v1/users/${userId}`);
    return response.data;
  },
};