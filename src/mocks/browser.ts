// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth.handlers";
import { messageHandlers } from "./handlers/messageHandlers";
import { tracksHandlers } from "./handlers/tracks.handlers";
import { profileHandlers } from "./handlers/profile.handlers"
import { socialHandlers } from "./handlers/social.handlers"
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
  ...profileHandlers,
  ...socialHandlers,
  ...privacyHandlers,
  ...notificationHandlers,
  ...accountHandlers,
  ...contentHandlers,
);
