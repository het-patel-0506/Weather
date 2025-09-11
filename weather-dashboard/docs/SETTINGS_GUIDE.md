# Weather Dashboard Settings Panel Guide

## Overview
The Weather Dashboard now includes a comprehensive Settings Panel that allows users to customize their weather experience. All settings are automatically saved to localStorage and persist across browser sessions.

## Accessing Settings
- Click the **gear icon** (⚙️) in the top-right corner of the dashboard
- The settings panel will open as a modal overlay

## Settings Sections

### 🔧 General
- **Temperature Unit**: Toggle between Celsius (°C) and Fahrenheit (°F)
- **Theme**: Switch between Dark and Light modes
- **High Contrast Mode**: Enhance readability for accessibility (WCAG AA compliant)

### 🎨 Display
- **Auto-Refresh**: Set automatic weather data refresh intervals
  - Off: No automatic refresh
  - Every 5 minutes
  - Every 15 minutes (default)
  - Every 30 minutes
- **Last Updated**: Shows when weather data was last refreshed

### 🗺️ Map & Layers
- **Rainfall Overlay**: Show precipitation data on the map
- **Radar Overlay**: Display weather radar information
- **Temperature Overlay**: Show temperature data on the map

### 🔔 Notifications
- **Weather Alerts**: Enable browser notifications for severe weather
- Automatically requests notification permissions when enabled
- Shows current permission status

### 🌐 Units & Language
- **Wind Speed Unit**: Choose between m/s, km/h, or mph
- **Pressure Unit**: Toggle between hPa and inHg
- **Language**: Select preferred language (English available, more coming soon)

### 🔒 Privacy & Data
- **Location Services**: Control location access for weather data
- **Clear Stored Data**: Remove all cached weather data and location history

### 👤 Account & Sync (Coming Soon)
- **Sign In to Sync**: Placeholder for future account integration
- Will allow syncing preferences across devices

## Features

### ✅ Immediate Application
- All settings apply instantly without requiring a save button
- Changes are immediately visible throughout the application

### 💾 Persistent Storage
- All preferences are automatically saved to localStorage
- Settings persist across browser sessions and page reloads

### ♿ Accessibility
- Full keyboard navigation support
- Screen reader compatible
- High contrast mode for better readability
- Proper ARIA labels and focus management

### 🎨 Visual Design
- Consistent with the app's dark theme
- Smooth transitions and animations
- Responsive design for all screen sizes
- Glass morphism effects with backdrop blur

## Technical Implementation

### Event System
The settings panel uses a custom event system to communicate with other components:
- `unitChange`: Triggers temperature unit updates
- `themeChange`: Applies theme changes
- `weatherRefresh`: Triggers weather data refresh
- `mapLayerChange`: Updates map overlays
- `dataCleared`: Clears stored data

### localStorage Keys
Settings are stored with the following keys:
- `temperatureUnit`: 'C' or 'F'
- `theme`: 'dark' or 'light'
- `highContrast`: boolean
- `autoRefresh`: 'off', '5', '15', or '30'
- `windUnit`: 'm/s', 'km/h', or 'mph'
- `pressureUnit`: 'hPa' or 'inHg'
- `language`: 'en', 'es', 'fr'
- `notificationsEnabled`: boolean
- `locationEnabled`: boolean
- `mapLayers`: object with rainfall, radar, temperature booleans

## Future Enhancements
- Account synchronization across devices
- Additional language support
- Custom notification thresholds
- More map layer options
- Export/import settings
- Advanced accessibility options
