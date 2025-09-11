import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function SettingsPanel({ isOpen, onClose, theme = "dark" }) {
  // Settings state with localStorage persistence
  const [temperatureUnit, setTemperatureUnit] = useLocalStorage('temperatureUnit', 'C');
  const [themeMode, setThemeMode] = useLocalStorage('theme', 'dark');
  const [highContrast, setHighContrast] = useLocalStorage('highContrast', false);
  const [autoRefresh, setAutoRefresh] = useLocalStorage('autoRefresh', '15');
  const [windUnit, setWindUnit] = useLocalStorage('windUnit', 'm/s');
  const [pressureUnit, setPressureUnit] = useLocalStorage('pressureUnit', 'hPa');
  const [language, setLanguage] = useLocalStorage('language', 'en');
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notificationsEnabled', false);
  const [locationEnabled, setLocationEnabled] = useLocalStorage('locationEnabled', true);
  const [geofencingEnabled, setGeofencingEnabled] = useLocalStorage('geofencingEnabled', false);
  const [mapLayers, setMapLayers] = useLocalStorage('mapLayers', {
    rainfall: false,
    radar: false,
    temperature: false
  });

  // Local state for immediate UI updates
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Auto-refresh timer
  useEffect(() => {
    if (autoRefresh === 'off') return;

    const interval = parseInt(autoRefresh) * 60 * 1000; // Convert minutes to milliseconds
    const timer = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      // Trigger weather data refresh here
      window.dispatchEvent(new CustomEvent('weatherRefresh'));
    }, interval);

    return () => clearInterval(timer);
  }, [autoRefresh]);

  // Handle temperature unit change
  const handleTemperatureUnitChange = useCallback((unit) => {
    setTemperatureUnit(unit);
    // Trigger global unit change
    window.dispatchEvent(new CustomEvent('unitChange', { detail: { unit } }));
  }, [setTemperatureUnit]);

  // Handle theme change
  const handleThemeChange = useCallback((newTheme) => {
    setThemeMode(newTheme);
    // Trigger global theme change
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
  }, [setThemeMode]);

  // Handle notification permission request
  const handleNotificationToggle = useCallback(async (enabled) => {
    if (enabled && notificationPermission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission !== 'granted') {
        return; // Don't enable if permission denied
      }
    }
    setNotificationsEnabled(enabled);
  }, [notificationPermission, setNotificationsEnabled]);

  // Handle map layer toggle
  const handleMapLayerToggle = useCallback((layer) => {
    setMapLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
    // Trigger map layer change
    window.dispatchEvent(new CustomEvent('mapLayerChange', { 
      detail: { layer, enabled: !mapLayers[layer] } 
    }));
  }, [mapLayers, setMapLayers]);

  // Clear all stored data
  const handleClearData = useCallback(() => {
    if (confirm('Are you sure you want to clear all location data? This cannot be undone.')) {
      localStorage.removeItem('favorites');
      localStorage.removeItem('recentCities');
      localStorage.removeItem('lastSearched');
      localStorage.removeItem('recentLocations');
      localStorage.removeItem('favoriteLocations');
      localStorage.removeItem('locationHistory');
      // Keep settings but clear location data
      setLocationEnabled(false);
      window.dispatchEvent(new CustomEvent('dataCleared'));
    }
  }, [setLocationEnabled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Settings Panel */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] mx-4 rounded-2xl shadow-2xl overflow-hidden ${
        theme === "dark" 
          ? "bg-slate-900 border border-slate-700" 
          : "bg-white border border-slate-200"
      } ${highContrast ? 'ring-2 ring-blue-400' : ''}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === "dark" ? "border-slate-700" : "border-slate-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                Settings
              </h2>
              <p className={`text-sm ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}>
                Customize your weather experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark" 
                ? "hover:bg-slate-800 text-slate-400 hover:text-white" 
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
            aria-label="Close settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-8">
            
            {/* General Settings */}
            <SettingsSection 
              title="General" 
              icon="⚙️" 
              theme={theme}
              highContrast={highContrast}
            >
              <SettingItem 
                title="Temperature Unit" 
                description="Choose how temperatures are displayed"
                theme={theme}
                highContrast={highContrast}
              >
                <SegmentedToggle
                  options={[
                    { value: 'C', label: '°C' },
                    { value: 'F', label: '°F' }
                  ]}
                  value={temperatureUnit}
                  onChange={handleTemperatureUnitChange}
                  theme={theme}
                />
              </SettingItem>

              <SettingItem 
                title="Theme" 
                description="Choose your preferred color scheme"
                theme={theme}
                highContrast={highContrast}
              >
                <SegmentedToggle
                  options={[
                    { value: 'dark', label: 'Dark' },
                    { value: 'light', label: 'Light' }
                  ]}
                  value={themeMode}
                  onChange={handleThemeChange}
                  theme={theme}
                />
              </SettingItem>

              <SettingItem 
                title="High Contrast Mode" 
                description="Enhance readability for better accessibility"
                theme={theme}
                highContrast={highContrast}
              >
                <ToggleSwitch
                  checked={highContrast}
                  onChange={setHighContrast}
                  theme={theme}
                />
              </SettingItem>
            </SettingsSection>

            {/* Display Settings */}
            <SettingsSection 
              title="Display" 
              icon="🎨" 
              theme={theme}
              highContrast={highContrast}
            >
              <SettingItem 
                title="Auto-Refresh" 
                description="How often to automatically update weather data"
                theme={theme}
                highContrast={highContrast}
              >
                <SelectDropdown
                  options={[
                    { value: 'off', label: 'Off' },
                    { value: '5', label: 'Every 5 minutes' },
                    { value: '15', label: 'Every 15 minutes' },
                    { value: '30', label: 'Every 30 minutes' }
                  ]}
                  value={autoRefresh}
                  onChange={setAutoRefresh}
                  theme={theme}
                />
              </SettingItem>

              <SettingItem 
                title="Last Updated" 
                description="Weather data last refreshed"
                theme={theme}
                highContrast={highContrast}
              >
                <div className={`text-sm font-mono ${
                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}>
                  {lastUpdated}
                </div>
              </SettingItem>
            </SettingsSection>

            {/* Map & Layers */}
            <SettingsSection 
              title="Map & Layers" 
              icon="🗺️" 
              theme={theme}
              highContrast={highContrast}
            >
              <SettingItem 
                title="Rainfall Overlay" 
                description="Show precipitation data on the map"
                theme={theme}
                highContrast={highContrast}
              >
                <ToggleSwitch
                  checked={mapLayers.rainfall}
                  onChange={() => handleMapLayerToggle('rainfall')}
                  theme={theme}
                />
              </SettingItem>

              <SettingItem 
                title="Radar Overlay" 
                description="Display weather radar information"
                theme={theme}
                highContrast={highContrast}
              >
                <ToggleSwitch
                  checked={mapLayers.radar}
                  onChange={() => handleMapLayerToggle('radar')}
                  theme={theme}
                />
              </SettingItem>

              <SettingItem 
                title="Temperature Overlay" 
                description="Show temperature data on the map"
                theme={theme}
                highContrast={highContrast}
              >
                <ToggleSwitch
                  checked={mapLayers.temperature}
                  onChange={() => handleMapLayerToggle('temperature')}
                  theme={theme}
                />
              </SettingItem>
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection 
              title="Notifications" 
              icon="🔔" 
              theme={theme}
              highContrast={highContrast}
            >
              <SettingItem 
                title="Weather Alerts" 
                description="Get notified about severe weather conditions"
                theme={theme}
                highContrast={highContrast}
              >
                <ToggleSwitch
                  checked={notificationsEnabled}
                  onChange={handleNotificationToggle}
                  theme={theme}
                />
              </SettingItem>

              {notificationsEnabled && (
                <div className={`ml-4 p-3 rounded-lg ${
                  theme === "dark" ? "bg-slate-800" : "bg-slate-50"
                }`}>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-slate-300" : "text-slate-600"
                  }`}>
                    Notification permission: {notificationPermission}
                  </p>
                </div>
              )}
            </SettingsSection>

            {/* Units & Language */}
            <SettingsSection 
              title="Units & Language" 
              icon="🌐" 
              theme={theme}
              highContrast={highContrast}
            >
              <SettingItem 
                title="Wind Speed Unit" 
                description="Choose how wind speed is displayed"
                theme={theme}
                highContrast={highContrast}
              >
                <SelectDropdown
                  options={[
                    { value: 'm/s', label: 'm/s' },
                    { value: 'km/h', label: 'km/h' },
                    { value: 'mph', label: 'mph' }
                  ]}
                  value={windUnit}
                  onChange={setWindUnit}
                  theme={theme}
                />
              </SettingItem>

              <SettingItem 
                title="Pressure Unit" 
                description="Choose how atmospheric pressure is displayed"
                theme={theme}
                highContrast={highContrast}
              >
                <SelectDropdown
                  options={[
                    { value: 'hPa', label: 'hPa' },
                    { value: 'inHg', label: 'inHg' }
                  ]}
                  value={pressureUnit}
                  onChange={setPressureUnit}
                  theme={theme}
                />
              </SettingItem>

              <SettingItem 
                title="Language" 
                description="Select your preferred language"
                theme={theme}
                highContrast={highContrast}
              >
                <SelectDropdown
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Español (Coming Soon)' },
                    { value: 'fr', label: 'Français (Coming Soon)' }
                  ]}
                  value={language}
                  onChange={setLanguage}
                  theme={theme}
                />
              </SettingItem>
            </SettingsSection>

            {/* Privacy & Data */}
            <SettingsSection 
              title="Privacy & Data" 
              icon="🔒" 
              theme={theme}
              highContrast={highContrast}
            >
              <SettingItem 
                title="Auto-Detect Location" 
                description="Automatically request location access when the app loads"
                theme={theme}
                highContrast={highContrast}
              >
                <ToggleSwitch
                  checked={locationEnabled}
                  onChange={setLocationEnabled}
                  theme={theme}
                />
              </SettingItem>

              <SettingItem 
                title="Location-Based Alerts" 
                description="Get notifications about severe weather in your area"
                theme={theme}
                highContrast={highContrast}
              >
                <ToggleSwitch
                  checked={geofencingEnabled}
                  onChange={setGeofencingEnabled}
                  theme={theme}
                />
              </SettingItem>

              <SettingItem 
                title="Clear Location Data" 
                description="Remove all stored location history, favorites, and recent locations"
                theme={theme}
                highContrast={highContrast}
              >
                <button
                  onClick={handleClearData}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  Clear Location Data
                </button>
              </SettingItem>

              <div className={`p-3 rounded-lg ${
                theme === "dark" ? "bg-slate-800" : "bg-slate-50"
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  How we use your location:
                </h4>
                <ul className={`text-xs space-y-1 ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}>
                  <li>• Fetch weather data for your current location</li>
                  <li>• Save recent locations for quick access</li>
                  <li>• Provide location-based weather alerts (if enabled)</li>
                  <li>• Never shared with third parties or stored on external servers</li>
                </ul>
              </div>
            </SettingsSection>

            {/* Account & Sync (Placeholder) */}
            <SettingsSection 
              title="Account & Sync" 
              icon="👤" 
              theme={theme}
              highContrast={highContrast}
            >
              <SettingItem 
                title="Sync Settings" 
                description="Sign in to sync your preferences across devices"
                theme={theme}
                highContrast={highContrast}
              >
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('appToast', { detail: { message: 'Account sync coming soon!', type: 'info' } }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Sign In to Sync
                </button>
              </SettingItem>
              
              <div className={`ml-4 p-3 rounded-lg ${
                theme === "dark" ? "bg-slate-800" : "bg-slate-50"
              }`}>
                <p className={`text-sm ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}>
                  🔮 This feature is coming soon! Sign in to sync your settings, favorites, and preferences across all your devices.
                </p>
              </div>
            </SettingsSection>

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function SettingsSection({ title, icon, children, theme, highContrast }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <h3 className={`text-lg font-semibold ${
          theme === "dark" ? "text-white" : "text-slate-900"
        } ${highContrast ? 'text-blue-300' : ''}`}>
          {title}
        </h3>
      </div>
      <div className="space-y-4 ml-8">
        {children}
      </div>
    </div>
  );
}

function SettingItem({ title, description, children, theme, highContrast }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <h4 className={`font-medium ${
          theme === "dark" ? "text-white" : "text-slate-900"
        } ${highContrast ? 'text-blue-200' : ''}`}>
          {title}
        </h4>
        <p className={`text-sm mt-1 ${
          theme === "dark" ? "text-slate-400" : "text-slate-600"
        } ${highContrast ? 'text-blue-100' : ''}`}>
          {description}
        </p>
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );
}

function SegmentedToggle({ options, value, onChange, theme }) {
  return (
    <div className={`flex rounded-lg p-1 ${
      theme === "dark" ? "bg-slate-800" : "bg-slate-200"
    }`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            value === option.value
              ? theme === "dark"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-900 shadow-sm"
              : theme === "dark"
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ToggleSwitch({ checked, onChange, theme }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked
          ? theme === "dark" ? "bg-blue-600" : "bg-blue-500"
          : theme === "dark" ? "bg-slate-700" : "bg-slate-300"
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SelectDropdown({ options, value, onChange, theme }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
        theme === "dark"
          ? "bg-slate-800 border-slate-600 text-white focus:border-blue-500"
          : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
