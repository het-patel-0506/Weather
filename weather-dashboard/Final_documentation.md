### Weather Pro — Comprehensive Project Documentation

Short tagline: A fast, theme-aware weather dashboard offering fuzzy search, interactive maps, charts, and a smart nearest‑city resolver for raw coordinates, built for clarity, performance, and accessibility.

- Repository: `https://github.com/het-patel-0506/Weather`
- Website / Demo: `https://weather-dashboard-eight-theta.vercel.app/`
- Maintainers / Contact: Het Patel (GitHub: `het-patel-0506`)
- License: MIT
- Last updated: 2025-09-11


## 1) Product Overview

Weather Pro is a single-page web app that helps users quickly find weather for any city or map location. It combines:
- Smart search with fuzzy suggestions and keyboard flow,
- An interactive OpenStreetMap-based map with optional OpenWeather overlays,
- A nearest-city fallback so raw coordinates (e.g., a click in the countryside) return the most sensible city,
- Detailed weather presentation (main card, metrics, hourly strip, 5‑day panel, and chart),
- A theme-aware UI with strong contrast and accessibility improvements, and
- A non-blocking toast system for feedback (no browser alert popups).

The app is optimized to work even when some services (e.g., map overlays) are unavailable, preferring progressive disclosure and graceful degradation.


## 2) Detailed Features

### 2.1 Search & Suggestions
- Header search uses fuzzy matching (Fuse.js) to find city names, forgiving minor typos and partial inputs.
- Suggestions appear once the user types 2+ characters; hitting Enter selects the top suggestion if visible.
- Searches are debounced (300ms) to avoid unnecessary requests and improve responsiveness.
- Recent searches are stored in localStorage as `recentCities` and shown in the left panel for quick access.

Why it matters: users rarely remember exact spellings; fuzzy matching and recents keep flow quick and forgiving.

### 2.2 Interactive Map with Overlays
- The map uses Leaflet with an OSM base layer (works without any API key).
- Optional overlays (precipitation, radar/clouds, temperature) can be toggled from Settings; they use OpenWeather tile endpoints and require a public key for tiles only.
- Clicking the map drops a temporary marker and opens a popup with lat/lon plus a “Get Weather Here” action.

Why it matters: the map provides spatial exploration and is useful when you don’t know the city name.

### 2.3 Nearest‑City Fallback for Coordinates
- If a search value contains coordinates, the serverless API reads the lat/lon and queries OpenWeather by coordinates instead of by city name.
- OpenWeather returns the nearest location; we pass it back to the client (e.g., a click near Ahmedabad yields “Ahmedabad”).

Why it matters: clicking somewhere near a city must “just work” — no “city not found” dead‑ends.

### 2.4 Weather Presentation
- Main card shows city, country, current temperature, feels like, condition, with a clean typographic hierarchy.
- Metric tiles (humidity, wind, pressure, visibility) add context with subtle visual cues.
- Hourly strip summarizes the next hours with icons and chance of precipitation.
- A 24‑hour temperature chart offers a quick visual trend.
- 5‑day forecast panel shows day-by-day highs/lows, conditions, and per‑day detail selection.

Why it matters: multiple presentation forms help different users parse the weather at a glance.

### 2.5 Theme, Contrast, and Selection
- Global dark/light switch; dark mode uses soft neutrals with colored highlights, light mode uses white surfaces and black text for strong contrast.
- Selection highlight in light mode deliberately renders black text inside amber backgrounds (fixing poor contrast of yellow-on-yellow).
- Keyboard and a11y considerations: focus rings, aria labels in key areas, readable color contrasts.

Why it matters: readable, accessible UI makes the app inclusive and comfortable over long use.

### 2.6 Local Persistence & Settings
- LocalStorage stores recent cities, favorites, and settings (unit, theme, high contrast, map layer toggles).
- “Clear Location Data” removes favorites, recent cities, recent/favorite/history location lists and prompts the UI to refresh immediately (no stale items).

Why it matters: personalization without accounts, with a single-click reset when you want a fresh start.

### 2.7 Toast Notifications (No Blocking Alerts)
- The app surfaces short-lived messages via a floating toast in the top-right.
- Any part of the app can dispatch a toast via a `window` custom event; toasts auto-dismiss in 5 seconds and can be manually closed.

