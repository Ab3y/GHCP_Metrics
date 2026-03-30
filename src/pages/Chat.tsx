import { useMemo } from 'react';
import { MessageSquare, Globe, Copy, ArrowDownToLine } from 'lucide-react';
import { FilterBar } from '../components/filters/FilterBar';
import { KpiCard } from '../components/ui/KpiCard';
import { BarChart, LineChart, NEON_COLORS } from '../components/charts';
import { useMetrics } from '../hooks/useMetrics';
import { useThemeStore } from '../store/themeStore';
import { useFilterStore } from '../store/filterStore';
import { applyFilters, getUniqueLanguages, getUniqueEditors, getUniqueModels } from '../utils';

export function Chat() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { data, loading } = useMetrics();
  const filters = useFilterStore();
  const metrics = useMemo(
    () => (data ? applyFilters(data, filters) : []),
    [data, filters],
  );

  const languageOptions = useMemo(() => (data ? getUniqueLanguages(data) : []), [data]);
  const editorOptions = useMemo(() => (data ? getUniqueEditors(data) : []), [data]);
  const modelOptions = useMemo(() => (data ? getUniqueModels(data) : []), [data]);

  const kpis = useMemo(() => {
    if (!metrics.length) return { ideChats: 0, dotcomChats: 0, copyEvents: 0, insertionEvents: 0 };
    let ideChats = 0, dotcomChats = 0, copyEvents = 0, insertionEvents = 0;
    metrics.forEach(day => {
      day.copilot_ide_chat?.editors.forEach(editor => {
        editor.models.forEach(model => {
          ideChats += model.total_chats;
          copyEvents += model.total_chat_copy_events;
          insertionEvents += model.total_chat_insertion_events;
        });
      });
      day.copilot_dotcom_chat?.models.forEach(model => {
        dotcomChats += model.total_chats;
      });
    });
    return { ideChats, dotcomChats, copyEvents, insertionEvents };
  }, [metrics]);

  const dailyVolume = useMemo(() => {
    return metrics.map(day => {
      let ide = 0, dotcom = 0;
      day.copilot_ide_chat?.editors.forEach(editor => {
        editor.models.forEach(model => { ide += model.total_chats; });
      });
      day.copilot_dotcom_chat?.models.forEach(model => { dotcom += model.total_chats; });
      return { date: day.date, 'IDE Chat': ide, 'Dotcom Chat': dotcom };
    });
  }, [metrics]);

  const editorData = useMemo(() => {
    const map = new Map<string, number>();
    metrics.forEach(day => {
      day.copilot_ide_chat?.editors.forEach(editor => {
        let chats = 0;
        editor.models.forEach(model => { chats += model.total_chats; });
        map.set(editor.name, (map.get(editor.name) ?? 0) + chats);
      });
    });
    return Array.from(map, ([name, Chats]) => ({ name, Chats })).sort((a, b) => b.Chats - a.Chats);
  }, [metrics]);

  const engagementData = useMemo(() => {
    return metrics.map(day => {
      let copies = 0, insertions = 0;
      day.copilot_ide_chat?.editors.forEach(editor => {
        editor.models.forEach(model => {
          copies += model.total_chat_copy_events;
          insertions += model.total_chat_insertion_events;
        });
      });
      return { date: day.date, 'Copy Events': copies, 'Insertion Events': insertions };
    });
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
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Chat Analytics</h1>
        <FilterBar languageOptions={languageOptions} editorOptions={editorOptions} modelOptions={modelOptions} />
        <div className={`flex items-center justify-center h-64 rounded-xl border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'}`}>
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No data available</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Chat Analytics</h1>
      <FilterBar languageOptions={languageOptions} editorOptions={editorOptions} modelOptions={modelOptions} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="IDE Chats" value={kpis.ideChats.toLocaleString()} icon={<MessageSquare size={18} />} neonColor="neon-cyan" />
        <KpiCard label="Dotcom Chats" value={kpis.dotcomChats.toLocaleString()} icon={<Globe size={18} />} neonColor="neon-magenta" />
        <KpiCard label="Copy Events" value={kpis.copyEvents.toLocaleString()} icon={<Copy size={18} />} neonColor="neon-lime" />
        <KpiCard label="Insertion Events" value={kpis.insertionEvents.toLocaleString()} icon={<ArrowDownToLine size={18} />} neonColor="neon-orange" />
      </div>

      <div className={`${cardClass} mb-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Daily Chat Volume</h2>
        <BarChart data={dailyVolume} dataKeys={['IDE Chat', 'Dotcom Chat']} colors={[NEON_COLORS.cyan, NEON_COLORS.magenta]} stacked showLegend xAxisKey="date" height={350} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>IDE Chat by Editor</h2>
          <BarChart data={editorData} dataKeys={['Chats']} colors={[NEON_COLORS.cyan]} height={300} />
        </div>
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Chat Engagement</h2>
          <LineChart data={engagementData} dataKeys={['Copy Events', 'Insertion Events']} colors={[NEON_COLORS.lime, NEON_COLORS.orange]} showLegend height={300} />
        </div>
      </div>
    </div>
  );
}