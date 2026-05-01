import { useState, useEffect, useCallback } from "react";
import { AdminReport, AdminReportsParams } from "@/types/admin-dash/adminReports.types";
import { adminReportsService } from "@/services/admin-dash/adminReports.service";

export function useAdminReports(params?: AdminReportsParams) {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminReportsService.listReports(params);
      setReports(data.reports);
      setTotal(data.total);
    } catch {
      setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, total, loading, error };
}