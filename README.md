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

## API Behavior: Mock vs Real

### Mock Mode
- **Enable**: Add `?mock=1` to URL or set `NEXT_PUBLIC_FORCE_MOCK=1` in `.env.local`
- **Behavior**: Returns static weather data for any city without API calls
- **Use case**: Development, testing, demos without API key
- **Data**: Fixed responses for London, New York, Tokyo, etc.

### Real API Mode (Default)
- **Requires**: Valid OpenWeather API key in `.env.local`
- **Behavior**: Makes actual API calls to OpenWeatherMap
- **Rate limits**: 1000 calls/day (free tier), 60 calls/minute
- **Caching**: Client-side cache reduces repeated calls for same city/units
- **Error handling**: 401 (invalid key), 404 (city not found), 429 (rate limit)

### Switching Between Modes
```bash
# Real API (default)
npm run dev

# Force mock mode
NEXT_PUBLIC_FORCE_MOCK=1 npm run dev

# Or visit: http://localhost:3000?mock=1
```

## Features
- Search any city, see temperature, condition, humidity, wind, pressure
- Loading, error, and empty states
- Favorites (localStorage), theme and unit (°C/°F) persistence
- Accessible UI: roles, aria-live, focus management, keyboard support
- Desktop layout with left sidebar for quick city access
- Dark glass morphism design with three-column layout

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
