import "@testing-library/jest-dom";
import "whatwg-fetch";

import { resetMockDb } from "@/test/msw/db";
import { server } from "@/test/msw/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  resetMockDb();
});
afterAll(() => server.close());