Why it matters: toasts inform without breaking user flow; no more modal alert popups that interrupt work.


## 3) Architecture & Technology

- Frontend: Next.js 15 (pages router), React 19, Tailwind CSS 4, Recharts for charts, Fuse.js for fuzzy search.
- Map: Leaflet + react-leaflet, OSM base tiles; optional OpenWeather layers.
- Backend/Proxy: Next.js API route at `pages/api/weather.js`, querying OpenWeatherMap, normalizing errors, and handling coordinate fallback.
- Hosting: Vercel; production alias points to the latest deployment for stable URL.
- Data model: no server DB — live data from OWM + localStorage for lightweight user state.

Performance strategies:
- Debounced search,
- SSR-safety via dynamic imports for Leaflet,
- Minimal client-side mapping of OWM responses,
- Non-blocking toasts rather than modal dialogs.

Availability strategies:
- Base map works without OWM tile key,
- Proxy centralizes errors and standardizes messages,
- UI falls back to mocks when permitted in dev (`mock=1`).


## 4) Folder & File Reference (Deep-Dive)

Path prefixes omitted for brevity (assume `weather-dashboard/…`).

### 4.1 pages/
- `_app.jsx`
  - Purpose: App shell; injects global Head tags (title “Weather Pro”, favicon), viewport meta.
  - Notes: The favicon path `/icons/sun-cloud.svg` is served from `public/icons/`.

- `index.jsx`
  - Purpose: Main page orchestrating header, left nav, main content, forecast, map, and settings.
  - Behavior:
    - Loads default city (London) on first mount if no data yet.
    - Wires search → `useWeather.search`.
    - Handles “Use My Location” via `useLocation.getCurrentLocation`.
    - Listens to several custom events from Settings (unitChange, themeChange, weatherRefresh, dataCleared, mapLayerChange, requestLocation, geofencingAlert).
    - Ensures left panel refreshes (recents/favorites) after clearing data.

- `api/weather.js`
  - Purpose: Serverless proxy to OpenWeatherMap, supporting both name and coordinate queries.
  - Behavior:
    - API key normalization (multiple supported env var names; trims quotes/spaces).
    - If `city` looks like “lat,lon”, queries `lat` and `lon`; else uses `q=city`.
    - Normalizes status messages: 401/404/429/500 → human-friendly errors.
    - Logs only safe metadata (never logs secrets), sets Server-Timing header.

- `api/test-env.js`
  - Purpose: Simple sanity endpoint for test/build checks.

### 4.2 components/common/buttons/
- `FavoriteButton.jsx`
  - Purpose: Heart toggle; signals favorite add/remove; accessible label updates.

### 4.3 components/common/feedback/
- `EmptyState.jsx`
  - Purpose: Friendly blank slate with next-step hints (e.g., search a city).
- `ErrorBanner.jsx`
  - Purpose: Inline alert detailing the problem with a contextual action (retry).
- `FloatingError.jsx`
  - Purpose: Transitional balloon; still available but toasts are now preferred.
- `Toast.jsx`
  - Purpose: Central notification system; supports `type` (info/success/warning/error), auto-dismiss, and manual close; theme-aware color tokens.

### 4.4 components/common/layout/
- `DarkHeader.jsx`
  - Purpose: Top navigation/toolbar with actions:
    - Back icon (placeholder), centered fuzzy search (CenterSearch), right actions (theme, settings, location, menu).
    - Hosts `<Toast>`; listens to `appToast` events to show messages without blocking the UI.
  - Notes: Replaced `alert()` calls with toast events.

- `Footer.jsx`
  - Purpose: Attribution and links with low visual prominence.

- `Header.jsx`
  - Purpose: Generic header primitives (if used in some contexts).

### 4.5 components/common/loading/
- `LoadingSkeletons.jsx`, `LoadingSpinner.jsx`, `Skeletons.jsx`, `Spinner.jsx`
  - Purpose: Unified loading visuals to avoid janky layouts during fetches.

