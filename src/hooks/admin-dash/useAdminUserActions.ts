import { useState } from "react";
import { adminUsersService } from "@/services/admin-dash/adminUsers.service";

export function useAdminUserActions(onSuccess: () => void) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const suspendUser = async (userId: string, reason: string) => {
    setLoadingId(userId);
    setError(null);
    try {
      await adminUsersService.suspendUser(userId, { reason });
      onSuccess();
    } catch {
      setError("Failed to suspend user.");
    } finally {
      setLoadingId(null);
    }
  };

  const unsuspendUser = async (userId: string) => {
    setLoadingId(userId);
    setError(null);
    try {
      await adminUsersService.unsuspendUser(userId);
      onSuccess();
    } catch {
      setError("Failed to unsuspend user.");
    } finally {
      setLoadingId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoadingId(userId);
    setError(null);
    try {
      await adminUsersService.deleteUser(userId);
      onSuccess();
    } catch {
      setError("Failed to delete user.");
    } finally {
      setLoadingId(null);
    }
  };

  return { suspendUser, unsuspendUser, deleteUser, loadingId, error };
}
