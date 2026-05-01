import { useState, useEffect, useCallback } from "react";
import { AdminUser, AdminUsersParams } from "@/types/admin";
import { adminUsersService } from "@/services/admin-dash/adminUsers.service";

export function useAdminUsers(params?: AdminUsersParams) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminUsersService.listUsers(params);
      setUsers(data.users);
      setTotal(data.total);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, total, loading, error, refetch: fetchUsers };
}