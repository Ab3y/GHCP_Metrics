import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PanelId =
  | 'adoption'
  | 'completions'
  | 'languages'
  | 'editors'
  | 'chat'
  | 'pr-summaries'
  | 'seats'
  | 'trends';

interface PinState {
  pinnedPanels: PanelId[];
  togglePin: (id: PanelId) => void;
  isPinned: (id: PanelId) => boolean;
  reorderPins: (panels: PanelId[]) => void;
}

const DEFAULT_PINS: PanelId[] = ['adoption', 'completions', 'languages', 'chat'];

export const usePinStore = create<PinState>()(
  persist(
    (set, get) => ({
      pinnedPanels: DEFAULT_PINS,
      togglePin: (id) =>
        set((state) => ({
          pinnedPanels: state.pinnedPanels.includes(id)
            ? state.pinnedPanels.filter((p) => p !== id)
            : [...state.pinnedPanels, id],
        })),
      isPinned: (id) => get().pinnedPanels.includes(id),
      reorderPins: (panels) => set({ pinnedPanels: panels }),
    }),
    { name: 'copilot-dashboard-pins' }
  )
);
