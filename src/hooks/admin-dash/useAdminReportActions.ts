import { useState } from "react";
import { ReportViolatorType } from "@/types/admin-dash/adminReports.types";
import { adminReportsService } from "@/services/admin-dash/adminReports.service";
import { adminTracksService } from "@/services/admin-dash/adminTracks.service";
import { adminUsersService } from "@/services/admin-dash/adminUsers.service";

export function useAdminReportActions() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const resolveReport = async (reportId: string) => {
    setLoadingId(reportId);
    try {
      await adminReportsService.resolveReport(reportId);
    } finally {
      setLoadingId(null);
    }
  };

  const deleteAndResolve = async (
    reportId: string,
    violatorId: string,
    violatorType: ReportViolatorType
  ) => {
    setLoadingId(reportId);
    try {
      if (violatorType === "track") {
        await adminTracksService.deleteTrack(violatorId);
      } else {
        await adminUsersService.deleteUser(violatorId);
      }
      await adminReportsService.resolveReport(reportId);
    } finally {
      setLoadingId(null);
    }
  };

  return { resolveReport, deleteAndResolve, loadingId };
}
