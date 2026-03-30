import { useRef, type ReactNode } from 'react';
import type { PanelId } from '../../store/pinStore';
import { Pin } from 'lucide-react';
import { InfoIcon } from './InfoIcon';
import { PanelExportButton } from '../export/PanelExportButton';
import { usePinStore } from '../../store/pinStore';
import { useThemeStore } from '../../store/themeStore';

interface PanelCardProps {
  id: PanelId;
  title: string;
  neonColor: string;
  children: ReactNode;
  infoTitle: string;
  infoDescription: string;
  infoDocsUrl?: string;
  infoApiEndpoint?: string;
  onExport?: () => void;
  exportData?: Record<string, unknown>[];
}

export function PanelCard({
  id,
  title,
  neonColor,
  children,
  infoTitle,
  infoDescription,
  infoDocsUrl,
  infoApiEndpoint,
  onExport: _onExport,
  exportData,
}: PanelCardProps) {
  const { isPinned, togglePin } = usePinStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const pinned = isPinned(id);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={panelRef}
      className={`panel-card rounded-xl border p-5 ${
        isDark ? 'bg-dark-card' : 'bg-light-card'
      }`}
      style={{ borderColor: `var(--color-neon-${neonColor})` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <div className="flex items-center gap-1">
          <InfoIcon
            title={infoTitle}
            description={infoDescription}
            docsUrl={infoDocsUrl}
            apiEndpoint={infoApiEndpoint}
          />
          <button
            onClick={() => togglePin(id)}
            className={`p-1 rounded transition-colors ${
              pinned ? 'text-neon-cyan' : 'text-gray-400 hover:text-neon-cyan'
            }`}
            aria-label={pinned ? 'Unpin panel' : 'Pin panel'}
          >
            <Pin size={16} className={pinned ? 'fill-current' : ''} />
          </button>
          <PanelExportButton
            getPanelElement={() => panelRef.current}
            data={exportData}
            panelName={title.toLowerCase().replace(/\s+/g, '-')}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
