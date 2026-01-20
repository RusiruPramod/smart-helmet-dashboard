import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <Header />
        <Navigation />
        <main className="mt-8">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="mt-10 text-center text-slate-400 text-sm">
          <p>Smart Mining IoT Dashboard v1.0 • <span className="text-blue-500">Auto-refresh: Enabled</span></p>
          <p className="mt-2">ESP32 Connected • All Systems Operational</p>
        </footer>
      </div>
    </div>
  );
}
