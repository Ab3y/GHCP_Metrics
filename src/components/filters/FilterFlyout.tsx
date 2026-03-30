import { useEffect, useMemo } from 'react';
import { X, RotateCcw, Calendar, Code, Monitor, Cpu } from 'lucide-react';
import { useFilterStore } from '../../store/filterStore';
import { useThemeStore } from '../../store/themeStore';
import { useMetrics } from '../../hooks/useMetrics';
import { getUniqueLanguages, getUniqueEditors, getUniqueModels } from '../../utils';

const DATE_PRESETS = ['7d', '14d', '28d'] as const;

function CheckboxGroup({
  label,
  icon,
  options,
  selected,
  onChange,
  isDark,
}: {
  label: string;
  icon: React.ReactNode;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  isDark: boolean;
}) {
  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {label}
          </span>
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      {options.length === 0 ? (
        <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          No options available
        </p>
      ) : (
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                onClick={() => toggle(option)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  isSelected
                    ? 'bg-neon-cyan/10 text-neon-cyan'
                    : isDark
                      ? 'text-gray-300 hover:bg-dark-hover'
                      : 'text-gray-700 hover:bg-light-hover'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-neon-cyan border-neon-cyan'
                      : isDark
                        ? 'border-dark-border'
                        : 'border-light-border'
                  }`}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5L4 7L8 3"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="truncate">{option}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FilterFlyout() {
  const {
    filterPanelOpen,
    setFilterPanelOpen,
    datePreset,
    setDatePreset,
    languages,
    setLanguages,
    editors,
    setEditors,
    models,
    setModels,
    resetFilters,
  } = useFilterStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { data } = useMetrics();

  const languageOptions = useMemo(() => (data ? getUniqueLanguages(data) : []), [data]);
  const editorOptions = useMemo(() => (data ? getUniqueEditors(data) : []), [data]);
  const modelOptions = useMemo(() => (data ? getUniqueModels(data) : []), [data]);

  const activeFilterCount =
    languages.length + editors.length + models.length + (datePreset !== '28d' ? 1 : 0);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setFilterPanelOpen(false);
    }
    if (filterPanelOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [filterPanelOpen, setFilterPanelOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      {filterPanelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => setFilterPanelOpen(false)}
        />
      )}

      {/* Flyout panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-80 transform transition-transform duration-300 ease-in-out border-l flex flex-col ${
          filterPanelOpen ? 'translate-x-0' : 'translate-x-full'
        } ${
          isDark
            ? 'bg-dark-surface border-dark-border'
            : 'bg-light-surface border-light-border'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${
            isDark ? 'border-dark-border' : 'border-light-border'
          }`}
        >
          <div className="flex items-center gap-2">
            <h2
              className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <span className="bg-neon-cyan/20 text-neon-cyan text-xs px-2 py-0.5 rounded-full font-medium">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setFilterPanelOpen(false)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-dark-hover'
                : 'text-gray-500 hover:text-gray-900 hover:bg-light-hover'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Date range */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Date Range
              </span>
            </div>
            <div className="flex gap-2">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setDatePreset(preset)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    datePreset === preset
                      ? 'bg-neon-cyan/20 text-neon-cyan ring-1 ring-neon-cyan/30'
                      : isDark
                        ? 'text-gray-400 hover:text-white bg-dark-card hover:bg-dark-hover'
                        : 'text-gray-500 hover:text-gray-900 bg-light-card hover:bg-light-hover'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className={`border-t ${isDark ? 'border-dark-border' : 'border-light-border'}`} />

          {/* Languages */}
          <CheckboxGroup
            label="Languages"
            icon={<Code size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />}
            options={languageOptions}
            selected={languages}
            onChange={setLanguages}
            isDark={isDark}
          />

          {/* Divider */}
          <div className={`border-t ${isDark ? 'border-dark-border' : 'border-light-border'}`} />

          {/* Editors */}
          <CheckboxGroup
            label="Editors"
            icon={<Monitor size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />}
            options={editorOptions}
            selected={editors}
            onChange={setEditors}
            isDark={isDark}
          />

          {/* Divider */}
          <div className={`border-t ${isDark ? 'border-dark-border' : 'border-light-border'}`} />

          {/* Models */}
          <CheckboxGroup
            label="Models"
            icon={<Cpu size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />}
            options={modelOptions}
            selected={models}
            onChange={setModels}
            isDark={isDark}
          />
        </div>

        {/* Footer with reset */}
        <div
          className={`flex-shrink-0 px-5 py-4 border-t ${
            isDark ? 'border-dark-border' : 'border-light-border'
          }`}
        >
          <button
            onClick={() => {
              resetFilters();
            }}
            disabled={activeFilterCount === 0}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeFilterCount > 0
                ? 'text-neon-magenta hover:bg-neon-magenta/10 border border-neon-magenta/30'
                : isDark
                  ? 'text-gray-600 border border-dark-border cursor-not-allowed'
                  : 'text-gray-400 border border-light-border cursor-not-allowed'
            }`}
          >
            <RotateCcw size={14} />
            Reset All Filters
          </button>
        </div>
      </div>
    </>
  );
}
