//* ======================== API Integration ======================== */

export type FeedItemType = "track" | "playlist";

export interface FeedItem {
  id: string;
  type: FeedItemType;
  isRepost: boolean;
  createdAt: string;
  actorId: string;
  displayName: string;
  imgLink: string;
}

export interface GetFeedErrorResponse {
  success: false;
  message: string;
  code: number;
}
