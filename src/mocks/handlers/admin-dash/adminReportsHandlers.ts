import { http, HttpResponse } from "msw";
import { AdminReport, AdminReportsResponse } from "@/types/admin-dash/adminReports.types";

const mockReports: AdminReport[] = [
  {
    reportId: "rep_001",
    reportedId: "usr_001",
    reporterDisplayName: "John Doe",
    violatorId: "trk_004",
    violatorName: "Explicit Content",
    violatorType: "track",
    reason: "This track contains abusive content.",
    status: "pending",
    createdAt: "2025-06-01T08:00:00Z",
  },
  {
    reportId: "rep_002",
    reportedId: "usr_002",
    reporterDisplayName: "Jane Smith",
    violatorId: "usr_003",
    violatorName: "Bad Actor",
    violatorType: "user",
    reason: "This user is harassing others.",
    status: "pending",
    createdAt: "2025-06-02T08:00:00Z",
  },
  {
    reportId: "rep_003",
    reportedId: "usr_004",
    reporterDisplayName: "DJ Vibes",
    violatorId: "trk_006",
    violatorName: "Stolen Track",
    violatorType: "track",
    reason: "Copyright infringement.",
    status: "done",
    createdAt: "2025-06-03T08:00:00Z",
  },
  {
    reportId: "rep_004",
    reportedId: "usr_005",
    reporterDisplayName: "Music Lover",
    violatorId: "usr_006",
    violatorName: "Spam User",
    violatorType: "user",
    reason: "Spam account.",
    status: "pending",
    createdAt: "2025-06-04T08:00:00Z",
  },
  {
    reportId: "rep_005",
    reportedId: "usr_001",
    reporterDisplayName: "John Doe",
    violatorId: "trk_003",
    violatorName: "Midnight Beats",
    violatorType: "track",
    reason: "Inappropriate content.",
    status: "done",
    createdAt: "2025-06-05T08:00:00Z",
  },
];

export const adminReportsHandlers = [
  http.get("/api/admin/v1/reports", ({ request }) => {
    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");

    let filtered = [...mockReports];

    if (status) filtered = filtered.filter((r) => r.status === status);
    if (type) filtered = filtered.filter((r) => r.violatorType === type);

    const total = filtered.length;
    const start = (offset - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const response: AdminReportsResponse = {
      total,
      offset,
      limit,
      reports: paginated,
    };

    return HttpResponse.json(response);
  }),

  http.patch("/api/admin/v1/reports/:reportId/status", ({ params }) => {
    const { reportId } = params;
    const report = mockReports.find((r) => r.reportId === reportId);

    if (!report) {
      return HttpResponse.json({ message: "Property not found or not updated" }, { status: 404 });
    }

    if (report.status === "done") {
      return HttpResponse.json({ message: "Report is already resolved" }, { status: 409 });
    }

    report.status = "done";
    return HttpResponse.json(report);
  }),

  http.post("/api/admin/v1/reports", async ({ request }) => {
    const body = await request.json() as { violatorId: string; violatorType: string; reason: string };
    const newReport: AdminReport = {
      reportId: `rep_00${mockReports.length + 1}`,
      reportedId: "usr_000",
      reporterDisplayName: "Current User",
      violatorId: body.violatorId,
      violatorName: "Unknown",
      violatorType: body.violatorType as "user" | "track",
      reason: body.reason,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    mockReports.push(newReport);
    return HttpResponse.json(newReport, { status: 201 });
  }),
];