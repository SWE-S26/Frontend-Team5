import { useState, useEffect } from "react";
import { AdminAnalyticsOverview, AdminAnalyticsStorage } from "@/types/admin-dash/adminAnalytics.types";
import { adminAnalyticsService } from "@/services/admin-dash/adminAnalytics.service";

export function useAdminAnalytics() {
  const [overview, setOverview] = useState<AdminAnalyticsOverview | null>(null);
  const [storage, setStorage] = useState<AdminAnalyticsStorage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const [overviewData, storageData] = await Promise.all([
          adminAnalyticsService.getOverview(),
          adminAnalyticsService.getStorage(),
        ]);
        setOverview(overviewData);
        setStorage(storageData);
      } catch {
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { overview, storage, loading, error };
}