import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface InfoIconProps {
  title: string;
  description: string;
  docsUrl?: string;
  apiEndpoint?: string;
}

export function InfoIcon({ title, description, docsUrl, apiEndpoint }: InfoIconProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-neon-cyan transition-colors p-1 rounded"
        aria-label="More info"
      >
        <Info size={16} />
      </button>
      {open && (
        <div
          className={`absolute z-50 top-full mt-2 right-0 w-72 rounded-xl border p-4 shadow-lg ${
            isDark
              ? 'bg-dark-card border-neon-cyan text-white'
              : 'bg-light-card border-light-border text-gray-900'
          }`}
        >
          <h4 className="text-sm font-semibold mb-1">{title}</h4>
          <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
          {apiEndpoint && (
            <p className={`text-xs font-mono mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              API: {apiEndpoint}
            </p>
          )}
          {docsUrl && (
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neon-cyan hover:underline"
            >
              View docs →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
