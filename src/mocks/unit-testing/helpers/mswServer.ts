import type { RequestHandler } from "msw";
import { setupServer } from "msw/node";

/** Origin used for fetch() in handler tests (MSW matches path regardless). */
export const TEST_API_ORIGIN = "http://localhost";

export function createTestServer(...handlers: RequestHandler[]) {
  return setupServer(...handlers);
}

export function testUrl(path: string) {
  return `${TEST_API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
