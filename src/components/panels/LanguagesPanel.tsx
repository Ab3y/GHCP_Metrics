import { useMemo } from 'react';
import { PanelCard } from '../ui/PanelCard';
import { Spinner } from '../ui/Spinner';
import { DonutChart, NEON_PALETTE } from '../charts';
import type { DonutDatum } from '../charts';
import { useMetrics } from '../../hooks/useMetrics';
import { useFilterStore } from '../../store/filterStore';
import { useThemeStore } from '../../store/themeStore';
import { applyFilters, getLanguageBreakdown } from '../../utils';

export function LanguagesPanel() {
  const { data, loading, error } = useMetrics();
  const { languages, editors, models } = useFilterStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const { filtered, donutData, breakdown } = useMemo(() => {
    if (!data || data.length === 0) {
      return { filtered: [], donutData: [] as DonutDatum[], breakdown: [] };
    }
    const f = applyFilters(data, { languages, editors, models });
    const bd = getLanguageBreakdown(f);
    const top8 = bd.slice(0, 8);
    const otherTotal = bd.slice(8).reduce((s, l) => s + l.acceptances, 0);
    const dd: DonutDatum[] = top8.map((lang) => ({ name: lang.name, value: lang.acceptances }));
    if (otherTotal > 0) dd.push({ name: 'Other', value: otherTotal });
    return { filtered: f, donutData: dd, breakdown: bd };
  }, [data, languages, editors, models]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-neon-magenta text-sm p-4">Error: {error}</div>;
  if (filtered.length === 0) return <div className="text-gray-500 text-sm p-4">No data available</div>;

  return (
    <PanelCard
      id="languages"
      title="Language Breakdown"
      neonColor="lime"
      infoTitle="Language Breakdown"
      infoDescription="Copilot code completion usage broken down by programming language."
      infoDocsUrl="https://docs.github.com/en/rest/copilot/copilot-metrics"
    >
      <DonutChart data={donutData} colors={NEON_PALETTE} height={280} innerRadius={65} showLegend centerLabel="Acceptances" />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={isDark ? 'text-gray-400 border-b border-dark-border' : 'text-gray-500 border-b border-light-border'}>
              <th className="text-left py-2 font-medium">Language</th>
              <th className="text-right py-2 font-medium">Suggestions</th>
              <th className="text-right py-2 font-medium">Acceptances</th>
              <th className="text-right py-2 font-medium">Rate</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.slice(0, 12).map((lang) => (
              <tr key={lang.name} className={isDark ? 'border-b border-dark-border text-gray-300' : 'border-b border-light-border text-gray-700'}>
                <td className="py-2">{lang.name}</td>
                <td className="text-right py-2">{lang.suggestions.toLocaleString()}</td>
                <td className="text-right py-2">{lang.acceptances.toLocaleString()}</td>
                <td className="text-right py-2">{lang.acceptanceRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelCard>
  );
}
