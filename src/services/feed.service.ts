import api from "@/lib/api";
import { FeedItem } from "@/types/feed.types";

export const feedService = {
  getFeed: (offset = 0, limit = 20, includeReposts = true) =>
    api.get<FeedItem[]>(
      `/api/feed/v1/feed?offset=${offset}&limit=${limit}&includeReposts=${includeReposts}`,
    ),
};
