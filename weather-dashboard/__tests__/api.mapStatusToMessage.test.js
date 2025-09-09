const { mapStatusToMessage } = require("../lib/api");

describe("mapStatusToMessage", () => {
  test("401 -> API key invalid", () => {
    expect(mapStatusToMessage(401)).toBe("API key invalid");
  });
  test("404 -> City not found", () => {
    expect(mapStatusToMessage(404)).toBe("City not found — check spelling");
  });
  test("429 -> Rate limit reached", () => {
    expect(mapStatusToMessage(429)).toBe("Rate limit reached — try again later");
  });
  test("other -> generic", () => {
    expect(mapStatusToMessage(500)).toBe("Failed to fetch weather");
  });
});
