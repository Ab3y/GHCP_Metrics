import type {
  CopilotMetricsDay,
  CopilotSeatsResponse,
  CopilotSeat,
  CopilotIdeCodeCompletions,
  CopilotIdeChat,
  CopilotDotcomChat,
  CopilotDotcomPullRequests,
  LanguageCompletions,
} from './types';

// ---------- helpers ----------

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function isoDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function isWeekend(dateStr: string): boolean {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}

function vary(rand: () => number, base: number, pct = 0.2): number {
  return Math.round(base * (1 + (rand() - 0.5) * 2 * pct));
}

// ---------- language completions ----------

const LANGUAGES = [
  'TypeScript',
  'Python',
  'JavaScript',
  'Go',
  'Ruby',
  'Java',
  'C#',
  'Rust',
] as const;

function buildLanguageCompletions(
  rand: () => number,
  weekday: boolean,
  adoptionFactor: number,
): LanguageCompletions[] {
  const weights: Record<string, number> = {
    TypeScript: 1.0,
    Python: 0.85,
    JavaScript: 0.7,
    Go: 0.5,
    Java: 0.45,
    'C#': 0.35,
    Ruby: 0.25,
    Rust: 0.15,
  };

  return LANGUAGES.map((name) => {
    const w = weights[name] ?? 0.2;
    const dayFactor = weekday ? 1 : 0.3;
    const engaged = Math.max(1, vary(rand, Math.round(30 * w * dayFactor * adoptionFactor)));
    const suggestions = vary(rand, Math.round(500 * w * dayFactor * adoptionFactor));
    const acceptanceRate = 0.25 + rand() * 0.15;
    const linesSuggested = vary(rand, Math.round(suggestions * 2.5));
    return {
      name,
      total_engaged_users: engaged,
      total_code_suggestions: suggestions,
      total_code_acceptances: Math.round(suggestions * acceptanceRate),
      total_code_lines_suggested: linesSuggested,
      total_code_lines_accepted: Math.round(linesSuggested * (acceptanceRate + 0.05)),
    };
  });
}

// ---------- IDE completions ----------

const EDITORS = ['VS Code', 'JetBrains', 'Neovim', 'Visual Studio'] as const;
const EDITOR_WEIGHTS: Record<string, number> = {
  'VS Code': 1.0,
  JetBrains: 0.45,
  Neovim: 0.12,
  'Visual Studio': 0.25,
};

function buildIdeCompletions(
  rand: () => number,
  weekday: boolean,
  adoptionFactor: number,
): CopilotIdeCodeCompletions {
  const editors = EDITORS.map((name) => {
    const w = EDITOR_WEIGHTS[name] ?? 0.2;
    const dayFactor = weekday ? 1 : 0.25;
    const engaged = Math.max(1, vary(rand, Math.round(40 * w * dayFactor * adoptionFactor)));
    const langs = buildLanguageCompletions(rand, weekday, adoptionFactor * w);

    return {
      name,
      total_engaged_users: engaged,
      models: [
        {
          name: 'default',
          is_custom_model: false,
          custom_model_training_date: null,
          total_engaged_users: Math.max(1, engaged - vary(rand, Math.round(engaged * 0.15))),
          languages: langs.slice(0, 6),
        },
        {
          name: 'custom-acme-v2',
          is_custom_model: true,
          custom_model_training_date: '2025-01-15',
          total_engaged_users: Math.max(1, vary(rand, Math.round(engaged * 0.15))),
          languages: langs.slice(0, 3).map((l) => ({
            ...l,
            total_engaged_users: Math.max(1, Math.round(l.total_engaged_users * 0.15)),
            total_code_suggestions: Math.round(l.total_code_suggestions * 0.15),
            total_code_acceptances: Math.round(l.total_code_acceptances * 0.18),
            total_code_lines_suggested: Math.round(l.total_code_lines_suggested * 0.15),
            total_code_lines_accepted: Math.round(l.total_code_lines_accepted * 0.18),
          })),
        },
      ],
    };
  });

  const totalEngaged = Math.max(
    1,
    vary(rand, Math.round(65 * (weekday ? 1 : 0.3) * adoptionFactor)),
  );

  return {
    total_engaged_users: totalEngaged,
    languages: LANGUAGES.map((name) => ({
      name,
      total_engaged_users: Math.max(
        1,
        vary(rand, Math.round(totalEngaged * (EDITOR_WEIGHTS[name] ?? 0.3))),
      ),
    })),
    editors,
  };
}

