// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth.handlers";
import { messageHandlers } from "./handlers/messageHandlers";
import { tracksHandlers } from "./handlers/tracks.handlers";
import { profileHandlers } from "./handlers/profile.handlers"
import { socialHandlers } from "./handlers/social.handlers"
import { paymentHandlers } from "./handlers/payment.handlers"
import { adminUsersHandlers } from "./handlers/admin-dash/adminUsersHandlers";
import { adminTracksHandlers } from "./handlers/admin-dash/adminTracksHandlers";
import { adminAnalyticsHandlers } from "./handlers/admin-dash/adminAnalyticsHandlers";
import { adminReportsHandlers } from "./handlers/admin-dash/adminReportsHandlers";
import { adminArtistAnalyticsHandlers } from "./handlers/admin-dash/adminArtistAnalyticsHandlers";
import { playlistsHandlers } from "./handlers/playlists.handlers";
import { playbackHandlers } from "./handlers/playback.handlers";
import { feedSearchHandlers } from "./handlers/feed-search.handlers";
import { engagementHandlers } from "./handlers/engagement.handlers";
import { 
  privacyHandlers, 
  notificationHandlers, 
  accountHandlers,
  contentHandlers,
 } from "./handlers/settings.handlers";

export const worker = setupWorker(
  ...authHandlers,
  ...messageHandlers,
  ...tracksHandlers,
  ...playlistsHandlers,
  ...playbackHandlers,
  ...feedSearchHandlers,
  ...engagementHandlers,
  ...profileHandlers,
  ...socialHandlers,
  ...privacyHandlers,
  ...notificationHandlers,
  ...accountHandlers,
  ...contentHandlers,
  ...paymentHandlers,
  ...adminUsersHandlers,
  ...adminTracksHandlers,
  ...adminAnalyticsHandlers,
  ...adminArtistAnalyticsHandlers,
  ...adminReportsHandlers,
);