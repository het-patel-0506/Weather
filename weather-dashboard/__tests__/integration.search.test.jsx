const React = require("react");
const { render, screen, fireEvent, waitFor } = require("@testing-library/react");
const App = require("../pages/index.jsx").default;

describe("search flow", () => {
  beforeEach(() => {
    global.fetch = jest.fn(async (url) => {
      if (String(url).includes("/api/weather") && String(url).includes("London")) {
        return {
          ok: true,
          json: async () => ({
            name: "London",
            sys: { country: "GB" },
            dt: 1700000000,
            main: { temp: 20, feels_like: 19, humidity: 50, pressure: 1000 },
            weather: [{ id: 800, description: "clear sky" }],
            wind: { speed: 3.2 },
          }),
        };
      }
      return { ok: false, status: 404, json: async () => ({ message: "City not found — check spelling" }) };
    });
  });

  test("loads success then renders card", async () => {
    render(React.createElement(App));
    const input = screen.getByRole("textbox", { name: /city/i });
    fireEvent.change(input, { target: { value: "London" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => expect(screen.getByText(/London/)).toBeInTheDocument());
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
  });
});