### 4.6 components/search/
- `CenterSearch.jsx`
  - Purpose: Header search with fuzzy suggestions.
  - Key details:
    - Uses Fuse.js with `threshold` tuned for balanced fuzziness.
    - Shows dropdown on focus/typing; ESC to close.
    - ENTER selects the top suggestion if present; otherwise runs the typed query.
    - Includes a world cities list with commonly searched locations (e.g., Ahmedabad).

- `CitySearch.jsx`
  - Purpose: Left panel search across a provided list (`cities` prop), optimized for quick selection.
  - Key details:
    - Uses Fuse.js on the `cities` prop rather than a global list.
    - Tracks show/hide of suggestions and supports ESC to cancel.

- `SearchBar.jsx`
  - Purpose: Minimal classic form search (kept for areas that use form semantics).

### 4.7 components/search/navigation/
- `LeftNav.jsx`
  - Purpose: Sidebar composition: city search, city list, location services, and recent/favorites modules.
  - Notes: Receives `refreshTrigger` from `index.jsx` to re-fetch localStorage after clear operations.

- `CityList.jsx`
  - Purpose: Recent and favorite cities view with selection, favorite toggle, remove, and drag reorder.
  - Accessibility & theme:
    - In light mode, selected state uses amber background and black text for contrast; in dark mode, amber on dark context persists correctly.

- `CityHeader.jsx`
  - Purpose: Title row for the selected city with favorite control, used inside main content.

### 4.8 components/weather/cards/
- `WeatherArea.jsx`
  - Purpose: Container that manages empty/loading/error overlays and composes `WeatherCard`.
  - Details:
    - When loading, blocks clicks with a semi-opaque layer and shows `Spinner`.
    - When error, shows `ErrorBanner` with a retry button.

- `WeatherCard.jsx`
  - Purpose: Main presentation of current conditions.
  - Details:
    - Determines human-friendly fields from raw or mapped data (city/country, temp, humidity, wind, timestamps).
    - Actions: favorite, share, toggle units; shows “cached” badge when data comes from local storage.

- `MainWeatherPro.jsx`
  - Purpose: Expanded metrics grid and temperature chart.
  - Details:
    - Pulls humidity, wind, pressure, visibility into metric tiles with small trend/indicator details.
    - Embeds `<TempChart>` for 24‑hour trend.

- `MetricTile.jsx`
  - Purpose: Reusable block for individual metric display.

### 4.9 components/weather/forecast/
- `ForecastPanel.jsx`
  - Purpose: 5‑day forecast list; populates from provided weatherData or a robust mock that respects current temperature and unit.
  - Notes: Light mode uses white card with slate borders; dark mode uses translucent dark surfaces.

- `DayForecastCard.jsx`
  - Purpose: Single day card with icon, condition, precip/wind, highs/lows; selectable.
  - Key contrast fix: in light mode, selected state uses an amber background with black text to ensure maximum readability; dark mode retains amber-on-dark.

- `ForecastStrip.jsx`
  - Purpose: Horizontal strip with compact day boxes, useful where vertical space is tight.

- `HourlyForecast.jsx`, `HourlyStrip.jsx`
  - Purpose: Hour-by-hour view; dataset uses stable seeding to vary temps plausibly throughout the day while reflecting current conditions.

### 4.10 components/weather/charts/
- `TempChart.jsx`
  - Purpose: 24‑hour temperature line chart (Recharts); animates transitions lightly; respects theme tokens.

### 4.11 components/map/
- `InteractiveMap.jsx`
  - Purpose: Core Leaflet map with:
    - OSM base layer,
    - Optional precipitation/radar/temperature overlays,
    - City marker for current location,
    - Click handler to create a temporary marker + popup with “Get Weather Here”.
  - SSR-safe dynamic imports: MapContainer/TileLayer/Marker/Popup loaded client-side only.

- `MapPreview.jsx`
  - Purpose: Lightweight map preview for areas that shouldn’t load full interactivity.

### 4.12 components/location/
- `LocationServices.jsx`
  - Purpose: “Use My Location” control; displays device/location permission state and quick guidance.

- `LocationFallbackModal.jsx`
  - Purpose: Modal explaining why location could not be fetched; offers suggestions to retry or continue manually.

- `RecentLocations.jsx`
  - Purpose: Combined list (favorites + recent) with DnD; emits events on reorder, remove, and select; stamps items with `manual` or `geolocation`.

