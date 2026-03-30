import { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { exportToPdf, exportToCsv } from '../../utils/export';

interface PanelExportButtonProps {
  /** Returns the panel DOM element to capture */
  getPanelElement: () => HTMLElement | null;
  /** Panel data for CSV export */
  data?: Record<string, unknown>[];
  /** Name used in the exported file */
  panelName: string;
}

export function PanelExportButton({ getPanelElement, data, panelName }: PanelExportButtonProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handlePdf = async () => {
    setOpen(false);
    const el = getPanelElement();
    if (el) await exportToPdf(el, panelName, 'portrait');
  };

  const handleCsv = async () => {
    setOpen(false);
    if (data?.length) await exportToCsv(data, panelName);
  };

  const itemClass = `w-full text-left px-3 py-1.5 text-sm transition-colors ${
    isDark
      ? 'text-gray-300 hover:text-neon-cyan hover:bg-dark-hover'
      : 'text-gray-600 hover:text-neon-cyan hover:bg-light-hover'
  }`;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded text-gray-400 hover:text-neon-cyan transition-colors"
        aria-label="Export panel data"
      >
        <Download size={16} />
      </button>

      {open && (
        <div
          className={`absolute right-0 top-full mt-1 w-36 rounded-lg border shadow-lg z-50 py-1 ${
            isDark
              ? 'bg-dark-card border-dark-border'
              : 'bg-light-card border-light-border'
          }`}
        >
          <button onClick={handlePdf} className={itemClass}>
            Export PDF
          </button>
          {data && data.length > 0 && (
            <button onClick={handleCsv} className={itemClass}>
              Export CSV
            </button>
          )}
        </div>
      )}
    </div>
  );
}
