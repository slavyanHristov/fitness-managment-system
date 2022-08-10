import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "@/mocks/server";
import { setActivePinia, createPinia } from "pinia";

// import mockResponse

// Start server before all tests
beforeAll(() => {
  setActivePinia(createPinia());
  server.listen({ onUnhandledRequest: "error" });
});

// Close server after all tests

afterAll(() => server.close());

// Reset handlers after each test

afterEach(() => server.resetHandlers());
