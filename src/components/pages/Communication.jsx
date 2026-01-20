import { useState } from 'react';
import { useVoiceStore } from '@stores/voiceStore';
import voiceService from '@services/voiceService';

export default function Communication() {
  const { isListening, transcript } = useVoiceStore();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, {
        type: 'sent',
        text: message,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setMessage('');
    }
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      voiceService.stopListening();
    } else {
      voiceService.startListening();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Communication</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Communication */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Text Messages</h2>
          
          <div className="border border-gray-200 rounded-lg h-96 overflow-y-auto p-4 mb-4">
            {chatHistory.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet</p>
            ) : (
              <div className="space-y-3">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.type === 'sent'
                        ? 'bg-blue-100 ml-auto max-w-xs'
                        : 'bg-gray-100 mr-auto max-w-xs'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>

        {/* Voice Communication */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Voice Commands</h2>
          
          <div className="text-center mb-6">
            <button
              onClick={handleVoiceCommand}
              className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white shadow-lg transition-all`}
            >
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            <p className="mt-4 text-gray-600">
              {isListening ? 'Listening...' : 'Click to start voice command'}
            </p>
          </div>

          {transcript && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Transcript:</h3>
              <p className="text-gray-700">{transcript}</p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-medium mb-3">Available Commands:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                "Show dashboard"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                "Check sensors"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                "Show location"
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                "Emergency alert"
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