// ---------- IDE chat ----------

function buildIdeChat(
  rand: () => number,
  weekday: boolean,
  adoptionFactor: number,
): CopilotIdeChat {
  const dayFactor = weekday ? 1 : 0.2;
  const editors = EDITORS.map((name) => {
    const w = EDITOR_WEIGHTS[name] ?? 0.2;
    const engaged = Math.max(1, vary(rand, Math.round(35 * w * dayFactor * adoptionFactor)));
    return {
      name,
      total_engaged_users: engaged,
      models: [
        {
          name: 'default',
          is_custom_model: false,
          custom_model_training_date: null,
          total_engaged_users: engaged,
          total_chats: vary(rand, Math.round(engaged * 4.5)),
          total_chat_insertion_events: vary(rand, Math.round(engaged * 2)),
          total_chat_copy_events: vary(rand, Math.round(engaged * 1.5)),
        },
      ],
    };
  });

  return {
    total_engaged_users: Math.max(
      1,
      vary(rand, Math.round(50 * dayFactor * adoptionFactor)),
    ),
    editors,
  };
}

// ---------- dotcom chat ----------

function buildDotcomChat(
  rand: () => number,
  weekday: boolean,
  adoptionFactor: number,
): CopilotDotcomChat {
  const dayFactor = weekday ? 1 : 0.15;
  const engaged = Math.max(1, vary(rand, Math.round(20 * dayFactor * adoptionFactor)));
  return {
    total_engaged_users: engaged,
    models: [
      {
        name: 'default',
        is_custom_model: false,
        custom_model_training_date: null,
        total_engaged_users: engaged,
        total_chats: vary(rand, Math.round(engaged * 3)),
      },
    ],
  };
}

// ---------- pull requests ----------

const PR_REPOS = [
  'acme/web-app',
  'acme/api-service',
  'acme/mobile-client',
  'acme/infra-config',
  'acme/data-pipeline',
] as const;

function buildPullRequests(
  rand: () => number,
  weekday: boolean,
  adoptionFactor: number,
): CopilotDotcomPullRequests {
  const dayFactor = weekday ? 1 : 0.1;
  const repos = PR_REPOS.map((name) => {
    const engaged = Math.max(1, vary(rand, Math.round(8 * dayFactor * adoptionFactor)));
    return {
      name,
      total_engaged_users: engaged,
      models: [
        {
          name: 'default',
          is_custom_model: false,
          custom_model_training_date: null,
          total_pr_summaries_created: vary(rand, Math.round(engaged * 1.8)),
          total_engaged_users: engaged,
        },
      ],
    };
  });

  return {
    total_engaged_users: Math.max(
      1,
      vary(rand, Math.round(25 * dayFactor * adoptionFactor)),
    ),
    repositories: repos,
  };
}

// ---------- daily metrics ----------

function buildDay(daysAgo: number, rand: () => number): CopilotMetricsDay {
  const date = isoDate(daysAgo);
  const weekday = !isWeekend(date);
  // gradual adoption: older days = smaller factor
  const adoptionFactor = 0.7 + 0.3 * ((28 - daysAgo) / 28);
  const dayFactor = weekday ? 1 : 0.3;

  const activeUsers = vary(rand, Math.round(80 * dayFactor * adoptionFactor));
  const engagedUsers = Math.round(activeUsers * (0.7 + rand() * 0.15));

  return {
    date,
    total_active_users: activeUsers,
    total_engaged_users: engagedUsers,
    copilot_ide_code_completions: buildIdeCompletions(rand, weekday, adoptionFactor),
    copilot_ide_chat: buildIdeChat(rand, weekday, adoptionFactor),
    copilot_dotcom_chat: buildDotcomChat(rand, weekday, adoptionFactor),
    copilot_dotcom_pull_requests: buildPullRequests(rand, weekday, adoptionFactor),
  };
}

