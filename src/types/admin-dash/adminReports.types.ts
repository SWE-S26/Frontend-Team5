export type ReportStatus = "pending" | "done";
export type ReportViolatorType = "user" | "track";

export interface AdminReport {
  reportId: string;
  reportedId: string;
  reporterDisplayName: string;
  violatorId: string;
  violatorName: string;
  violatorType: ReportViolatorType;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

export interface AdminReportsResponse {
  total: number;
  offset: number;
  limit: number;
  reports: AdminReport[];
}

export interface AdminReportsParams {
  offset?: number;
  limit?: number;
  status?: ReportStatus;
  type?: ReportViolatorType;
}

export interface SubmitReportPayload {
  violatorId: string;
  violatorType: ReportViolatorType;
  reason: string;
}