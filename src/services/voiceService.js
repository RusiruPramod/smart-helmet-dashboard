import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@config/firebase';
import toast from 'react-hot-toast';

class VoiceService {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioContext = null;
    this.analyser = null;
    this.stream = null;
  }

  // Request microphone permission and start recording
  async startRecording() {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000 // Low sample rate for smaller files
        }
      });

      // Create MediaRecorder
      const options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/webm';
      }

      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.audioChunks = [];

      // Setup audio context for visualization
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.analyser);
      this.analyser.fftSize = 256;

      // Collect audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms
      console.log('🎙️ Recording started');
      
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone');
      return false;
    }
  }

  // Stop recording and return audio blob
  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Create audio blob
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }

        // Close audio context
        if (this.audioContext) {
          this.audioContext.close();
        }

        // Reset
        this.audioChunks = [];
        this.mediaRecorder = null;
        this.stream = null;
        
        console.log('🛑 Recording stopped, size:', blob.size);
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  // Get audio level for visualization
  getAudioLevel() {
    if (!this.analyser) return 0;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const average = sum / dataArray.length;
    
    return average / 255; // Normalize to 0-1
  }

  // Upload audio to Firebase Storage
  async uploadAudio(blob, helmetId) {
    try {
      const timestamp = Date.now();
      const filename = `voices/admin_${timestamp}_to_${helmetId}.webm`;
      const storageRef = ref(storage, filename);

      // Upload file
      console.log('📤 Uploading audio...');
      const snapshot = await uploadBytes(storageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('✅ Upload complete:', downloadURL);

      return {
        url: downloadURL,
        path: filename,
        size: blob.size
      };
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast.error('Failed to upload voice message');
      throw error;
    }
  }

  // Convert webm to wav (optional, for better ESP32 compatibility)
  async convertToWav(blob) {
    // This is a simplified version
    // For production, use a library like lamejs or ffmpeg.wasm
    return blob; // For now, return as-is
  }

  // Play audio from URL
  async playAudio(url, onEnded) {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      
      audio.onended = () => {
        console.log('🔊 Playback ended');
        if (onEnded) onEnded();
      };

      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        toast.error('Failed to play audio');
      };

      await audio.play();
      console.log('🔊 Playing audio');
      
      return audio;
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Could not play audio');
      throw error;
    }
  }

  // Cancel recording
  cancelRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }

    this.audioChunks = [];
    this.mediaRecorder = null;
    this.stream = null;
    
    console.log('❌ Recording cancelled');
  }

  // Get recording duration
  getRecordingDuration() {
    if (!this.mediaRecorder) return 0;
    // Duration tracking should be handled externally with a timer
    return 0;
  }
}

// Create singleton instance
const voiceService = new VoiceService();

export default voiceService;
