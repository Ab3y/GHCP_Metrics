import { usePinStore } from '../store/pinStore';
import { useThemeStore } from '../store/themeStore';
import { LayoutDashboard } from 'lucide-react';
import { PANEL_REGISTRY } from '../components/panels';

export function Home() {
  const { pinnedPanels } = usePinStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (pinnedPanels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <LayoutDashboard size={48} className="text-neon-cyan/30 mb-4" />
        <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          No pinned panels
        </h2>
        <p className={`text-sm max-w-md ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Navigate to individual pages and pin panels to build your custom dashboard.
          Pinned panels will appear here for quick access.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pinnedPanels.map((panelId) => {
          const PanelComponent = PANEL_REGISTRY[panelId];
          return <PanelComponent key={panelId} />;
        })}
      </div>
    </div>
  );
}
