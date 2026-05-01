// src/hooks/useSubmitReport.ts

import { useState } from "react";
import { adminReportsService } from "@/services/admin-dash/adminReports.service";
import axios from "axios";

export function useSubmitReport() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async (
    violatorId: string,
    violatorType: "user" | "track",
    reason: string
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await adminReportsService.submitReport({ violatorId, violatorType, reason });
      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        setError(message ?? "Failed to submit report.");
      } else {
        setError("Failed to submit report.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { submitReport, loading, success, error };
}