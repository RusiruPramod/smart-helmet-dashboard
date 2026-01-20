import { create } from 'zustand';

export const useVoiceStore = create((set, get) => ({
  messages: [],
  isRecording: false,
  isPlaying: false,
  currentPlayingId: null,
  recordingDuration: 0,
  
  // Add voice message
  addMessage: (message) => set((state) => ({
    messages: [message, ...state.messages]
  })),
  
  // Update message status
  updateMessageStatus: (voiceId, status) => set((state) => ({
    messages: state.messages.map(msg =>
      msg.voiceId === voiceId ? { ...msg, status } : msg
    )
  })),
  
  // Set recording state
  setRecording: (isRecording) => set({ isRecording }),
  
  // Set recording duration
  setRecordingDuration: (duration) => set({ recordingDuration: duration }),
  
  // Set playing state
  setPlaying: (isPlaying, voiceId = null) => set({
    isPlaying,
    currentPlayingId: voiceId
  }),
  
  // Get messages for a helmet
  getHelmetMessages: (helmetId) => {
    return get().messages.filter(msg =>
      msg.sender === helmetId || msg.recipient === helmetId
    );
  },
  
  // Clear messages
  clearMessages: () => set({ messages: [] })
}));