### 4.13 components/settings/
- `SettingsPanel.jsx`
  - Purpose: User settings including units, theme, high contrast, auto-refresh intervals, map overlays, notifications (placeholder), and data privacy.
  - “Clear Location Data”:
    - Removes: favorites, recentCities, recentLocations, favoriteLocations, locationHistory,
    - Updates UI instantly by dispatching `dataCleared`.

### 4.14 hooks/
- `useWeather.js`
  - Purpose: Central app state: theme/unit toggles, current weather data, loading, errors, cached/served-from-cache indicator, search function, favorites.
  - Implementation insights:
    - Debounced `search` (300ms) for fewer API calls.
    - On unit change, auto-refetches the currently displayed city.
    - Keeps recent cities list to a small size for UX.

- `useLocation.js`
  - Purpose: Geolocation capabilities: querying current location, managing permission state, recents/favorites/history for locations.
  - Utilities: add to recents, toggle favorite, remove, reorder, clear all location-related data.

- `useLocalStorage.js`
  - Purpose: Generic state + localStorage hook, safe on server (returns default without accessing `window`).

### 4.15 lib/utils/
- `api.js`
  - Purpose: Client wrapper to call `/api/weather`, handle error mapping with friendly messages, and map raw OWM response to the internal data shape.

### 4.16 public/icons/
- `sun-cloud.svg`
  - Purpose: Favicon representing “sun behind cloud”; referenced from `_app.jsx`.

### 4.17 __tests__/
- `api.mapStatusToMessage.test.js`
  - Focus: Verifies that the proxy maps HTTP status codes to human messages.
- `integration.search.test.jsx`
  - Focus: Ensures the search UI behavior works as expected with suggestions and submit flow.

### 4.18 Configs
- Tailwind/ESLint/Jest/Next/Vercel configs ensure consistent tooling, linting, and deployment behavior.


## 5) API Reference (Expanded)

- Method: GET
- Path: `/api/weather`
- Parameters:
  - `city` (string): either a name or any string containing a `lat,lon` pair; the first match in the string is used.
  - `units` (string): `metric` or `imperial`.
  - `mock` (string; dev only): `1` to force mock payloads.
- Coordinate parsing rules:
  - Regex finds the first pair of signed floats separated by a comma; validates ranges: lat ∈ [-90,90], lon ∈ [-180,180].
- Backend request:
  - Coordinates → OWM `/data/2.5/weather?lat=…&lon=…`
  - City name → OWM `/data/2.5/weather?q=…`
- Responses:
  - Successful responses pass through raw OWM JSON; the client maps it into a simpler internal object for display.
  - Errors map to friendly messages listed above with the same status code.
- Examples:
  - Name: `/api/weather?city=London`
  - Coordinates near Ahmedabad: `/api/weather?city=23.03,72.61` → returns `name: "Ahmedabad"`


## 6) Local Development & Installation (Expanded)

- Requirements:
  - Node.js 18+ and npm.
  - An OpenWeatherMap API key.
- Steps:
  1) Clone repository, `cd weather-dashboard`, `npm install`.
  2) Create `.env.local` with `OPENWEATHER_API_KEY=<your_key>`.
  3) `npm run dev` and open `http://localhost:3000`.
- Build/Run:
  - `npm run build` → `.next`
  - `npm start` → serves production build
- Environment variables:
  - Server-side key lookup order: `OPENWEATHER_API_KEY`, `WEATHER_API_KEY`, `NEXT_PUBLIC_WEATHER_API_KEY`, `NEXT_PUBLIC_OPENWEATHER_API_KEY`.
  - For map tile overlays only, you may set `NEXT_PUBLIC_WEATHER_API_KEY` (public), but the proxy uses server-side keys for the main API.


## 7) Testing (Expanded)

- Commands:
  - `npm test` (runs Jest suite)
  - `npm run test:watch` (watch mode)
- Suggested add-ons:
  - Proxy coordinate fallback: call `/api/weather?city=23.03,72.61` and assert `name` and `coord` exist.
  - Toast behavior test: dispatch `appToast` event and assert a toast appears and disappears after timeout.
  - Light‑mode contrast test: mount `DayForecastCard` and `CityList` items in light mode, set selected, assert text color class resolves to black/specific slate tokens.
  - LocalStorage interactions: add/search city, verify `recentCities` updated; click “Clear Location Data” and verify related keys removed and UI shows empty recent list.


