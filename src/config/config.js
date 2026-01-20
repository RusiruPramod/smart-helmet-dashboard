// Firebase Configuration
// Replace with your Firebase project credentials

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Backend API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:5000',
  TIMEOUT: 10000
};

// MQTT Configuration (for reference - handled by backend)
export const MQTT_CONFIG = {
  BROKER_URL: 'mqtt://your-mqtt-broker.com',
  PORT: 1883,
  TOPICS: {
    HELMET_DATA: 'helmet/+/data',
    HELMET_VOICE: 'helmet/+/voice/upload',
    ADMIN_VOICE: 'admin/voice/send/+',
    ADMIN_COMMAND: 'admin/command/+'
  }
};

// App Configuration
export const APP_CONFIG = {
  TELEMETRY_UPDATE_INTERVAL: 5000, // ms
  MAP_DEFAULT_CENTER: [40.7128, -74.0060],
  MAP_DEFAULT_ZOOM: 13,
  VOICE_MAX_DURATION: 15, // seconds
  ALERT_THRESHOLDS: {
    gasLevel: 500, // ppm
    heartRateMin: 50,
    heartRateMax: 120,
    temperatureMin: 15,
    temperatureMax: 35,
    batteryLow: 20, // percentage
    oxygenMin: 19.5
  }
};
