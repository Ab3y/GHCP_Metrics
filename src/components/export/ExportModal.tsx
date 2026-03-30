import { useState } from 'react';
import { Download, X, FileText, Globe, Table } from 'lucide-react';
import { useThemeStore } from '../../store';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportPdf: () => void | Promise<void>;
  onExportHtml: () => void | Promise<void>;
  onExportCsv: () => void | Promise<void>;
}

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: typeof FileText;
  color: string;
  action: () => void | Promise<void>;
}

export function ExportModal({
  isOpen,
  onClose,
  onExportPdf,
  onExportHtml,
  onExportCsv,
}: ExportModalProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [exporting, setExporting] = useState<string | null>(null);

  if (!isOpen) return null;

  const options: ExportOption[] = [
    {
      id: 'pdf',
      label: 'Export as PDF',
      description: 'High-quality PDF report with charts',
      icon: FileText,
      color: '#ff4d8d',
      action: onExportPdf,
    },
    {
      id: 'html',
      label: 'Export as HTML',
      description: 'Standalone HTML page you can share',
      icon: Globe,
      color: '#00fff7',
      action: onExportHtml,
    },
    {
      id: 'csv',
      label: 'Export as CSV',
      description: 'Raw data in spreadsheet format',
      icon: Table,
      color: '#a78bfa',
      action: onExportCsv,
    },
  ];

  async function handleExport(option: ExportOption) {
    setExporting(option.id);
    try {
      await option.action();
    } finally {
      setExporting(null);
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md rounded-xl border p-6 shadow-2xl ${
          isDark
            ? 'border-white/10 bg-[#12121a]'
            : 'border-gray-200 bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Download
              size={20}
              className={isDark ? 'text-neon-cyan' : 'text-blue-600'}
            />
            <h2
              className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Export Dashboard
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`rounded-lg p-1 transition-colors ${
              isDark
                ? 'text-gray-400 hover:bg-white/10 hover:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
            aria-label="Close export modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Export Options */}
        <div className="flex flex-col gap-3">
          {options.map((option) => {
            const Icon = option.icon;
            const isActive = exporting === option.id;

            return (
              <button
                key={option.id}
                onClick={() => void handleExport(option)}
                disabled={exporting !== null}
                className={`group flex items-center gap-4 rounded-lg border p-4 text-left transition-all ${
                  isDark
                    ? 'border-white/10 hover:border-opacity-80 bg-white/5 hover:bg-white/10'
                    : 'border-gray-200 hover:border-opacity-80 bg-gray-50 hover:bg-gray-100'
                } ${isActive ? 'opacity-70' : ''}`}
                style={{
                  borderColor: isActive ? option.color : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = option.color;
                    e.currentTarget.style.boxShadow = `0 0 12px ${option.color}33`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.boxShadow = '';
                  }
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${option.color}15` }}
                >
                  <Icon size={20} style={{ color: option.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {isActive ? 'Exporting…' : option.label}
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {option.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
