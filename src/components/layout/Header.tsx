import { useState } from 'react';
import { ChevronDown, Download, Plus, Building2 } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Badge } from '../ui/Badge';
import { ExportModal } from '../export/ExportModal';
import { useAuthStore } from '../../store/authStore';
import { useOrgStore } from '../../store/orgStore';
import { useThemeStore } from '../../store/themeStore';
import { useFilterStore } from '../../store/filterStore';
import { exportToPdf } from '../../utils/exportPdf';
import { exportToHtml } from '../../utils/exportHtml';
import { exportMetricsToCsv } from '../../utils/exportCsv';
import { getMockMetrics } from '../../api/mockData';

export function Header() {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const { theme } = useThemeStore();
  const { demoMode } = useAuthStore();
  const { current, savedOrgs, setCurrent, setTeamSlug, teamSlug } = useOrgStore();
  const { resetFilters } = useFilterStore();
  const isDark = theme === 'dark';

  return (
    <header
      className={`fixed top-0 right-0 left-64 z-20 h-16 flex items-center justify-between px-6 border-b ${
        isDark
          ? 'bg-dark-surface/80 border-dark-border backdrop-blur-sm'
          : 'bg-light-surface/80 border-light-border backdrop-blur-sm'
      } max-lg:left-0 max-lg:pl-16`}
    >
      <div className="flex items-center gap-4">
        {/* Org switcher */}
        <div className="relative">
          <button
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors ${
              isDark
                ? 'bg-dark-card border-dark-border text-white hover:border-neon-cyan'
                : 'bg-light-card border-light-border text-gray-900 hover:border-neon-cyan'
            }`}
          >
            <Building2 size={16} className="text-neon-cyan" />
            <span>{current ? current.name : 'Select org'}</span>
            <ChevronDown size={14} />
          </button>

          {orgDropdownOpen && (
            <div
              className={`absolute top-full mt-2 left-0 w-56 rounded-xl border shadow-lg z-50 ${
                isDark
                  ? 'bg-dark-card border-dark-border'
                  : 'bg-light-card border-light-border'
              }`}
            >
              {savedOrgs.length === 0 ? (
                <div className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No orgs added yet
                </div>
              ) : (
                <div className="py-1">
                  {savedOrgs.map((org) => (
                    <button
                      key={org.name}
                      onClick={() => {
                        setCurrent(org);
                        resetFilters();
                        setOrgDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        current?.name === org.name
                          ? 'text-neon-cyan'
                          : isDark
                            ? 'text-gray-300 hover:bg-dark-hover'
                            : 'text-gray-700 hover:bg-light-hover'
                      }`}
                    >
                      <div className="font-medium">{org.name}</div>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {org.type}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className={`border-t ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
                <a
                  href="/settings"
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    isDark
                      ? 'text-gray-400 hover:text-neon-cyan'
                      : 'text-gray-500 hover:text-neon-cyan'
                  }`}
                  onClick={() => setOrgDropdownOpen(false)}
                >
                  <Plus size={14} />
                  Add organization
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Team filter */}
        {current && (
          <input
            type="text"
            placeholder="Filter by team slug..."
            value={teamSlug ?? ''}
            onChange={(e) => setTeamSlug(e.target.value || null)}
            className={`px-3 py-1.5 rounded-xl border text-sm w-48 transition-colors ${
              isDark
                ? 'bg-dark-card border-dark-border text-white placeholder-gray-500 focus:border-neon-cyan'
                : 'bg-light-card border-light-border text-gray-900 placeholder-gray-400 focus:border-neon-cyan'
            } outline-none`}
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        {demoMode && <Badge variant="orange">Demo Mode</Badge>}
        <ThemeToggle />
        <button
          onClick={() => setExportOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors ${
            isDark
              ? 'border-dark-border text-gray-300 hover:text-neon-cyan hover:border-neon-cyan'
              : 'border-light-border text-gray-600 hover:text-neon-cyan hover:border-neon-cyan'
          }`}
        >
          <Download size={14} />
          Export
        </button>
      </div>

      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        onExportPdf={() => exportToPdf('dashboard-content')}
        onExportHtml={() => exportToHtml('dashboard-content')}
        onExportCsv={() => exportMetricsToCsv(getMockMetrics())}
      />
    </header>
  );
}
