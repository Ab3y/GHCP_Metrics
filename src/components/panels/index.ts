import type { ComponentType } from 'react';
import type { PanelId } from '../../store/pinStore';
import { AdoptionPanel } from './AdoptionPanel';
import { CompletionsPanel } from './CompletionsPanel';
import { LanguagesPanel } from './LanguagesPanel';
import { EditorsPanel } from './EditorsPanel';
import { ChatPanel } from './ChatPanel';
import { PRSummariesPanel } from './PRSummariesPanel';
import { SeatsPanel } from './SeatsPanel';
import { TrendsPanel } from './TrendsPanel';

export { AdoptionPanel } from './AdoptionPanel';
export { CompletionsPanel } from './CompletionsPanel';
export { LanguagesPanel } from './LanguagesPanel';
export { EditorsPanel } from './EditorsPanel';
export { ChatPanel } from './ChatPanel';
export { PRSummariesPanel } from './PRSummariesPanel';
export { SeatsPanel } from './SeatsPanel';
export { TrendsPanel } from './TrendsPanel';

/** Maps each panel ID to its component — used by Home to render pinned panels. */
export const PANEL_REGISTRY: Record<PanelId, ComponentType> = {
  adoption: AdoptionPanel,
  completions: CompletionsPanel,
  languages: LanguagesPanel,
  editors: EditorsPanel,
  chat: ChatPanel,
  'pr-summaries': PRSummariesPanel,
  seats: SeatsPanel,
  trends: TrendsPanel,
};
