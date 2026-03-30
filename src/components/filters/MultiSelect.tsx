import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
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

  function toggleOption(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm transition-colors ${
          isDark
            ? 'bg-dark-card border-dark-border text-gray-300 hover:border-neon-cyan'
            : 'bg-light-card border-light-border text-gray-600 hover:border-neon-cyan'
        }`}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-neon-cyan/20 text-neon-cyan text-xs px-1.5 py-0.5 rounded-full font-medium">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div
          className={`absolute top-full mt-2 left-0 w-56 max-h-60 overflow-y-auto rounded-xl border shadow-lg z-50 py-1 ${
            isDark
              ? 'bg-dark-card border-dark-border'
              : 'bg-light-card border-light-border'
          }`}
        >
          {options.length === 0 ? (
            <div className={`px-4 py-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              No options available
            </div>
          ) : (
            options.map((option) => {
              const isSelected = selected.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${
                    isDark
                      ? 'text-gray-300 hover:bg-dark-hover'
                      : 'text-gray-700 hover:bg-light-hover'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-neon-cyan border-neon-cyan'
                        : isDark
                          ? 'border-dark-border'
                          : 'border-light-border'
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-black" />}
                  </div>
                  <span>{option}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
