"use client";

import { useState, useMemo } from "react";
import { Search, UserX, ShieldOff, Eye, ShieldCheck } from "lucide-react";
import { useAdminUsers } from "@/hooks/admin-dash/useAdminUsers";
import { useAdminUserActions } from "@/hooks/admin-dash/useAdminUserActions";
import { AdminUser } from "@/types/admin-dash/adminUser.types";
import { useDebounce } from "@/hooks/useDebounce";

const LIMIT = 20;

type RoleFilter = "all" | "Listener" | "Pro";
type StatusFilter = "all" | "active" | "suspended";

const SuspendedBadge = ({ suspended }: { suspended: boolean }) => (
  <span
    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      !suspended ? "bg-green-500/20 text-green-400" : "bg-anger/20 text-anger"
    }`}
  >
    {suspended ? "suspended" : "active"}
  </span>
);

const RoleBadge = ({ role }: { role: AdminUser["role"] }) => {
  const styles: Record<AdminUser["role"], string> = {
    Pro: "bg-crusta/20 text-crusta",
    Listener: "bg-white/10 text-silver",
    Admin: "bg-white/10 text-silver",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[role]}`}>
      {role}
    </span>
  );
};

export default function ProfilesManagement() {
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(1);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const debouncedSearch = useDebounce(search, 400);

  const params = useMemo(
    () => ({
      offset,
      limit: LIMIT,
      ...(debouncedSearch ? { query: debouncedSearch } : {}),
      ...(roleFilter !== "all" ? { role: roleFilter } : {}),
      ...(statusFilter !== "all" ? { suspended: statusFilter === "suspended" } : {}),
    }),
    [offset, debouncedSearch, roleFilter, statusFilter]
  );

  const { users, total, loading, error, refetch } = useAdminUsers(params);
  const { suspendUser, unsuspendUser, deleteUser, loadingId } = useAdminUserActions(refetch);

  const totalPages = Math.ceil(total / LIMIT);

  const stats = useMemo(
    () => ({
      total,
      active: users.filter((u) => !u.suspended).length,
      suspended: users.filter((u) => u.suspended).length,
      pro: users.filter((u) => u.role === "Pro").length,
    }),
    [users, total]
  );

  const resetFilters = () => {
    setOffset(1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white-smoke">Profiles Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total },
          { label: "Active", value: stats.active, color: "text-green-400" },
          { label: "Suspended", value: stats.suspended, color: "text-anger" },
          { label: "Artist Pro", value: stats.pro, color: "text-brilliant-orange" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-off-black rounded-xl p-4 border border-white/5">
            <p className="text-silver text-sm">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color ?? "text-white-smoke"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOffset(1);
            }}
            placeholder="Search by username or email..."
            className="w-full bg-off-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white-smoke placeholder:text-silver focus:outline-none focus:border-brilliant-orange"
          />
        </div>

        {/* Role filter */}
        <div className="flex gap-1 bg-off-black border border-white/10 rounded-lg p-1">
          {(["all", "Listener", "Pro"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setRoleFilter(f);
                resetFilters();
              }}
              className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                roleFilter === f
                  ? "bg-brilliant-orange text-white"
                  : "text-silver hover:text-white-smoke"
              }`}
            >
              {f === "all" ? "All Roles" : f}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-1 bg-off-black border border-white/10 rounded-lg p-1">
          {(["all", "active", "suspended"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setStatusFilter(f);
                resetFilters();
              }}
              className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                statusFilter === f
                  ? "bg-brilliant-orange text-white"
                  : "text-silver hover:text-white-smoke"
              }`}
            >
              {f === "all" ? "All Status" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-anger text-sm">{error}</p>}

      {/* Table */}
      <div className="bg-off-black rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-silver text-left">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Tracks</th>
              <th className="px-4 py-3 font-medium">Followers</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-silver text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-silver text-center py-10">
                  No profiles found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.userId}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white-smoke font-medium">{user.displayName}</p>
                      <p className="text-silver text-xs">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <SuspendedBadge suspended={user.suspended} />
                  </td>
                  <td className="px-4 py-3 text-silver">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-white-smoke">{user.uploadedTracksCount}</td>
                  <td className="px-4 py-3 text-white-smoke">
                    {user.followersCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        title={user.suspended ? "Unsuspend" : "Suspend"}
                        disabled={loadingId === user.userId}
                        onClick={() =>
                          user.suspended
                            ? unsuspendUser(user.userId)
                            : suspendUser(user.userId, "Violation of community guidelines.")
                        }
                        className="p-1.5 rounded-lg text-silver hover:text-brilliant-orange hover:bg-brilliant-orange/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {user.suspended ? <ShieldCheck size={15} /> : <ShieldOff size={15} />}
                      </button>
                      <button
                        title="Delete"
                        disabled={loadingId === user.userId}
                        onClick={() => deleteUser(user.userId)}
                        className="p-1.5 rounded-lg text-silver hover:text-anger hover:bg-anger/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <UserX size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-silver">
            Page {offset} of {totalPages} — {total} total users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset((p) => Math.max(1, p - 1))}
              disabled={offset === 1}
              className="px-3 py-1.5 rounded-lg bg-off-black border border-white/10 text-silver hover:text-white-smoke disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset((p) => Math.min(totalPages, p + 1))}
              disabled={offset === totalPages}
              className="px-3 py-1.5 rounded-lg bg-off-black border border-white/10 text-silver hover:text-white-smoke disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}