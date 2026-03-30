import { create } from 'zustand';

type DatePreset = '7d' | '14d' | '28d' | 'custom';

interface FilterState {
  datePreset: DatePreset;
  dateRange: { since: string; until: string };
  languages: string[];
  editors: string[];
  models: string[];
  setDatePreset: (preset: DatePreset) => void;
  setDateRange: (range: { since: string; until: string }) => void;
  setLanguages: (languages: string[]) => void;
  setEditors: (editors: string[]) => void;
  setModels: (models: string[]) => void;
  resetFilters: () => void;
}

function getDateRange(preset: DatePreset): { since: string; until: string } {
  const now = new Date();
  const until = now.toISOString().split('T')[0];
  const days = preset === '7d' ? 7 : preset === '14d' ? 14 : 28;
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  return { since, until };
}

export const useFilterStore = create<FilterState>()((set) => ({
  datePreset: '28d',
  dateRange: getDateRange('28d'),
  languages: [],
  editors: [],
  models: [],
  setDatePreset: (datePreset) =>
    set({ datePreset, dateRange: getDateRange(datePreset) }),
  setDateRange: (dateRange) => set({ dateRange, datePreset: 'custom' }),
  setLanguages: (languages) => set({ languages }),
  setEditors: (editors) => set({ editors }),
  setModels: (models) => set({ models }),
  resetFilters: () =>
    set({
      datePreset: '28d',
      dateRange: getDateRange('28d'),
      languages: [],
      editors: [],
      models: [],
    }),
}));
