import { useMemo } from 'react';
import { Users, UserCheck } from 'lucide-react';
import { PanelCard } from '../ui/PanelCard';
import { KpiCard } from '../ui/KpiCard';
import { Spinner } from '../ui/Spinner';
import { AreaChart, NEON_COLORS } from '../charts';
import { useMetrics } from '../../hooks/useMetrics';
import { useFilterStore } from '../../store/filterStore';
import { applyFilters } from '../../utils';

export function AdoptionPanel() {
  const { data, loading, error } = useMetrics();
  const { languages, editors, models } = useFilterStore();

  const { filtered, chartData, totalActive, totalEngaged, adoptionRate, activeChange, engagedChange } =
    useMemo(() => {
      if (!data || data.length === 0) {
        return { filtered: [], chartData: [], totalActive: 0, totalEngaged: 0, adoptionRate: 0, activeChange: undefined, engagedChange: undefined };
      }
      const f = applyFilters(data, { languages, editors, models });
      const cd = f.map((d) => ({
        date: d.date.slice(5),
        'Active Users': d.total_active_users,
        'Engaged Users': d.total_engaged_users,
      }));
      const ta = f.reduce((s, d) => s + d.total_active_users, 0);
      const te = f.reduce((s, d) => s + d.total_engaged_users, 0);
      const rate = ta > 0 ? Math.round((te / ta) * 100) : 0;

      const latest = f[f.length - 1];
      const prev = f.length > 1 ? f[f.length - 2] : null;
      const ac = prev
        ? Math.round(((latest.total_active_users - prev.total_active_users) / (prev.total_active_users || 1)) * 100)
        : undefined;
      const ec = prev
        ? Math.round(((latest.total_engaged_users - prev.total_engaged_users) / (prev.total_engaged_users || 1)) * 100)
        : undefined;

      return { filtered: f, chartData: cd, totalActive: ta, totalEngaged: te, adoptionRate: rate, activeChange: ac, engagedChange: ec };
    }, [data, languages, editors, models]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-neon-magenta text-sm p-4">Error: {error}</div>;
  if (filtered.length === 0) return <div className="text-gray-500 text-sm p-4">No data available</div>;

  return (
    <PanelCard
      id="adoption"
      title="Adoption Overview"
      neonColor="cyan"
      infoTitle="Adoption Overview"
      infoDescription="Active and engaged Copilot users over time. Engaged users have actively used Copilot features."
      infoDocsUrl="https://docs.github.com/en/rest/copilot/copilot-metrics"
    >
      <div className="grid grid-cols-3 gap-3 mb-4">
        <KpiCard label="Active Users" value={totalActive.toLocaleString()} change={activeChange} icon={<Users size={18} />} neonColor="neon-cyan" />
        <KpiCard label="Engaged Users" value={totalEngaged.toLocaleString()} change={engagedChange} icon={<UserCheck size={18} />} neonColor="neon-cyan" />
        <KpiCard label="Adoption Rate" value={`${adoptionRate}%`} neonColor="neon-cyan" />
      </div>
      <AreaChart
        data={chartData}
        dataKeys={['Active Users', 'Engaged Users']}
        colors={[NEON_COLORS.cyan, NEON_COLORS.lime]}
        showLegend
        height={250}
      />
    </PanelCard>
  );
}