// ---------- seats ----------

interface MockUser {
  login: string;
  id: number;
  team: string | null;
  editor: string | null;
  daysAgoActive: number | null;
}

const MOCK_USERS: MockUser[] = [
  { login: 'jchen-dev', id: 10001, team: 'platform', editor: 'vscode', daysAgoActive: 0 },
  { login: 'agarcia', id: 10002, team: 'platform', editor: 'vscode', daysAgoActive: 1 },
  { login: 'mwilliams', id: 10003, team: 'platform', editor: 'jetbrains', daysAgoActive: 0 },
  { login: 'kpatel-eng', id: 10004, team: 'frontend', editor: 'vscode', daysAgoActive: 2 },
  { login: 'sjohnson', id: 10005, team: 'frontend', editor: 'vscode', daysAgoActive: 0 },
  { login: 'rbrown', id: 10006, team: 'frontend', editor: 'neovim', daysAgoActive: 3 },
  { login: 'lwang', id: 10007, team: 'backend', editor: 'jetbrains', daysAgoActive: 0 },
  { login: 'nmartinez', id: 10008, team: 'backend', editor: 'vscode', daysAgoActive: 1 },
  { login: 'dkim-ops', id: 10009, team: 'backend', editor: 'vscode', daysAgoActive: 5 },
  { login: 'ethomas', id: 10010, team: 'data', editor: 'vscode', daysAgoActive: 0 },
  { login: 'pjackson', id: 10011, team: 'data', editor: 'jetbrains', daysAgoActive: 7 },
  { login: 'cwilson', id: 10012, team: 'mobile', editor: 'vscode', daysAgoActive: 1 },
  { login: 'hlee-mobile', id: 10013, team: 'mobile', editor: 'vscode', daysAgoActive: 0 },
  { login: 'fanderson', id: 10014, team: null, editor: null, daysAgoActive: null },
  { login: 'gtaylor', id: 10015, team: 'devops', editor: 'neovim', daysAgoActive: 4 },
  { login: 'jrobinson', id: 10016, team: 'devops', editor: 'vscode', daysAgoActive: 0 },
  { login: 'mharris', id: 10017, team: 'security', editor: 'vscode', daysAgoActive: 2 },
  { login: 'kclark-sec', id: 10018, team: 'security', editor: 'jetbrains', daysAgoActive: 14 },
];

function buildSeats(): CopilotSeat[] {
  const now = new Date();
  return MOCK_USERS.map((u) => {
    const created = new Date(now);
    created.setDate(created.getDate() - 60 - Math.round(u.id % 30));

    const seat: CopilotSeat = {
      created_at: created.toISOString(),
      updated_at: new Date(now.getTime() - 86400000 * (u.daysAgoActive ?? 30)).toISOString(),
      pending_cancellation_date: u.login === 'fanderson' ? isoDate(-14) : null,
      last_activity_at:
        u.daysAgoActive !== null
          ? new Date(now.getTime() - 86400000 * u.daysAgoActive).toISOString()
          : null,
      last_activity_editor: u.editor,
      plan_type: 'business',
      assignee: {
        login: u.login,
        id: u.id,
        avatar_url: `https://avatars.githubusercontent.com/u/${u.id}?v=4`,
        html_url: `https://github.com/${u.login}`,
        type: 'User',
      },
      assigning_team: u.team
        ? {
            id: 5000 + MOCK_USERS.indexOf(u),
            name: `Team ${u.team.charAt(0).toUpperCase() + u.team.slice(1)}`,
            slug: u.team,
            description: `The ${u.team} team`,
          }
        : null,
    };
    return seat;
  });
}

