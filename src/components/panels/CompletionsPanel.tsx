import { useMemo } from 'react';
import { Code, CheckCircle, Percent } from 'lucide-react';
import { PanelCard } from '../ui/PanelCard';
import { KpiCard } from '../ui/KpiCard';
import { Spinner } from '../ui/Spinner';
import { ComboChart, NEON_COLORS } from '../charts';
import { useMetrics } from '../../hooks/useMetrics';
import { useFilterStore } from '../../store/filterStore';
import { applyFilters, getDayCompletionTotals } from '../../utils';

export function CompletionsPanel() {
  const { data, loading, error } = useMetrics();
  const { languages, editors, models } = useFilterStore();

  const { filtered, chartData, totalSuggestions, totalAcceptances, acceptanceRate } =
    useMemo(() => {
      if (!data || data.length === 0) {
        return { filtered: [], chartData: [], totalSuggestions: 0, totalAcceptances: 0, acceptanceRate: 0 };
      }
      const f = applyFilters(data, { languages, editors, models });
      let ts = 0;
      let ta = 0;
      const cd = f.map((day) => {
        const totals = getDayCompletionTotals(day);
        ts += totals.suggestions;
        ta += totals.acceptances;
        return {
          date: day.date.slice(5),
          Suggestions: totals.suggestions,
          Acceptances: totals.acceptances,
          'Acceptance %': totals.suggestions ? Math.round((totals.acceptances / totals.suggestions) * 100) : 0,
        };
      });
      return {
        filtered: f,
        chartData: cd,
        totalSuggestions: ts,
        totalAcceptances: ta,
        acceptanceRate: ts ? Math.round((ta / ts) * 100) : 0,
      };
    }, [data, languages, editors, models]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-neon-magenta text-sm p-4">Error: {error}</div>;
  if (filtered.length === 0) return <div className="text-gray-500 text-sm p-4">No data available</div>;

  return (
    <PanelCard
      id="completions"
      title="Code Completions"
      neonColor="magenta"
      infoTitle="Code Completions"
      infoDescription="Code suggestions generated and accepted by Copilot across all editors."
      infoDocsUrl="https://docs.github.com/en/rest/copilot/copilot-metrics"
    >
      <div className="grid grid-cols-3 gap-3 mb-4">
        <KpiCard label="Total Suggestions" value={totalSuggestions.toLocaleString()} icon={<Code size={18} />} neonColor="neon-magenta" />
        <KpiCard label="Total Acceptances" value={totalAcceptances.toLocaleString()} icon={<CheckCircle size={18} />} neonColor="neon-magenta" />
        <KpiCard label="Acceptance Rate" value={`${acceptanceRate}%`} icon={<Percent size={18} />} neonColor="neon-magenta" />
      </div>
      <ComboChart
        data={chartData}
        barKeys={['Suggestions', 'Acceptances']}
        lineKeys={['Acceptance %']}
        barColors={[NEON_COLORS.magenta, NEON_COLORS.cyan]}
        lineColors={[NEON_COLORS.lime]}
        height={260}
      />
    </PanelCard>
  );
}
