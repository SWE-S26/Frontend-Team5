import api from "@/lib/api";
import { AdminAnalyticsOverview, AdminAnalyticsStorage } from "@/types/admin-dash/adminAnalytics.types";

export const adminAnalyticsService = {
  getOverview: async (): Promise<AdminAnalyticsOverview> => {
    const response = await api.get("/api/admin/v1/analytics/overview");
    return response.data;
  },

  getStorage: async (): Promise<AdminAnalyticsStorage> => {
    const response = await api.get("/api/admin/v1/analytics/storage");
    return response.data;
  },
};