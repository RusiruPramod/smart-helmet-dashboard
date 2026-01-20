import { io } from 'socket.io-client';
import { API_CONFIG } from '@config/config';
import { useHelmetStore } from '@stores/helmetStore';
import { useVoiceStore } from '@stores/voiceStore';
import { useAlertStore } from '@stores/alertStore';
import toast from 'react-hot-toast';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    if (this.socket && this.connected) {
      console.log('WebSocket already connected');
      return;
    }

    this.socket = io(API_CONFIG.WS_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.connected = true;
      this.reconnectAttempts = 0;
      toast.success('Connected to server');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.connected = false;
      toast.error('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Failed to connect to server');
      }
    });

    // Helmet telemetry data
    this.socket.on('HELMET_DATA', (data) => {
      console.log('📊 Received helmet data:', data);
      useHelmetStore.getState().updateHelmet(data.helmetId, data);
      
      // Check for alerts
      this.checkAlerts(data);
    });

    // Helmet status update
    this.socket.on('HELMET_STATUS', (data) => {
      console.log('🔔 Helmet status update:', data);
      useHelmetStore.getState().updateHelmet(data.helmetId, {
        status: data.status,
        lastSeen: data.timestamp
      });
    });

    // Active helmets list
    this.socket.on('ACTIVE_HELMETS', (helmetIds) => {
      console.log('👷 Active helmets:', helmetIds);
      useHelmetStore.getState().setActiveHelmets(helmetIds);
    });

    // New voice message
    this.socket.on('NEW_VOICE_MESSAGE', (message) => {
      console.log('🎙️ New voice message:', message);
      useVoiceStore.getState().addMessage(message);
      toast.success(`New voice message from ${message.sender}`);
      
      // Play notification sound
      this.playNotificationSound();
    });

    // Voice message status update
    this.socket.on('VOICE_STATUS', (data) => {
      console.log('📨 Voice message status:', data);
      useVoiceStore.getState().updateMessageStatus(data.voiceId, data.status);
    });

    // Alert notification
    this.socket.on('ALERT', (alert) => {
      console.log('⚠️ Alert received:', alert);
      useAlertStore.getState().addAlert(alert);
      
      // Show toast based on severity
      const toastMessage = `${alert.type}: ${alert.message}`;
      if (alert.severity === 'critical') {
        toast.error(toastMessage, { duration: 10000 });
      } else if (alert.severity === 'warning') {
        toast(toastMessage, { icon: '⚠️', duration: 5000 });
      } else {
        toast(toastMessage, { duration: 3000 });
      }
    });

    // System message
    this.socket.on('SYSTEM_MESSAGE', (message) => {
      console.log('💬 System message:', message);
      toast(message.text, { icon: message.icon || 'ℹ️' });
    });
  }

  // Check for alert conditions
  checkAlerts(data) {
    const alerts = [];
    const { sensors, battery, gps } = data;

    // Gas level alert
    if (sensors.gasLevel > 500) {
      alerts.push({
        type: 'GAS_HIGH',
        severity: 'critical',
        message: `High gas level detected: ${sensors.gasLevel} ppm`,
        helmetId: data.helmetId,
        value: sensors.gasLevel
      });
    }

    // Heart rate alerts
    if (sensors.heartRate > 120) {
      alerts.push({
        type: 'HEART_RATE_HIGH',
        severity: 'warning',
        message: `High heart rate: ${sensors.heartRate} BPM`,
        helmetId: data.helmetId,
        value: sensors.heartRate
      });
    } else if (sensors.heartRate < 50 && sensors.heartRate > 0) {
      alerts.push({
        type: 'HEART_RATE_LOW',
        severity: 'warning',
        message: `Low heart rate: ${sensors.heartRate} BPM`,
        helmetId: data.helmetId,
        value: sensors.heartRate
      });
    }

    // Battery low alert
    if (battery.percentage < 20) {
      alerts.push({
        type: 'BATTERY_LOW',
        severity: battery.percentage < 10 ? 'critical' : 'warning',
        message: `Low battery: ${battery.percentage}%`,
        helmetId: data.helmetId,
        value: battery.percentage
      });
    }

    // Temperature alerts
    if (sensors.temperature > 35) {
      alerts.push({
        type: 'TEMPERATURE_HIGH',
        severity: 'warning',
        message: `High temperature: ${sensors.temperature}°C`,
        helmetId: data.helmetId,
        value: sensors.temperature
      });
    }

    // Oxygen level alert
    if (sensors.oxygen < 19.5) {
      alerts.push({
        type: 'OXYGEN_LOW',
        severity: 'critical',
        message: `Low oxygen level: ${sensors.oxygen}%`,
        helmetId: data.helmetId,
        value: sensors.oxygen
      });
    }

    // Add alerts to store
    alerts.forEach(alert => {
      useAlertStore.getState().addAlert(alert);
    });
  }

  // Send voice message
  sendVoiceMessage(helmetId, fileUrl, duration) {
    if (!this.connected) {
      toast.error('Not connected to server');
      return;
    }

    this.socket.emit('SEND_VOICE', {
      helmetId,
      fileUrl,
      duration,
      sender: 'admin',
      timestamp: Date.now()
    });
  }

  // Request helmet data update
  requestUpdate(helmetId) {
    if (!this.connected) {
      toast.error('Not connected to server');
      return;
    }

    this.socket.emit('REQUEST_UPDATE', { helmetId });
  }

  // Send command to helmet
  sendCommand(helmetId, command, data = {}) {
    if (!this.connected) {
      toast.error('Not connected to server');
      return;
    }

    this.socket.emit('SEND_COMMAND', {
      helmetId,
      command,
      data,
      timestamp: Date.now()
    });
  }

  // Play notification sound
  playNotificationSound() {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Could not play sound:', err));
    } catch (err) {
      console.log('Notification sound error:', err);
    }
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('WebSocket disconnected');
    }
  }

  // Check if connected
  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const wsService = new WebSocketService();

export default wsService;
