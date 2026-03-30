import { RotateCcw } from 'lucide-react';
import { MultiSelect } from './MultiSelect';
import { useFilterStore } from '../../store/filterStore';
import { useThemeStore } from '../../store/themeStore';

const DATE_PRESETS = ['7d', '14d', '28d'] as const;

interface FilterBarProps {
  languageOptions?: string[];
  editorOptions?: string[];
  modelOptions?: string[];
}

export function FilterBar({ languageOptions = [], editorOptions = [], modelOptions = [] }: FilterBarProps) {
  const {
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

  const hasActiveFilters =
    languages.length > 0 || editors.length > 0 || models.length > 0;

  return (
    <div
      className={`flex flex-wrap items-center gap-3 p-4 rounded-xl border mb-6 ${
        isDark
          ? 'bg-dark-card border-dark-border'
          : 'bg-light-card border-light-border'
      }`}
    >
      {/* Date preset buttons */}
      <div className="flex items-center gap-1">
        {DATE_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => setDatePreset(preset)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              datePreset === preset
                ? 'bg-neon-cyan/20 text-neon-cyan'
                : isDark
                  ? 'text-gray-400 hover:text-white hover:bg-dark-hover'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-light-hover'
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      <div className={`w-px h-6 ${isDark ? 'bg-dark-border' : 'bg-light-border'}`} />

      {/* Multi-select filters */}
      <MultiSelect
        label="Languages"
        options={languageOptions}
        selected={languages}
        onChange={setLanguages}
      />
      <MultiSelect
        label="Editors"
        options={editorOptions}
        selected={editors}
        onChange={setEditors}
      />
      <MultiSelect
        label="Models"
        options={modelOptions}
        selected={models}
        onChange={setModels}
      />

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-neon-magenta hover:bg-neon-magenta/10 transition-colors"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      )}
    </div>
  );
}
