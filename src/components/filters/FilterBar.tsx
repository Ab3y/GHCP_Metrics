import { RotateCcw } from 'lucide-react';
import { MultiSelect } from './MultiSelect';
import { useFilterStore } from '../../store/filterStore';
import { useThemeStore } from '../../store/themeStore';

const DATE_PRESETS = ['7d', '14d', '28d'] as const;

const LANGUAGE_OPTIONS = [
  'TypeScript',
  'Python',
  'JavaScript',
  'Go',
  'Ruby',
  'Java',
  'C#',
  'Rust',
];

const EDITOR_OPTIONS = ['VS Code', 'JetBrains', 'Neovim', 'Visual Studio'];

const MODEL_OPTIONS = ['default', 'gpt-4o', 'custom-acme-v2'];

export function FilterBar() {
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
        options={LANGUAGE_OPTIONS}
        selected={languages}
        onChange={setLanguages}
      />
      <MultiSelect
        label="Editors"
        options={EDITOR_OPTIONS}
        selected={editors}
        onChange={setEditors}
      />
      <MultiSelect
        label="Models"
        options={MODEL_OPTIONS}
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