## 8) Deployment

- Production alias: `https://weather-dashboard-eight-theta.vercel.app/`
- Vercel CLI:
  - `npx vercel --prod` to deploy latest.
  - If needed, alias explicitly: `npx vercel alias set <deployment-url> weather-dashboard-eight-theta.vercel.app`
- Vercel project settings:
  - Add `OPENWEATHER_API_KEY` in Environment Variables.
- Post-deploy checks:
  - Tab shows “Weather Pro” and the sun-cloud favicon.
  - Search works; clicking map shows popup; “Get Weather Here” resolves to the nearest city.
  - Toast replaces any previous blocking alert experiences.


## 9) CI / CD

- Current: Vercel handles builds on push to `main`.
- Recommended GitHub Actions:
  - Lint → Unit tests → Build pipelines on PR and push to `main`.
  - Enforce passing checks before merge with branch protection.

  
## 10) Monitoring & Logging

- Serverless logs: use Vercel function logs for `/api/weather` to observe status codes and latency.
- Client: minimal console logging; prefer user-visible toasts for notable events.
- Future: Install Sentry for client/serverless error tracking; add basic web vitals tracking.


## 11) Troubleshooting & FAQ (Expanded)

- Why do I sometimes see a Vercel login screen?
  - You followed a dashboard link. Use the public alias `https://weather-dashboard-eight-theta.vercel.app/`.
- I clicked near a city but it says “City not found”.
  - Use “Get Weather Here” in the map popup; the backend queries by coordinates and returns the nearest city (fixed).
- Map overlays don’t show anything.
  - Ensure a public tile key for OWM overlays (`NEXT_PUBLIC_WEATHER_API_KEY`) is present; the base OSM map works regardless.
- My recent cities won’t clear.
  - Click “Clear Location Data” in Settings; it wipes recents/favorites/history and refreshes the sidebar immediately. If still visible, do a hard reload to flush stale state.
- Text inside highlighted yellow boxes is still hard to read in light mode.
  - The UI sets text to black in light-mode selections. If you still see old styling, your browser may be caching; hard-refresh.


## 12) Security Considerations

- Keep primary OWM API key on the server (proxy route). Only expose a public key to client for map tiles if necessary.
- Use HTTPS; Vercel provides TLS by default.
- Do not log keys in server logs; only log key length and minimal status to aid diagnostics.
- Respect OWM rate limits; the app surfaces friendly messages when limits are hit.


## 13) Contributing

- Fork → feature branch → PR against `main`. Describe changes clearly and include tests and doc updates for user-visible changes.
- Style: ESLint; run `npm run lint` and ensure `npm test` passes.
- Coordinate any structural changes that affect docs (folder names, routes) with documentation updates.


## 14) Changelog (Expanded)

- 2025‑09‑11
  - UI contrast: light-mode selected states switch to black text on amber backgrounds for clarity.
  - Toast system: non-blocking toasts added; native alerts removed.
  - Map backend: coordinate parsing and nearest‑city fallback implemented for smoother “Get Weather Here”.
  - Structure: components reorganized by feature area; imports updated; lint/build pass.
  - Branding: default title “Weather Pro”; sun‑cloud favicon included.
  - Docs: comprehensive product, architecture, and operations documentation added.


## 15) Credits & References

- OpenWeatherMap — weather data and optional tiles.
- OpenStreetMap & Leaflet — base map and interactions.
- Next.js, React, Tailwind CSS, Recharts — core UI framework stack.
- Vercel — serverless hosting and deployments.


---

If you want this converted into a set of Markdown files (`docs/*.md`) inside the repo, I can split the above into:
- `docs/Overview.md`, `docs/Architecture.md`, `docs/FolderStructure.md`, `docs/Components.md`, `docs/API.md`, `docs/Runbook.md`, and cross-link them from `README.md`./Weather`
2) `cd weather-dashboard`
3) Create `.env.local`, add `OPENWEATHER_API_KEY=<your_key>`
4) `npm install`
5) `npm run dev`


