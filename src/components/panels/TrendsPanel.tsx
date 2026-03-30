import { useState, useMemo } from 'react';
import { PanelCard } from '../ui/PanelCard';
import { Spinner } from '../ui/Spinner';
import { LineChart, NEON_COLORS } from '../charts';
import { useMetrics } from '../../hooks/useMetrics';
import { useFilterStore } from '../../store/filterStore';
import { useThemeStore } from '../../store/themeStore';
import { applyFilters, getDayCompletionTotals, getDayChatTotals } from '../../utils';

const METRIC_DEFS = [
  { key: 'Active Users', color: NEON_COLORS.cyan },
  { key: 'Suggestions', color: NEON_COLORS.magenta },
  { key: 'Acceptances', color: NEON_COLORS.lime },
  { key: 'Chats', color: NEON_COLORS.purple },
  { key: 'PR Summaries', color: NEON_COLORS.blue },
] as const;

export function TrendsPanel() {
  const { data, loading, error } = useMetrics();
  const { languages, editors, models } = useFilterStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [enabled, setEnabled] = useState<Set<string>>(new Set(METRIC_DEFS.map((m) => m.key)));

  const { filtered, chartData } = useMemo(() => {
    if (!data || data.length === 0) return { filtered: [], chartData: [] };
    const f = applyFilters(data, { languages, editors, models });
    const cd = f.map((day) => {
      const completions = getDayCompletionTotals(day);
      const chat = getDayChatTotals(day);
      let prSummaries = 0;
      day.copilot_dotcom_pull_requests?.repositories?.forEach((repo) => {
        repo.models.forEach((m) => { prSummaries += m.total_pr_summaries_created; });
      });
      return {
        date: day.date.slice(5),
        'Active Users': day.total_active_users,
        Suggestions: Math.round(completions.suggestions / 10),
        Acceptances: Math.round(completions.acceptances / 10),
        Chats: chat.ideChats + chat.dotcomChats,
        'PR Summaries': prSummaries,
      };
    });
    return { filtered: f, chartData: cd };
  }, [data, languages, editors, models]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-neon-magenta text-sm p-4">Error: {error}</div>;
  if (filtered.length === 0) return <div className="text-gray-500 text-sm p-4">No data available</div>;

  const toggleMetric = (key: string) => {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const activeKeys = METRIC_DEFS.filter((m) => enabled.has(m.key)).map((m) => m.key);
  const activeColors = METRIC_DEFS.filter((m) => enabled.has(m.key)).map((m) => m.color);

  return (
    <PanelCard
      id="trends"
      title="Trends Over Time"
      neonColor="magenta"
      infoTitle="Trends Over Time"
      infoDescription="All key Copilot metrics trending over the selected period. Suggestions/Acceptances scaled ÷10."
      infoDocsUrl="https://docs.github.com/en/rest/copilot/copilot-metrics"
    >
      <div className="flex flex-wrap gap-2 mb-4">
        {METRIC_DEFS.map((m) => (
          <button
            key={m.key}
            onClick={() => toggleMetric(m.key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
              enabled.has(m.key) ? 'border-current' : isDark ? 'border-dark-border text-gray-500' : 'border-light-border text-gray-400'
            }`}
            style={enabled.has(m.key) ? { color: m.color, borderColor: m.color } : undefined}
          >
            {m.key}
          </button>
        ))}
      </div>
      <LineChart data={chartData} dataKeys={activeKeys} colors={activeColors} showLegend height={300} />
    </PanelCard>
  );
}
