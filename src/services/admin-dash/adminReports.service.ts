import api from "@/lib/api";
import {
  AdminReport,
  AdminReportsParams,
  AdminReportsResponse,
  SubmitReportPayload,
} from "@/types/admin-dash/adminReports.types";

export const adminReportsService = {
  listReports: async (params?: AdminReportsParams): Promise<AdminReportsResponse> => {
    const response = await api.get("/api/admin/v1/reports", { params });
    return response.data;
  },

  resolveReport: async (reportId: string): Promise<AdminReport> => {
    const response = await api.patch(`/api/admin/v1/reports/${reportId}/status`);
    return response.data;
  },

  submitReport: async (payload: SubmitReportPayload): Promise<AdminReport> => {
    const response = await api.post("/api/admin/v1/reports", payload);
    return response.data;
  },
};