// src/mocks/browser.ts
import { setupWorker } from "msw/browser"
import { authHandlers } from "./handlers/auth.handlers"
import { messageHandlers } from "./handlers/messageHandlers"

export const worker = setupWorker(...authHandlers, ...messageHandlers)