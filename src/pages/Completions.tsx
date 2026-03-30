import { useMemo } from 'react';
import { Code, CheckCircle, Percent, FileText, FileCheck } from 'lucide-react';
import { KpiCard } from '../components/ui/KpiCard';
import { ComboChart, DonutChart, BarChart, NEON_COLORS } from '../components/charts';
import { useMetrics } from '../hooks/useMetrics';
import { useThemeStore } from '../store/themeStore';
import { useFilterStore } from '../store/filterStore';
import { applyFilters } from '../utils';

export function Completions() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { data, loading } = useMetrics();
  const filters = useFilterStore();
  const metrics = useMemo(
    () => (data ? applyFilters(data, filters) : []),
    [data, filters],
  );

  const kpis = useMemo(() => {
    if (!metrics.length) return { suggestions: 0, acceptances: 0, rate: 0, linesSuggested: 0, linesAccepted: 0 };
    let suggestions = 0, acceptances = 0, linesSuggested = 0, linesAccepted = 0;
    metrics.forEach(day => {
      day.copilot_ide_code_completions?.editors.forEach(editor => {
        editor.models.forEach(model => {
          model.languages.forEach(lang => {
            suggestions += lang.total_code_suggestions;
            acceptances += lang.total_code_acceptances;
            linesSuggested += lang.total_code_lines_suggested;
            linesAccepted += lang.total_code_lines_accepted;
          });
        });
      });
    });
    return {
      suggestions,
      acceptances,
      rate: suggestions ? Math.round((acceptances / suggestions) * 100) : 0,
      linesSuggested,
      linesAccepted,
    };
  }, [metrics]);

  const dailyData = useMemo(() => {
    return metrics.map(day => {
      let suggestions = 0, acceptances = 0;
      day.copilot_ide_code_completions?.editors.forEach(editor => {
        editor.models.forEach(model => {
          model.languages.forEach(lang => {
            suggestions += lang.total_code_suggestions;
            acceptances += lang.total_code_acceptances;
          });
        });
      });
      return {
        date: day.date,
        Suggestions: suggestions,
        Acceptances: acceptances,
        'Rate %': suggestions ? Math.round((acceptances / suggestions) * 100) : 0,
      };
    });
  }, [metrics]);

  const languageData = useMemo(() => {
    const map = new Map<string, number>();
    metrics.forEach(day => {
      day.copilot_ide_code_completions?.editors.forEach(editor => {
        editor.models.forEach(model => {
          model.languages.forEach(lang => {
            map.set(lang.name, (map.get(lang.name) ?? 0) + lang.total_code_acceptances);
          });
        });
      });
    });
    return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [metrics]);

  const editorData = useMemo(() => {
    const map = new Map<string, { suggestions: number; acceptances: number }>();
    metrics.forEach(day => {
      day.copilot_ide_code_completions?.editors.forEach(editor => {
        const entry = map.get(editor.name) ?? { suggestions: 0, acceptances: 0 };
        editor.models.forEach(model => {
          model.languages.forEach(lang => {
            entry.suggestions += lang.total_code_suggestions;
            entry.acceptances += lang.total_code_acceptances;
          });
        });
        map.set(editor.name, entry);
      });
    });
    return Array.from(map, ([name, v]) => ({ name, Suggestions: v.suggestions, Acceptances: v.acceptances }))
      .sort((a, b) => b.Suggestions - a.Suggestions);
  }, [metrics]);

  const modelData = useMemo(() => {
    const map = new Map<string, number>();
    metrics.forEach(day => {
      day.copilot_ide_code_completions?.editors.forEach(editor => {
        editor.models.forEach(model => {
          const label = model.is_custom_model ? model.name : 'default';
          let total = 0;
          model.languages.forEach(lang => { total += lang.total_code_suggestions; });
          map.set(label, (map.get(label) ?? 0) + total);
        });
      });
    });
    return Array.from(map, ([name, Suggestions]) => ({ name, Suggestions })).sort((a, b) => b.Suggestions - a.Suggestions);
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
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Code Completions</h1>
        <div className={`flex items-center justify-center h-64 rounded-xl border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'}`}>
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No data available</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Code Completions</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <KpiCard label="Total Suggestions" value={kpis.suggestions.toLocaleString()} icon={<Code size={18} />} neonColor="neon-cyan" />
        <KpiCard label="Total Acceptances" value={kpis.acceptances.toLocaleString()} icon={<CheckCircle size={18} />} neonColor="neon-lime" />
        <KpiCard label="Acceptance Rate" value={`${kpis.rate}%`} icon={<Percent size={18} />} neonColor="neon-magenta" />
        <KpiCard label="Lines Suggested" value={kpis.linesSuggested.toLocaleString()} icon={<FileText size={18} />} neonColor="neon-orange" />
        <KpiCard label="Lines Accepted" value={kpis.linesAccepted.toLocaleString()} icon={<FileCheck size={18} />} neonColor="neon-purple" />
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Suggestions vs Acceptances</h2>
        <ComboChart
          data={dailyData}
          barKeys={['Suggestions', 'Acceptances']}
          lineKeys={['Rate %']}
          barColors={[NEON_COLORS.cyan, NEON_COLORS.lime]}
          lineColors={[NEON_COLORS.magenta]}
          height={350}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Acceptances by Language</h2>
          <DonutChart data={languageData} height={300} />
        </div>
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>By Editor</h2>
          <BarChart data={editorData} dataKeys={['Suggestions', 'Acceptances']} colors={[NEON_COLORS.cyan, NEON_COLORS.lime]} horizontal height={300} showLegend />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Model Comparison</h2>
        <BarChart data={modelData} dataKeys={['Suggestions']} colors={[NEON_COLORS.purple]} height={250} />
      </div>
    </div>
  );
}