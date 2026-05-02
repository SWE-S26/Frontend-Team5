/* Admin Users (Profiles) */
export interface AdminUser {
  userId: string;
  displayName: string;
  email: string;
  role: "Listener" | "Pro" | "Admin";
  suspended: boolean;
  createdAt: string;
  uploadedTracksCount: number;
  followersCount: number;
}
export interface AdminUsersResponse {
  total: number;
  offset: number;
  limit: number;
  users: AdminUser[];
}
export interface AdminUsersParams {
  offset?: number;
  limit?: number;
  role?: "Listener" | "Pro" | "Admin";
  suspended?: boolean;
  query?: string;
}
export interface SuspendUserPayload {
  reason: string;
}

