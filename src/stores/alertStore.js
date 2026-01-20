import { create } from 'zustand';

export const useAlertStore = create((set, get) => ({
  alerts: [],
  unreadCount: 0,
  
  // Add new alert
  addAlert: (alert) => set((state) => ({
    alerts: [
      {
        ...alert,
        id: Date.now(),
        timestamp: alert.timestamp || Date.now(),
        acknowledged: false
      },
      ...state.alerts
    ],
    unreadCount: state.unreadCount + 1
  })),
  
  // Acknowledge alert
  acknowledgeAlert: (alertId) => set((state) => ({
    alerts: state.alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, acknowledged: true, acknowledgedAt: Date.now() }
        : alert
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  
  // Acknowledge all alerts
  acknowledgeAll: () => set((state) => ({
    alerts: state.alerts.map(alert => ({
      ...alert,
      acknowledged: true,
      acknowledgedAt: Date.now()
    })),
    unreadCount: 0
  })),
  
  // Clear old alerts
  clearOldAlerts: (olderThan) => set((state) => ({
    alerts: state.alerts.filter(alert =>
      alert.timestamp > Date.now() - olderThan
    )
  })),
  
  // Get unacknowledged alerts
  getUnacknowledged: () => {
    return get().alerts.filter(alert => !alert.acknowledged);
  },
  
  // Clear all alerts
  clearAlerts: () => set({ alerts: [], unreadCount: 0 })
}));
