import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'fa-th-large' },
  { path: '/sensors', label: 'Sensors', icon: 'fa-microchip' },
  { path: '/location', label: 'Location', icon: 'fa-map-marker-alt' },
  { path: '/communication', label: 'Communication', icon: 'fa-comments' },
  { path: '/cracks', label: 'Cracks', icon: 'fa-exclamation-triangle' },
  { path: '/settings', label: 'Settings', icon: 'fa-cog' }
];

export default function Navigation() {
  return (
    <nav className="hidden md:flex bg-white/60 p-1.5 rounded-2xl border border-slate-200/60 shadow-sm animate-fadeLeft">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${
              isActive
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100 font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`
          }
        >
          <i className={`fas ${item.icon}`}></i>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
