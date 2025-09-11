import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Fix for Leaflet marker icons
if (typeof window !== 'undefined') {
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

export default function InteractiveMap({ 
  city = "San Francisco, CA", 
  coordinates = { lat: 37.7749, lon: -122.4194 },
  weatherData = null,
  theme = "dark",
  apiKey = null,
  mapLayers = { rainfall: false, radar: false, temperature: false },
  onLocationSelect = null
}) {
  const [mounted, setMounted] = useState(false);
  const [mapCenter, setMapCenter] = useState([coordinates.lat, coordinates.lon]);
  const [zoom, setZoom] = useState(10);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Load recent map position from localStorage
    const savedPosition = localStorage.getItem('mapPosition');
    if (savedPosition) {
      try {
        const { center, zoom: savedZoom } = JSON.parse(savedPosition);
        setMapCenter(center);
        setZoom(savedZoom);
      } catch (e) {
        console.warn('Failed to parse saved map position');
      }
    }
  }, []);

  useEffect(() => {
    // Update map center when coordinates change
    if (coordinates && coordinates.lat && coordinates.lon) {
      const newCenter = [coordinates.lat, coordinates.lon];
      setMapCenter(newCenter);
      
      // Programmatically move the map if it's already mounted
      if (mapInstance) {
        mapInstance.setView(newCenter, zoom);
      }
    }
  }, [coordinates, zoom, mapInstance]);

  const handleMapMove = (e) => {
    const center = e.target.getCenter();
    const newZoom = e.target.getZoom();
    const position = { center: [center.lat, center.lng], zoom: newZoom };
    localStorage.setItem('mapPosition', JSON.stringify(position));
  };

  const handleMapClick = (e) => {
    if (!onLocationSelect) return;
    
    const { lat, lng } = e.latlng;
    setClickedLocation({ lat, lon: lng });
  };

  const handleGetWeatherForLocation = () => {
    if (clickedLocation && onLocationSelect) {
      onLocationSelect(clickedLocation);
      setClickedLocation(null);
    }
  };

  if (!mounted) {
    return (
      <div className={`backdrop-blur-sm rounded-xl p-6 transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-white/5 border border-white/10' 
          : 'bg-white border border-slate-200/50'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Interactive Precipitation Map</h3>
        <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
          <div className={`text-center ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
            <div className="text-4xl mb-2 animate-pulse">🗺️</div>
            <div className="text-sm">Loading map...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`backdrop-blur-sm rounded-xl p-6 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-white/5 border border-white/10' 
        : 'bg-white border border-slate-200/50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Interactive Precipitation Map</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
            onClick={() => setMapCenter([coordinates.lat, coordinates.lon])}
          >
            Center
          </button>
        </div>
      </div>
      
      <div className="aspect-square rounded-xl overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          whenReady={(map) => {
            setMapInstance(map.target);
            map.target.on('moveend', handleMapMove);
            map.target.on('click', handleMapClick);
          }}
        >
          {/* Base map tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Precipitation overlay (if enabled and API key is available) */}
          {apiKey && mapLayers.rainfall && (
            <TileLayer
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
              url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`}
              opacity={0.6}
            />
          )}
          
          {/* Radar overlay (if enabled and API key is available) */}
          {apiKey && mapLayers.radar && (
            <TileLayer
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
              url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`}
              opacity={0.5}
            />
          )}
          
          {/* Temperature overlay (if enabled and API key is available) */}
          {apiKey && mapLayers.temperature && (
            <TileLayer
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
              url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`}
              opacity={0.6}
            />
          )}
          
          {/* City marker */}
          <Marker position={[coordinates.lat, coordinates.lon]}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold">{city}</div>
                {weatherData && (
                  <div className="text-sm text-gray-600">
                    <div>Temperature: {Math.round(weatherData.temperature || weatherData.main?.temp || 0)}°C</div>
                    <div>Humidity: {weatherData.humidity || weatherData.main?.humidity || 0}%</div>
                    <div>Wind: {Math.round((weatherData.wind || weatherData.wind?.speed || 0) * 10) / 10} m/s</div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
          
          {/* Clicked location marker */}
          {clickedLocation && (
            <Marker position={[clickedLocation.lat, clickedLocation.lon]}>
              <Popup>
                <div className="text-center p-2">
                  <div className="font-semibold mb-2">New Location</div>
                  <div className="text-sm text-gray-600 mb-3">
                    <div>Lat: {clickedLocation.lat.toFixed(4)}</div>
                    <div>Lon: {clickedLocation.lon.toFixed(4)}</div>
                  </div>
                  <button
                    onClick={handleGetWeatherForLocation}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Get Weather Here
                  </button>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      {/* Map controls */}
      <div className={`flex justify-between items-center mt-4 text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-600'}`}>
        <div className="flex items-center gap-4">
          <span>Satellite</span>
          <span>•</span>
          <span>Traffic</span>
          {apiKey && <span>•</span>}
          {apiKey && <span className="text-green-400">Precipitation</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
          >
            Layers
          </button>
        </div>
      </div>
    </div>
  );
}
