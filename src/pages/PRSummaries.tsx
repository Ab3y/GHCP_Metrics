import { useMemo } from 'react';
import { GitPullRequest, FolderGit2, BarChart3 } from 'lucide-react';
import { KpiCard } from '../components/ui/KpiCard';
import { BarChart, AreaChart, DonutChart, NEON_COLORS } from '../components/charts';
import { useMetrics } from '../hooks/useMetrics';
import { useThemeStore } from '../store/themeStore';
import { useFilterStore } from '../store/filterStore';
import { applyFilters } from '../utils';

export function PRSummaries() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { data, loading } = useMetrics();
  const filters = useFilterStore();
  const metrics = useMemo(
    () => (data ? applyFilters(data, filters) : []),
    [data, filters],
  );

  const kpis = useMemo(() => {
    if (!metrics.length) return { total: 0, repos: 0, avgPerRepo: 0 };
    let total = 0;
    const repoSet = new Set<string>();
    metrics.forEach(day => {
      day.copilot_dotcom_pull_requests?.repositories.forEach(repo => {
        repoSet.add(repo.name);
        repo.models.forEach(model => { total += model.total_pr_summaries_created; });
      });
    });
    const repos = repoSet.size;
    return { total, repos, avgPerRepo: repos ? Math.round(total / repos) : 0 };
  }, [metrics]);

  const repoData = useMemo(() => {
    const map = new Map<string, number>();
    metrics.forEach(day => {
      day.copilot_dotcom_pull_requests?.repositories.forEach(repo => {
        let count = 0;
        repo.models.forEach(model => { count += model.total_pr_summaries_created; });
        map.set(repo.name, (map.get(repo.name) ?? 0) + count);
      });
    });
    return Array.from(map, ([name, Summaries]) => ({ name, Summaries })).sort((a, b) => b.Summaries - a.Summaries);
  }, [metrics]);

  const dailyTrend = useMemo(() => {
    return metrics.map(day => {
      let summaries = 0;
      day.copilot_dotcom_pull_requests?.repositories.forEach(repo => {
        repo.models.forEach(model => { summaries += model.total_pr_summaries_created; });
      });
      return { date: day.date, Summaries: summaries };
    });
  }, [metrics]);

  const modelData = useMemo(() => {
    const map = new Map<string, number>();
    metrics.forEach(day => {
      day.copilot_dotcom_pull_requests?.repositories.forEach(repo => {
        repo.models.forEach(model => {
          const label = model.is_custom_model ? model.name : 'default';
          map.set(label, (map.get(label) ?? 0) + model.total_pr_summaries_created);
        });
      });
    });
    return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [metrics]);

  const cardClass = `rounded-xl border p-5 ${isDark ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan" />
      </div>
    );
  }

  if (!metrics.length) {
    return (
      <div>
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>PR Summaries</h1>
        <div className={`flex items-center justify-center h-64 rounded-xl border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'}`}>
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No data available</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>PR Summaries</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Total Summaries" value={kpis.total.toLocaleString()} icon={<GitPullRequest size={18} />} neonColor="neon-cyan" />
        <KpiCard label="Repos with Summaries" value={kpis.repos} icon={<FolderGit2 size={18} />} neonColor="neon-magenta" />
        <KpiCard label="Avg per Repo" value={kpis.avgPerRepo} icon={<BarChart3 size={18} />} neonColor="neon-lime" />
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Trend</h2>
        <AreaChart data={dailyTrend} dataKeys={['Summaries']} colors={[NEON_COLORS.cyan]} height={300} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>By Repository</h2>
          <BarChart data={repoData} dataKeys={['Summaries']} colors={[NEON_COLORS.cyan]} horizontal height={300} />
        </div>
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>By Model</h2>
          <DonutChart data={modelData} height={300} />
        </div>
      </div>
    </div>
  );
}