import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Code,
  MessageSquare,
  GitPullRequest,
  Users,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/completions', icon: Code, label: 'Code Completions' },
  { to: '/chat', icon: MessageSquare, label: 'Chat Analytics' },
  { to: '/pr-summaries', icon: GitPullRequest, label: 'PR Summaries' },
  { to: '/seats', icon: Users, label: 'Seats & Users' },
  { to: '/settings', icon: Settings, label: 'Settings' },
] as const;

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const sidebarClasses = `fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 ${
    isDark ? 'bg-dark-surface border-dark-border' : 'bg-light-surface border-light-border'
  } border-r w-64`;

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className={`fixed top-4 left-4 z-50 p-2 rounded-xl lg:hidden ${
          isDark ? 'bg-dark-surface text-white' : 'bg-light-surface text-gray-900'
        }`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${sidebarClasses} ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-inherit">
          <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
            <LayoutDashboard size={18} className="text-neon-cyan" />
          </div>
          <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Copilot Metrics
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? `text-neon-cyan ${isDark ? 'bg-neon-cyan/10' : 'bg-neon-cyan/10'}`
                    : `${isDark ? 'text-gray-400 hover:text-white hover:bg-dark-hover' : 'text-gray-600 hover:text-gray-900 hover:bg-light-hover'}`
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t border-inherit text-xs ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          GitHub Copilot Dashboard
        </div>
      </aside>
    </>
  );
}
