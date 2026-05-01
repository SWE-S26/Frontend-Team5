export interface AdminAnalyticsOverview {
  totalUsers: number;
  proToListenersRatio: number;
  totalTracks: number;
  totalPlays: number;
}

export interface AdminAnalyticsStorage {
  usedBytes: number;
}