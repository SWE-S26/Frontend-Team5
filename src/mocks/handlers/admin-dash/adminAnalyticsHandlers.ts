import { http, HttpResponse } from "msw";

export const adminAnalyticsHandlers = [
  http.get("/api/admin/v1/analytics/overview", () => {
    return HttpResponse.json({
      totalUsers: 1520,
      proToListenersRatio: 0.08,
      totalTracks: 420,
      totalPlays: 50000,
    });
  }),

  http.get("/api/admin/v1/analytics/storage", () => {
    return HttpResponse.json({
      usedBytes: 524288000,
    });
  }),
];