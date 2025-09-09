# Weather Dashboard

## Setup

1. Install deps
```
npm install
```

2. Add API key in `.env.local` (proxy keeps it server-side):
```
OPENWEATHER_API_KEY=YOUR_REAL_KEY
```
(Alternatively: `WEATHER_API_KEY` or `NEXT_PUBLIC_WEATHER_API_KEY`.)

3. Run dev server
```
npm run dev
```
Open http://localhost:3000

## Proxy verification
```
http://localhost:3000/api/weather?city=London&units=metric
```
Should return JSON. If you see `{"message":"Server API key not configured"}`, re-check `.env.local` and restart the server.

## Features
- Search any city, see temperature, condition, humidity, wind, pressure
- Loading, error, and empty states
- Favorites (localStorage), theme and unit (°C/°F) persistence
- Accessible UI: roles, aria-live, focus management, keyboard support

## Testing (to be expanded)
- Unit tests cover API error mapping (401/404/429/network)
- Integration test covers search flow loading→success and loading→error

## Acceptance criteria
- [x] Env var or server proxy configured and documented
- [x] `useWeather` hook implemented and exported
- [x] UI wired to hook and shows real data
- [x] Friendly error messages
- [x] Debounce + cancellation works
- [x] Units toggle persists and updates values
- [x] Caching reduces repeated calls
- [ ] Unit/integration tests implemented
