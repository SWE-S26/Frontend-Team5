// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth.handlers";
import { tracksHandlers } from "./handlers/tracks.handlers";

export const worker = setupWorker(...authHandlers);
