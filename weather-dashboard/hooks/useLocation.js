import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useLocation() {
  // Location state
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isUsingDeviceLocation, setIsUsingDeviceLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Persistent storage
  const [recentLocations, setRecentLocations] = useLocalStorage('recentLocations', []);
  const [favoriteLocations, setFavoriteLocations] = useLocalStorage('favoriteLocations', []);
  const [locationHistory, setLocationHistory] = useLocalStorage('locationHistory', []);
  const [autoDetectEnabled, setAutoDetectEnabled] = useLocalStorage('autoDetectEnabled', true);
  const [geofencingEnabled, setGeofencingEnabled] = useLocalStorage('geofencingEnabled', false);

  // Check geolocation support and permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
      }).catch(() => {
        setLocationPermission('prompt');
      });
    }
  }, []);

  // Get current location using geolocation API
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return Promise.reject(new Error('Geolocation not supported'));
    }

    setIsGeolocating(true);
    setLocationError(null);

    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = {
            lat: latitude,
            lon: longitude,
            timestamp: Date.now(),
            source: 'geolocation'
          };

          setCurrentLocation(location);
          setIsUsingDeviceLocation(true);
          setLocationPermission('granted');
          setIsGeolocating(false);

          // Add to location history
          addToLocationHistory(location);
          
          resolve(location);
        },
        (error) => {
          setIsGeolocating(false);
          setLocationPermission('denied');
          
          let errorMessage = 'Unable to access your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location.';
              break;
          }
          
          setLocationError(errorMessage);
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }, []);

  // Add location to history
  const addToLocationHistory = useCallback((location) => {
    if (!autoDetectEnabled) return;

    setLocationHistory(prev => {
      const newHistory = [location, ...prev.filter(loc => 
        !(Math.abs(loc.lat - location.lat) < 0.001 && Math.abs(loc.lon - location.lon) < 0.001)
      )].slice(0, 50); // Keep last 50 locations
      return newHistory;
    });
  }, [autoDetectEnabled]);

  // Add location to recent locations
  const addToRecentLocations = useCallback((location, cityName) => {
    const locationEntry = {
      id: `${location.lat}-${location.lon}-${Date.now()}`,
      name: cityName,
      lat: location.lat,
      lon: location.lon,
      timestamp: Date.now(),
      source: location.source || 'manual'
    };

    setRecentLocations(prev => {
      // Remove if already exists
      const filtered = prev.filter(loc => loc.id !== locationEntry.id);
      return [locationEntry, ...filtered].slice(0, 10); // Keep last 10
    });
  }, []);

  // Toggle favorite location
  const toggleFavoriteLocation = useCallback((locationId) => {
    const location = recentLocations.find(loc => loc.id === locationId);
    if (!location) return;

    setFavoriteLocations(prev => {
      const isFavorite = prev.some(fav => fav.id === locationId);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== locationId);
      } else {
        return [location, ...prev].slice(0, 20); // Keep max 20 favorites
      }
    });
  }, [recentLocations]);

  // Remove location from recent
  const removeRecentLocation = useCallback((locationId) => {
    setRecentLocations(prev => prev.filter(loc => loc.id !== locationId));
    setFavoriteLocations(prev => prev.filter(fav => fav.id !== locationId));
  }, []);

  // Reorder recent locations
  const reorderRecentLocations = useCallback((fromIndex, toIndex) => {
    setRecentLocations(prev => {
      const newLocations = [...prev];
      const [movedLocation] = newLocations.splice(fromIndex, 1);
      newLocations.splice(toIndex, 0, movedLocation);
      return newLocations;
    });
  }, []);

  // Clear all location data
  const clearLocationData = useCallback(() => {
    setRecentLocations([]);
    setFavoriteLocations([]);
    setLocationHistory([]);
    setCurrentLocation(null);
    setIsUsingDeviceLocation(false);
    setLocationError(null);
  }, []);

  // Get weather for coordinates
  const getWeatherForCoordinates = useCallback(async (lat, lon, cityName = null) => {
    try {
      // This would typically call the weather API
      // For now, we'll return the coordinates and let the parent handle the API call
      const location = { lat, lon, timestamp: Date.now(), source: 'map' };
      
      if (cityName) {
        addToRecentLocations(location, cityName);
      }
      
      return location;
    } catch (error) {
      console.error('Error getting weather for coordinates:', error);
      throw error;
    }
  }, [addToRecentLocations]);

  // Simulate geofencing alerts (mock implementation)
  const simulateGeofencingAlert = useCallback(() => {
    if (!geofencingEnabled || !currentLocation) return;

    // Mock alert - in real implementation, this would check against weather alerts
    const mockAlerts = [
      {
        id: 'alert-1',
        type: 'severe',
        message: 'Severe weather alert: Thunderstorm approaching your area',
        timestamp: Date.now(),
        location: currentLocation
      },
      {
        id: 'alert-2',
        type: 'warning',
        message: 'Weather warning: High winds expected in your region',
        timestamp: Date.now(),
        location: currentLocation
      }
    ];

    // Show random alert for demo
    const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
    
    // Dispatch custom event for alert display
    window.dispatchEvent(new CustomEvent('geofencingAlert', { 
      detail: randomAlert 
    }));

    return randomAlert;
  }, [geofencingEnabled, currentLocation]);

  // Auto-detect location on mount if enabled
  useEffect(() => {
    if (autoDetectEnabled && locationPermission === 'granted' && !currentLocation) {
      getCurrentLocation().catch(() => {
        // Silently fail on auto-detect
      });
    }
  }, [autoDetectEnabled, locationPermission, currentLocation, getCurrentLocation]);

  // Simulate periodic geofencing checks
  useEffect(() => {
    if (!geofencingEnabled || !currentLocation) return;

    const interval = setInterval(() => {
      // 10% chance of triggering an alert for demo purposes
      if (Math.random() < 0.1) {
        simulateGeofencingAlert();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [geofencingEnabled, currentLocation, simulateGeofencingAlert]);

  return {
    // State
    currentLocation,
    isUsingDeviceLocation,
    locationPermission,
    isGeolocating,
    locationError,
    recentLocations,
    favoriteLocations,
    locationHistory,
    autoDetectEnabled,
    geofencingEnabled,

    // Actions
    getCurrentLocation,
    addToRecentLocations,
    toggleFavoriteLocation,
    removeRecentLocation,
    reorderRecentLocations,
    clearLocationData,
    getWeatherForCoordinates,
    simulateGeofencingAlert,
    setAutoDetectEnabled,
    setGeofencingEnabled,
    setIsUsingDeviceLocation,
    setLocationError
  };
}
