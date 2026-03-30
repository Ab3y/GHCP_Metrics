import { useMemo } from 'react';
import { PanelCard } from '../ui/PanelCard';
import { Spinner } from '../ui/Spinner';
import { BarChart, NEON_COLORS } from '../charts';
import { useMetrics } from '../../hooks/useMetrics';
import { useFilterStore } from '../../store/filterStore';
import { useThemeStore } from '../../store/themeStore';
import { applyFilters, getEditorBreakdown } from '../../utils';

export function EditorsPanel() {
  const { data, loading, error } = useMetrics();
  const { languages, editors, models } = useFilterStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const { filtered, chartData, breakdown } = useMemo(() => {
    if (!data || data.length === 0) {
      return { filtered: [], chartData: [] as Record<string, unknown>[], breakdown: [] };
    }
    const f = applyFilters(data, { languages, editors, models });
    const bd = getEditorBreakdown(f);
    const cd = bd.map((e) => ({
      name: e.name,
      Suggestions: e.suggestions,
      Acceptances: e.acceptances,
    }));
    return { filtered: f, chartData: cd, breakdown: bd };
  }, [data, languages, editors, models]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-neon-magenta text-sm p-4">Error: {error}</div>;
  if (filtered.length === 0) return <div className="text-gray-500 text-sm p-4">No data available</div>;

  return (
    <PanelCard
      id="editors"
      title="Editor Distribution"
      neonColor="orange"
      infoTitle="Editor Distribution"
      infoDescription="Copilot code completion usage by IDE/editor."
      infoDocsUrl="https://docs.github.com/en/rest/copilot/copilot-metrics"
    >
      <BarChart
        data={chartData}
        dataKeys={['Suggestions', 'Acceptances']}
        colors={[NEON_COLORS.orange, NEON_COLORS.cyan]}
        horizontal
        showLegend
        height={Math.max(200, breakdown.length * 60)}
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={isDark ? 'text-gray-400 border-b border-dark-border' : 'text-gray-500 border-b border-light-border'}>
              <th className="text-left py-2 font-medium">Editor</th>
              <th className="text-right py-2 font-medium">Users</th>
              <th className="text-right py-2 font-medium">Suggestions</th>
              <th className="text-right py-2 font-medium">Acceptances</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((editor) => (
              <tr key={editor.name} className={isDark ? 'border-b border-dark-border text-gray-300' : 'border-b border-light-border text-gray-700'}>
                <td className="py-2">{editor.name}</td>
                <td className="text-right py-2">{editor.users}</td>
                <td className="text-right py-2">{editor.suggestions.toLocaleString()}</td>
                <td className="text-right py-2">{editor.acceptances.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelCard>
  );
}
