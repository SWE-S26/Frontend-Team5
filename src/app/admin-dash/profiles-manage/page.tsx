"use client";

import { useState } from "react";
import { Search, UserX, ShieldOff, Eye } from "lucide-react";

type Status = "active" | "suspended";
type Role = "user" | "artist";

interface Profile {
  id: number;
  username: string;
  email: string;
  role: Role;
  status: Status;
  joinedAt: string;
  tracks: number;
  followers: number;
}

const mockProfiles: Profile[] = [
  { id: 1, username: "john_doe", email: "john@example.com", role: "user", status: "active", joinedAt: "2024-01-15", tracks: 12, followers: 340 },
  { id: 2, username: "jane_smith", email: "jane@example.com", role: "artist", status: "active", joinedAt: "2024-02-20", tracks: 45, followers: 1200 },
  { id: 3, username: "bad_actor", email: "bad@example.com", role: "user", status: "suspended", joinedAt: "2024-03-10", tracks: 0, followers: 5 },
  { id: 4, username: "music_lover", email: "music@example.com", role: "user", status: "active", joinedAt: "2024-04-05", tracks: 3, followers: 87 },
  { id: 5, username: "dj_vibes", email: "dj@example.com", role: "artist", status: "active", joinedAt: "2023-11-20", tracks: 78, followers: 5400 },
  { id: 6, username: "spam_user", email: "spam@example.com", role: "user", status: "suspended", joinedAt: "2024-05-01", tracks: 0, followers: 0 },
];

const StatusBadge = ({ status }: { status: Status }) => (
  <span
    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      status === "active" ? "bg-green-500/20 text-green-400" : "bg-anger/20 text-anger"
    }`}
  >
    {status}
  </span>
);

const RoleBadge = ({ role }: { role: Role }) => (
  <span
    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      role === "artist" ? "bg-brilliant-orange/20 text-brilliant-orange" : "bg-white/10 text-silver"
    }`}
  >
    {role}
  </span>
);

export default function ProfilesManagement() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [search, setSearch] = useState("");

  const filtered = profiles.filter(
    (p) =>
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: profiles.length,
    active: profiles.filter((p) => p.status === "active").length,
    suspended: profiles.filter((p) => p.status === "suspended").length,
    artists: profiles.filter((p) => p.role === "artist").length,
  };

  const toggleSuspend = (id: number) =>
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "suspended" : "active" } : p
      )
    );

  const deleteProfile = (id: number) =>
    setProfiles((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white-smoke">Profiles Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total },
          { label: "Active", value: stats.active, color: "text-green-400" },
          { label: "Suspended", value: stats.suspended, color: "text-anger" },
          { label: "Artists", value: stats.artists, color: "text-brilliant-orange" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-off-black rounded-xl p-4 border border-white/5">
            <p className="text-silver text-sm">{label}</p>
            <p className={`text-3xl font-bold mt-1 ${color ?? "text-white-smoke"}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email..."
          className="w-full bg-off-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white-smoke placeholder:text-silver focus:outline-none focus:border-brilliant-orange"
        />
      </div>

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
            {filtered.map((profile) => (
              <tr key={profile.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-white-smoke font-medium">{profile.username}</p>
                    <p className="text-silver text-xs">{profile.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={profile.role} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={profile.status} />
                </td>
                <td className="px-4 py-3 text-silver">{profile.joinedAt}</td>
                <td className="px-4 py-3 text-white-smoke">{profile.tracks}</td>
                <td className="px-4 py-3 text-white-smoke">{profile.followers.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      title="View Profile"
                      className="p-1.5 rounded-lg text-silver hover:text-white-smoke hover:bg-white/10 transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      title={profile.status === "active" ? "Suspend" : "Unsuspend"}
                      onClick={() => toggleSuspend(profile.id)}
                      className="p-1.5 rounded-lg text-silver hover:text-brilliant-orange hover:bg-brilliant-orange/10 transition-colors"
                    >
                      <ShieldOff size={15} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => deleteProfile(profile.id)}
                      className="p-1.5 rounded-lg text-silver hover:text-anger hover:bg-anger/10 transition-colors"
                    >
                      <UserX size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-silver text-center py-10">No profiles found.</p>
        )}
      </div>
    </div>
  );
}
