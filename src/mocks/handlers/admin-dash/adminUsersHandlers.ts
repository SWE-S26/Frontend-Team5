import { http, HttpResponse } from "msw";
import { AdminUser, AdminUsersResponse } from "@/types/admin-dash/adminUser.types";

const mockUsers: AdminUser[] = [
  {
    userId: "usr_001",
    displayName: "John Doe",
    email: "john.doe@example.com",
    role: "Listener",
    suspended: false,
    createdAt: "2025-01-10T09:00:00Z",
    uploadedTracksCount: 12,
    followersCount: 95,
  },
  {
    userId: "usr_002",
    displayName: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Listener",
    suspended: false,
    createdAt: "2025-02-20T10:00:00Z",
    uploadedTracksCount: 45,
    followersCount: 1200,
  },
  {
    userId: "usr_003",
    displayName: "Bad Actor",
    email: "bad.actor@example.com",
    role: "Listener",
    suspended: true,
    createdAt: "2025-03-10T11:00:00Z",
    uploadedTracksCount: 0,
    followersCount: 5,
  },
  {
    userId: "usr_004",
    displayName: "Music Lover",
    email: "music.lover@example.com",
    role: "Pro",
    suspended: false,
    createdAt: "2025-04-05T12:00:00Z",
    uploadedTracksCount: 3,
    followersCount: 87,
  },
  {
    userId: "usr_005",
    displayName: "DJ Vibes",
    email: "dj.vibes@example.com",
    role: "Listener",
    suspended: false,
    createdAt: "2024-11-20T08:00:00Z",
    uploadedTracksCount: 78,
    followersCount: 5400,
  },
  {
    userId: "usr_006",
    displayName: "Spam User",
    email: "spam.user@example.com",
    role: "Listener",
    suspended: true,
    createdAt: "2025-05-01T09:00:00Z",
    uploadedTracksCount: 0,
    followersCount: 0,
  },
];

export const adminUsersHandlers = [
  // GET /api/admin/v1/users
  http.get("/api/admin/v1/users", ({ request }) => {
    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const role = url.searchParams.get("role");
    const suspended = url.searchParams.get("suspended");
    const query = url.searchParams.get("query")?.toLowerCase();

    let filtered = [...mockUsers];

    if (role) {
      filtered = filtered.filter((u) => u.role === role);
    }

    if (suspended !== null && suspended !== "") {
      const isSuspended = suspended === "true";
      filtered = filtered.filter((u) => u.suspended === isSuspended);
    }

    if (query) {
      filtered = filtered.filter(
        (u) => u.displayName.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
      );
    }

    const total = filtered.length;
    const start = (offset - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const response: AdminUsersResponse = {
      total,
      offset,
      limit,
      users: paginated,
    };

    return HttpResponse.json(response);
  }),

  // PATCH /api/admin/v1/users/:userId/suspend
  http.patch("/api/admin/v1/users/:userId/suspend", ({ params }) => {
    const { userId } = params;
    const user = mockUsers.find((u) => u.userId === userId);

    if (!user) {
      return HttpResponse.json({ message: "Property not found or not updated" }, { status: 404 });
    }

    user.suspended = true;

    return HttpResponse.json(user);
  }),

  // PATCH /api/admin/v1/users/:userId/unsuspend
  http.patch("/api/admin/v1/users/:userId/unsuspend", ({ params }) => {
    const { userId } = params;
    const user = mockUsers.find((u) => u.userId === userId);

    if (!user) {
      return HttpResponse.json({ message: "Property not found or not updated" }, { status: 404 });
    }

    user.suspended = false;

    return HttpResponse.json(user);
  }),

  // DELETE /api/admin/v1/users/:userId
  http.delete("/api/admin/v1/users/:userId", ({ params }) => {
    const { userId } = params;
    const index = mockUsers.findIndex((u) => u.userId === userId);

    if (index === -1) {
      return HttpResponse.json({ message: "Property not found or not updated" }, { status: 404 });
    }

    mockUsers.splice(index, 1);

    return HttpResponse.json({ message: "User account permanently deleted." });
  }),
];