// ---------- date shifting for sample data ----------

/** Shift sample data dates so the most recent entry is yesterday. */
function shiftDatesToRecent(days: CopilotMetricsDay[]): CopilotMetricsDay[] {
  if (days.length === 0) return days;
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const lastDate = new Date(sorted[sorted.length - 1].date + 'T00:00:00');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const diffMs = yesterday.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));
  return sorted.map((day) => {
    const d = new Date(day.date + 'T00:00:00');
    d.setDate(d.getDate() + diffDays);
    return { ...day, date: d.toISOString().slice(0, 10) };
  });
}

// ---------- public API (generated fallback) ----------

export function generateMockMetrics(): CopilotMetricsDay[] {
  const rand = seededRandom(42);
  const days: CopilotMetricsDay[] = [];
  for (let i = 27; i >= 0; i--) {
    days.push(buildDay(i, rand));
  }
  return days;
}

export function generateMockSeats(): CopilotSeatsResponse {
  const seats = buildSeats();
  return {
    total_seats: seats.length,
    seats,
  };
}

/** Kept for backward compatibility */
export const getMockMetrics = generateMockMetrics;
export const getMockSeats = generateMockSeats;

// ---------- sample data loaders (from GitHub copilot-metrics-viewer) ----------

/** Normalize a raw metrics entry so optional nested arrays always exist. */
function normalizeMetricsDay(raw: Record<string, unknown>): CopilotMetricsDay {
  const r = raw as unknown as CopilotMetricsDay;

  if (r.copilot_ide_code_completions) {
    r.copilot_ide_code_completions.languages ??= [];
    r.copilot_ide_code_completions.editors ??= [];
    for (const ed of r.copilot_ide_code_completions.editors) {
      ed.models ??= [];
      for (const m of ed.models) {
        m.languages ??= [];
      }
    }
  }

  if (r.copilot_ide_chat) {
    r.copilot_ide_chat.editors ??= [];
    for (const ed of r.copilot_ide_chat.editors) {
      ed.models ??= [];
    }
  }

  if (r.copilot_dotcom_chat) {
    (r.copilot_dotcom_chat as CopilotDotcomChat).models ??= [];
  }

  if (r.copilot_dotcom_pull_requests) {
    (r.copilot_dotcom_pull_requests as CopilotDotcomPullRequests).repositories ??= [];
    for (const repo of r.copilot_dotcom_pull_requests.repositories) {
      repo.models ??= [];
    }
  }

  return r;
}

let cachedMetrics: CopilotMetricsDay[] | null = null;
let cachedSeats: CopilotSeat[] | null = null;

export async function loadSampleMetrics(): Promise<CopilotMetricsDay[]> {
  if (cachedMetrics) return cachedMetrics;
  try {
    const response = await fetch('/mock-data/enterprise_metrics_response_sample.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data: Record<string, unknown>[] = await response.json();
    cachedMetrics = shiftDatesToRecent(data.map(normalizeMetricsDay));
    return cachedMetrics;
  } catch {
    // Fall back to generated mock data
    cachedMetrics = generateMockMetrics();
    return cachedMetrics;
  }
}

export async function loadSampleSeats(): Promise<CopilotSeatsResponse> {
  if (cachedSeats) return { total_seats: cachedSeats.length, seats: cachedSeats };
  try {
    const response = await fetch('/mock-data/enterprise_seats_response_sample.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const raw: CopilotSeat[] = data.seats ?? data;
    // Filter out entries with null assignee since the dashboard requires assignee info
    cachedSeats = raw.filter((s: CopilotSeat) => s.assignee != null);
    return { total_seats: cachedSeats.length, seats: cachedSeats };
  } catch {
    return generateMockSeats();
  }
}
