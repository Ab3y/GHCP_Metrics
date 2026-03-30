# GitHub Copilot Metrics Dashboard

A modern, responsive React + TypeScript dashboard for visualizing GitHub Copilot usage metrics. Features interactive charts, dark/light neon theming, pinnable panels, export capabilities, and support for organization, enterprise, and team-level views.

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Data Sources](#data-sources)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Chart Components](#chart-components)
- [Dashboard Panels](#dashboard-panels)
- [Pages](#pages)
- [Export System](#export-system)
- [Theming](#theming)
- [Configuration](#configuration)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
├─────────────────────────────────────────────────────────────┤
│  React 19 + React Router 7 (SPA)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Pages   │  │  Panels  │  │  Charts  │  │  Export   │  │
│  │ (6 views)│  │(8 panels)│  │(6 types) │  │(PDF/HTML/ │  │
│  │          │  │          │  │          │  │ CSV)      │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────────┘  │
│       │              │              │                       │
│  ┌────┴──────────────┴──────────────┴──────────────────┐   │
│  │              Zustand State (5 stores)               │   │
│  │  auth │ org │ filter │ pin │ theme                  │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │                  API Layer                           │   │
│  │  ┌─────────────┐  ┌───────────────┐  ┌───────────┐ │   │
│  │  │ client.ts   │  │ mockData.ts   │  │ types.ts  │ │   │
│  │  │ (live API)  │  │ (demo data)   │  │           │ │   │
│  │  └──────┬──────┘  └───────┬───────┘  └───────────┘ │   │
│  └─────────┼─────────────────┼─────────────────────────┘   │
├─────────────┼─────────────────┼─────────────────────────────┤
│             ▼                 ▼                             │
│   GitHub REST API     public/mock-data/                     │
│   (Copilot Metrics)   (sample JSON from GitHub)             │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | React | 19.2.4 | UI rendering |
| Language | TypeScript | 5.9.3 | Type safety |
| Build | Vite | 8.0.1 | Dev server & bundler |
| Styling | Tailwind CSS | 4.2.2 | Utility-first CSS with neon theme |
| Charts | Recharts | 3.8.1 | Composable chart components |
| Routing | React Router | 7.13.2 | Client-side navigation (6 routes) |
| State | Zustand | 5.0.12 | Lightweight stores with persistence |
| Icons | Lucide React | 1.7.0 | SVG icon library |
| PDF Export | jsPDF + html2canvas | 4.2.1 / 1.4.1 | Dashboard-to-PDF rendering |
| CSV Export | PapaParse | 5.5.3 | Data-to-CSV conversion |
| Drag & Drop | @dnd-kit | 6.3.1 | Panel reordering on home page |

## Data Sources

### Demo Mode (Default)

When no GitHub token is configured, the dashboard runs in **Demo Mode** using official sample data from the [`github-copilot-resources/copilot-metrics-viewer`](https://github.com/github-copilot-resources/copilot-metrics-viewer) repository.

**Sample data files** (stored in `public/mock-data/`):

| File | Source | Description |
|------|--------|-------------|
| `enterprise_metrics_response_sample.json` | [copilot-metrics-viewer](https://github.com/github-copilot-resources/copilot-metrics-viewer/tree/main/public/mock-data) | 28 days of enterprise Copilot metrics (completions, chat, PR summaries) |
| `enterprise_seats_response_sample.json` | [copilot-metrics-viewer](https://github.com/github-copilot-resources/copilot-metrics-viewer/tree/main/public/mock-data) | Seat assignment data with user details |

The sample data is loaded asynchronously via `fetch()` from the `/mock-data/` public directory. A `normalizeMetricsDay()` transform ensures all optional nested arrays (`editors`, `models`, `languages`, `repositories`) are initialized, preventing null reference errors. If the JSON files fail to load, the system falls back to a procedural mock data generator (`generateMockMetrics()`) that creates 28 days of seeded random data.

### Live Mode (GitHub API)

When a Personal Access Token (PAT) is configured in Settings, the dashboard fetches real data from the GitHub REST API.

**Endpoints used:**

| Endpoint | Scope | Data |
|----------|-------|------|
| `GET /orgs/{org}/copilot/metrics` | Organization | Daily metrics (completions, chat, PRs) |
| `GET /orgs/{org}/team/{team}/copilot/metrics` | Team | Team-filtered metrics |
| `GET /enterprises/{ent}/copilot/metrics` | Enterprise | Enterprise-wide metrics |
| `GET /orgs/{org}/copilot/billing/seats` | Organization | Individual seat assignments |

**Required PAT scopes:**
- `manage_billing:copilot` — Read Copilot billing/seat info
- `read:org` — Read organization data
- `read:enterprise` — Read enterprise data (for enterprise-level views)

The API client (`src/api/client.ts`) sends requests with:
- `Accept: application/vnd.github+json`
- `Authorization: Bearer {token}`
- `X-GitHub-Api-Version: 2022-11-28`
- Automatic pagination for seat data (`per_page=100`)

> **Note:** The legacy Copilot Metrics API is being shut down on **April 2, 2026**. See the [GitHub blog announcement](https://github.blog/changelog/2026-01-29-closing-down-notice-of-legacy-copilot-metrics-apis/) for migration details.

## Features

### 🎨 Dark/Light Neon Theme
- Dark mode (default) with neon accent borders — cyan, magenta, lime, orange, purple, blue
- Light mode with subtle neon accents
- Smooth CSS transitions, persisted in localStorage
- Custom scrollbar styling per theme

### 📌 Pinnable Dashboard Panels
- 8 dashboard panels, each individually pinnable
- Pinned panels appear on the Home page in a responsive grid
- Default pins: Adoption, Completions, Languages, Chat
- Pin state persisted via Zustand + localStorage

### 🔍 Global Slicer Filters
- **Date range**: 7d / 14d / 28d presets
- **Language filter**: Multi-select (TypeScript, Python, Go, etc.)
- **Editor filter**: Multi-select (VS Code, Neovim, JetBrains, etc.)
- **Model filter**: Multi-select (default, custom models)
- Filters apply globally across all panels and pages

### 📊 6 Reusable Chart Types
AreaChart, BarChart (stacked/grouped/horizontal), DonutChart, LineChart, ComboChart (dual-axis), GaugeChart — all with dark/light theming and neon colors

### 📥 Export System
- **PDF**: Full dashboard or individual panels via html2canvas → jsPDF
- **HTML**: Standalone HTML snapshot with inlined styles
- **CSV**: Raw data tables via PapaParse
- Global export button in header + per-panel export dropdown

### ℹ️ Info Tooltips
- Every panel has an info icon with a popover explaining the metric, calculation method, and link to GitHub docs

### 🏢 Org/Enterprise Switcher
- Header dropdown to switch between saved organizations
- Team slug filter for team-level drill-down
- Supports both `org` and `enterprise` scopes

## Getting Started

### Prerequisites
- Node.js 18+ (tested with v24)
- npm 9+

### Install & Run

```bash
# Clone the repository
git clone <repo-url>
cd copilot-metrics-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173/

# Build for production
npm run build

# Preview production build
npm run preview
```

### Connect to GitHub API

1. Navigate to **Settings** (sidebar → Settings)
2. Enter your GitHub Personal Access Token
3. Toggle off "Demo Mode"
4. Add your organization or enterprise name
5. Data will load from the live GitHub API

## Project Structure

```
copilot-metrics-dashboard/
├── public/
│   ├── mock-data/                    # Official GitHub sample data (JSON)
│   │   ├── enterprise_metrics_response_sample.json
│   │   └── enterprise_seats_response_sample.json
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/                          # Data layer
│   │   ├── types.ts                  # TypeScript interfaces (CopilotMetricsDay, CopilotSeat, etc.)
│   │   ├── client.ts                 # GitHub REST API client (fetch, pagination, error handling)
│   │   ├── mockData.ts               # Demo data — loads sample JSON or generates random data
│   │   └── index.ts                  # Barrel exports
│   ├── components/
│   │   ├── charts/                   # Recharts wrappers (6 chart types)
│   │   │   ├── AreaChart.tsx          # Gradient-filled area chart (time series)
│   │   │   ├── BarChart.tsx           # Stacked, grouped, or horizontal bars
│   │   │   ├── ComboChart.tsx         # Bars + lines with dual Y-axes
│   │   │   ├── DonutChart.tsx         # Pie with inner hole and center label
│   │   │   ├── GaugeChart.tsx         # Semi-circle percentage gauge
│   │   │   ├── LineChart.tsx          # Multi-line trends
│   │   │   ├── chartUtils.ts         # Theme hook, neon palette, tooltip/axis helpers
│   │   │   └── index.ts
│   │   ├── export/                   # Export functionality
│   │   │   ├── ExportModal.tsx        # Full-dashboard export dialog (PDF/HTML/CSV)
│   │   │   ├── PanelExportButton.tsx  # Per-panel export dropdown
│   │   │   └── index.ts
│   │   ├── filters/                  # Global slicer components
│   │   │   ├── FilterBar.tsx          # Date presets + multi-selects
│   │   │   └── MultiSelect.tsx        # Reusable dropdown checkbox selector
│   │   ├── layout/                   # App shell
│   │   │   ├── Layout.tsx             # Root layout with Sidebar + Header + Outlet
│   │   │   ├── Sidebar.tsx            # Fixed sidebar with 6 nav links
│   │   │   └── Header.tsx             # Top bar with org switcher, export, theme toggle
│   │   ├── panels/                   # Dashboard panel components (8 panels)
│   │   │   ├── AdoptionPanel.tsx       # Active/engaged users + area chart
│   │   │   ├── CompletionsPanel.tsx    # Suggestions/acceptances + combo chart
│   │   │   ├── LanguagesPanel.tsx      # Language breakdown donut
│   │   │   ├── EditorsPanel.tsx        # Editor distribution horizontal bar
│   │   │   ├── ChatPanel.tsx           # IDE + Dotcom chat stacked bar
│   │   │   ├── PRSummariesPanel.tsx    # PR summaries by repo
│   │   │   ├── SeatsPanel.tsx          # Seat utilization gauge
│   │   │   ├── TrendsPanel.tsx         # Multi-metric trend lines
│   │   │   └── index.ts               # PANEL_REGISTRY mapping
│   │   └── ui/                       # Shared UI primitives
│   │       ├── Badge.tsx              # Neon-colored badges
│   │       ├── InfoIcon.tsx           # Info popover with docs links
│   │       ├── KpiCard.tsx            # Metric card with trend indicator
│   │       ├── PanelCard.tsx          # Panel wrapper (pin, info, export)
│   │       ├── Spinner.tsx            # Loading spinner
│   │       └── ThemeToggle.tsx        # Sun/Moon theme switch
│   ├── hooks/
│   │   ├── useMetrics.ts             # Fetches/filters metrics (live or demo)
│   │   └── useSeats.ts               # Fetches seat data (live or demo)
│   ├── pages/                        # Route components
│   │   ├── Home.tsx                   # Pinned panels dashboard grid
│   │   ├── Completions.tsx            # Code completions deep-dive
│   │   ├── Chat.tsx                   # IDE + Dotcom chat analytics
│   │   ├── PRSummaries.tsx            # PR summary analytics
│   │   ├── Seats.tsx                  # User seat table + utilization
│   │   └── Settings.tsx               # Token, org config, demo mode toggle
│   ├── store/                        # Zustand state stores
│   │   ├── authStore.ts               # Token, baseUrl, demoMode (persisted)
│   │   ├── orgStore.ts                # Current org, saved orgs, team slug (persisted)
│   │   ├── filterStore.ts             # Date range, language/editor/model filters
│   │   ├── pinStore.ts                # Pinned panel IDs + reorder (persisted)
│   │   ├── themeStore.ts              # Dark/light theme toggle (persisted)
│   │   └── index.ts
│   ├── utils/                        # Utility functions
│   │   ├── dataTransform.ts           # Metric aggregation (by language, editor, day)
│   │   ├── export.ts                  # PDF/HTML/CSV export via html2canvas/jsPDF/PapaParse
│   │   ├── exportPdf.ts               # PDF export by element ID
│   │   ├── exportHtml.ts              # Standalone HTML snapshot
│   │   ├── exportCsv.ts               # CSV export helpers
│   │   ├── colors.ts                  # Neon color constants
│   │   ├── panelInfo.ts               # Panel metadata (descriptions, doc URLs)
│   │   └── index.ts
│   ├── theme/                        # Theme configuration
│   ├── App.tsx                       # Router setup (6 routes)
│   ├── main.tsx                      # React root mount
│   └── index.css                     # Tailwind + neon CSS variables + custom styles
├── package.json
├── vite.config.ts                    # Vite + React + Tailwind plugins
├── tsconfig.json
├── tsconfig.app.json
└── eslint.config.js
```

## API Integration

### How Data Flows

```
User opens page
      │
      ▼
useMetrics() / useSeats() hook
      │
      ├── demoMode === true?
      │         │
      │         ▼
      │   loadSampleMetrics()
      │         │
      │         ├── fetch('/mock-data/enterprise_metrics_response_sample.json')
      │         │         │
      │         │         ├── Success → normalizeMetricsDay() → cache → return
      │         │         └── Failure → generateMockMetrics() → cache → return
      │         │
      │         └── Results cached in memory (singleton)
      │
      └── demoMode === false?
                │
                ▼
          fetchMetrics(config, orgContext, dateRange)
                │
                ▼
          GitHub REST API
          GET /orgs/{org}/copilot/metrics?since=...&until=...&per_page=100
```

### TypeScript Data Model

The core type is `CopilotMetricsDay` — one entry per day, containing:

```typescript
interface CopilotMetricsDay {
  date: string;                                    // "2024-06-24"
  total_active_users: number;                      // Users who triggered Copilot
  total_engaged_users: number;                     // Users who accepted suggestions
  copilot_ide_code_completions: {                  // Code completion metrics
    editors: [{                                    // Per-editor breakdown
      name: string;                                // "vscode", "neovim", etc.
      models: [{                                   // Per-model breakdown
        name: string;                              // "default" or custom model
        languages: [{                              // Per-language breakdown
          name: string;                            // "typescript", "python", etc.
          total_code_suggestions: number;
          total_code_acceptances: number;
          total_code_lines_suggested: number;
          total_code_lines_accepted: number;
        }]
      }]
    }]
  } | null;
  copilot_ide_chat: { ... } | null;                // IDE chat metrics
  copilot_dotcom_chat: { ... } | null;             // GitHub.com chat metrics
  copilot_dotcom_pull_requests: { ... } | null;    // PR summary metrics
}
```

### Data Normalization

The `normalizeMetricsDay()` function handles inconsistencies in the raw API/sample data by ensuring all nested arrays exist:

```typescript
function normalizeMetricsDay(raw: Record<string, unknown>): CopilotMetricsDay {
  const r = raw as unknown as CopilotMetricsDay;
  // Ensure editors/models/languages arrays are never undefined
  r.copilot_ide_code_completions?.editors?.forEach(ed => {
    ed.models ??= [];
    ed.models.forEach(m => { m.languages ??= []; });
  });
  // ... similar for chat, dotcom_chat, pull_requests
  return r;
}
```

## State Management

Five Zustand stores, all with `persist` middleware (localStorage):

| Store | Key State | Persisted? |
|-------|-----------|-----------|
| `authStore` | `token`, `baseUrl`, `demoMode` | ✅ `copilot-dashboard-auth` |
| `orgStore` | `current` org, `savedOrgs[]`, `teamSlug` | ✅ `copilot-dashboard-orgs` |
| `filterStore` | `dateRange`, `languages[]`, `editors[]`, `models[]` | ❌ Session only |
| `pinStore` | `pinnedPanels[]` (PanelId[]) | ✅ `copilot-dashboard-pins` |
| `themeStore` | `theme` ('dark' \| 'light') | ✅ `copilot-dashboard-theme` |

## Chart Components

Six reusable Recharts wrappers in `src/components/charts/`:

| Component | Use Case | Key Props |
|-----------|----------|-----------|
| `AreaChart` | Adoption trends, time series | `data`, `dataKeys`, `colors`, `showLegend` |
| `BarChart` | Completions, editors, PRs | `data`, `dataKeys`, `stacked`, `horizontal` |
| `ComboChart` | Suggestions + acceptance rate | `barKeys`, `lineKeys`, dual Y-axes |
| `DonutChart` | Language breakdown | `data` (name/value pairs), center total |
| `GaugeChart` | Seat utilization % | `value` (0-100), `label`, `color` |
| `LineChart` | Multi-metric trends | `data`, `dataKeys`, `showDots` |

All charts:
- Wrap content in `<ResponsiveContainer>` for fluid sizing
- Use `useChartTheme()` for dark/light axis, grid, and tooltip styling
- Apply neon accent colors from `NEON_PALETTE`
- Animate with 800ms duration

## Dashboard Panels

Eight panels in `src/components/panels/`, registered in `PANEL_REGISTRY`:

| Panel | Metrics | Chart |
|-------|---------|-------|
| **Adoption** | Active users, engaged users, adoption rate | AreaChart |
| **Completions** | Suggestions, acceptances, acceptance rate | ComboChart |
| **Languages** | Usage by programming language (top 8) | DonutChart |
| **Editors** | Usage by IDE/editor | BarChart (horizontal) |
| **Chat** | IDE chat vs Dotcom chat volume | BarChart (stacked) |
| **PR Summaries** | PR summaries created by repository | BarChart |
| **Seats** | Total/active/inactive seats, utilization | GaugeChart |
| **Trends** | All key metrics over time | LineChart |

Each panel is wrapped in `PanelCard` which provides: pin/unpin toggle, info icon popover, per-panel export button.

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Pinned panels in a responsive 2-column grid |
| `/completions` | Completions | KPI cards + combo chart + language donut + editor bars + model comparison |
| `/chat` | Chat | KPI cards + stacked daily bar + by-editor bar + engagement line chart |
| `/pr-summaries` | PR Summaries | KPI cards + daily area trend + by-repo bar + by-model donut |
| `/seats` | Seats | KPI cards + utilization gauge + searchable/sortable user table |
| `/settings` | Settings | PAT input, base URL, demo mode toggle, org management |

## Export System

Three export formats available from the header button or per-panel dropdown:

| Format | Library | How It Works |
|--------|---------|-------------|
| **PDF** | jsPDF + html2canvas | Captures DOM element as canvas → fits to A4 page with title header |
| **HTML** | Native DOM | Clones element, inlines all computed styles, wraps in standalone HTML |
| **CSV** | PapaParse | Converts data array to CSV via `Papa.unparse()`, triggers download |

Files are named `{name}-{YYYY-MM-DD}.{ext}`.

## Theming

### CSS Custom Properties (Tailwind v4)

Defined in `src/index.css` using `@theme {}`:

```css
@theme {
  --color-neon-cyan: #00fff7;
  --color-neon-magenta: #ff00ff;
  --color-neon-lime: #39ff14;
  --color-neon-orange: #ff6600;
  --color-neon-purple: #bf00ff;
  --color-neon-blue: #0080ff;

  --color-dark-bg: #0a0a0f;
  --color-dark-surface: #12121a;
  --color-dark-card: #1a1a2e;
  --color-dark-border: #2a2a3e;

  --color-light-bg: #f8f9fc;
  --color-light-surface: #ffffff;
  --color-light-card: #ffffff;
  --color-light-border: #e2e4ea;
}
```

### Neon Glow Effects

```css
.neon-border-cyan {
  border: 1px solid var(--color-neon-cyan);
  box-shadow: 0 0 5px rgba(0, 255, 247, 0.15), inset 0 0 5px rgba(0, 255, 247, 0.05);
}
```

Light mode uses subtler glow effects. All transitions are animated at 200ms.

## Configuration

### Environment

No `.env` file is required. All configuration is done through the Settings page UI and persisted in localStorage:

| Setting | Storage Key | Default |
|---------|-----------|---------|
| GitHub PAT | `copilot-dashboard-auth` | `""` (empty = demo mode) |
| API Base URL | `copilot-dashboard-auth` | `https://api.github.com` |
| Demo Mode | `copilot-dashboard-auth` | `true` |
| Theme | `copilot-dashboard-theme` | `dark` |
| Pinned Panels | `copilot-dashboard-pins` | `[adoption, completions, languages, chat]` |
| Saved Orgs | `copilot-dashboard-orgs` | `[]` |

### Build Scripts

```bash
npm run dev      # Vite dev server with HMR
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview production build locally
npm run lint     # ESLint check
```

---

Built with ❤️ using React, TypeScript, Recharts, and Tailwind CSS. Sample data courtesy of [github-copilot-resources/copilot-metrics-viewer](https://github.com/github-copilot-resources/copilot-metrics-viewer).
