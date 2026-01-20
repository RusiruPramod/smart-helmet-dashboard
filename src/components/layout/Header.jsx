import { useState, useEffect } from 'react';
import { useAuthStore } from '@stores/authStore';
import { useAlertStore } from '@stores/alertStore';
import { signOut } from 'firebase/auth';
import { auth } from '@config/firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import wsService from '@services/websocket';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, logout } = useAuthStore();
  const { unreadCount } = useAlertStore();
  const [networkLatency, setNetworkLatency] = useState(32);
  const [isConnected, setIsConnected] = useState(true);
  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate network latency check
  useEffect(() => {
    const checkLatency = setInterval(() => {
      const latency = Math.floor(Math.random() * 30) + 20;
      setNetworkLatency(latency);
      setIsConnected(wsService.isConnected());
    }, 5000);

    return () => clearInterval(checkLatency);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg relative animate-bounceIn">
          <i className="fas fa-hard-hat text-base"></i>
          <i className="fas fa-wifi absolute -bottom-0.5 -right-0.5 text-[8px] bg-white text-blue-600 rounded-full p-0.5 border border-blue-100"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 animate-bounceIn">IoT Dashboard</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <i className="fas fa-clock text-blue-500"></i>
            <span className="live-pulse font-medium">
              {formatDate()} {formatTime()}
            </span>
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">LIVE</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Alerts Badge */}
        <div className="relative">
          <button className="text-slate-600 hover:text-blue-600 transition-colors">
            <i className="fas fa-bell text-xl"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Connection Status */}
        <div className="text-right hidden md:block">
          <div className="text-sm text-slate-500">Connection Status</div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="font-mono text-sm text-slate-700">
              {isConnected ? '192.168.1.100' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Network Latency */}
        <div className="text-right hidden md:block">
          <div className="text-sm text-slate-500">Network Latency</div>
          <div className="font-semibold text-slate-800">{networkLatency}ms</div>
        </div>

        {/* User Profile */}
        <div className="relative group">
          <button className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full border-2 border-white shadow-sm overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=3b82f6&color=fff`}
                alt="User" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <i className="fas fa-check text-white text-xs"></i>
            </div>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3 border-b border-slate-100">
              <div className="font-semibold text-slate-800">{user?.name || 'Admin'}</div>
              <div className="text-sm text-slate-500">{user?.email}</div>
              <div className="text-xs text-blue-600 mt-1">{user?.role || 'Admin'}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
