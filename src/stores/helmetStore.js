import { create } from 'zustand';

export const useHelmetStore = create((set, get) => ({
  helmets: {},
  activeHelmets: [],
  selectedHelmetId: null,
  
  // Add or update helmet data
  updateHelmet: (helmetId, data) => set((state) => ({
    helmets: {
      ...state.helmets,
      [helmetId]: {
        ...state.helmets[helmetId],
        ...data,
        lastUpdated: Date.now()
      }
    }
  })),
  
  // Set active helmets list
  setActiveHelmets: (helmetIds) => set({ activeHelmets: helmetIds }),
  
  // Select a helmet
  selectHelmet: (helmetId) => set({ selectedHelmetId: helmetId }),
  
  // Get helmet by ID
  getHelmet: (helmetId) => get().helmets[helmetId],
  
  // Remove helmet
  removeHelmet: (helmetId) => set((state) => {
    const newHelmets = { ...state.helmets };
    delete newHelmets[helmetId];
    return {
      helmets: newHelmets,
      activeHelmets: state.activeHelmets.filter(id => id !== helmetId)
    };
  }),
  
  // Clear all data
  clearHelmets: () => set({ helmets: {}, activeHelmets: [], selectedHelmetId: null })
}));
