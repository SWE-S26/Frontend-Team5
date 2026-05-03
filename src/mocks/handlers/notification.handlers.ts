import { http, HttpResponse } from "msw";
import { MOCK_NOTIFICATIONS } from "@/components/notifications/NotificationItem";

const BASE = "/api/notifications/v1";

export const notificationHandlers = [
  // GET list
  http.get(BASE, ({ request }) => {
    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const read = url.searchParams.get("read");

    let filtered = [...MOCK_NOTIFICATIONS];
    if (read === "true") filtered = filtered.filter((n) => n.read);
    if (read === "false") filtered = filtered.filter((n) => !n.read);

    const start = (offset - 1) * limit;
    const slice = filtered.slice(start, start + limit);

    return HttpResponse.json({
      total: filtered.length,
      offset,
      limit,
      notifications: slice,
    });
  }),

  // GET unread count
  http.get(`${BASE}/unread-count`, () => {
    const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
    return HttpResponse.json({ unreadCount });
  }),

  // GET single
  http.get(`${BASE}/:notificationId`, ({ params }) => {
    const n = MOCK_NOTIFICATIONS.find((n) => n.notificationId === params.notificationId);
    if (!n)
      return HttpResponse.json({ message: "Property not found or not updated" }, { status: 404 });
    return HttpResponse.json(n);
  }),

  // PATCH mark one as read
  http.patch(`${BASE}/:notificationId/read`, ({ params }) => {
    const n = MOCK_NOTIFICATIONS.find((n) => n.notificationId === params.notificationId);
    if (!n)
      return HttpResponse.json({ message: "Property not found or not updated" }, { status: 404 });
    n.read = true;
    const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
    return HttpResponse.json({ notificationId: n.notificationId, read: true, unreadCount });
  }),

  // PATCH mark all as read
  http.patch(`${BASE}/read-all`, () => {
    MOCK_NOTIFICATIONS.forEach((n) => {
      n.read = true;
    });
    return HttpResponse.json({ unreadCount: 0 });
  }),
];
