import { useMemo } from 'react';
import { MessageSquare, Copy, Code, Globe } from 'lucide-react';
import { PanelCard } from '../ui/PanelCard';
import { KpiCard } from '../ui/KpiCard';
import { Spinner } from '../ui/Spinner';
import { BarChart, NEON_COLORS } from '../charts';
import { useMetrics } from '../../hooks/useMetrics';
import { useFilterStore } from '../../store/filterStore';
import { applyFilters, getDayChatTotals } from '../../utils';

export function ChatPanel() {
  const { data, loading, error } = useMetrics();
  const { languages, editors, models } = useFilterStore();

  const { filtered, chartData, totalIdeChats, totalDotcomChats, totalCopyEvents, totalInsertionEvents } =
    useMemo(() => {
      if (!data || data.length === 0) {
        return { filtered: [], chartData: [], totalIdeChats: 0, totalDotcomChats: 0, totalCopyEvents: 0, totalInsertionEvents: 0 };
      }
      const f = applyFilters(data, { languages, editors, models });
      let ide = 0, dotcom = 0, copy = 0, insert = 0;
      const cd = f.map((day) => {
        const t = getDayChatTotals(day);
        ide += t.ideChats;
        dotcom += t.dotcomChats;
        copy += t.ideCopyEvents;
        insert += t.ideInsertionEvents;
        return { date: day.date.slice(5), 'IDE Chat': t.ideChats, 'Dotcom Chat': t.dotcomChats };
      });
      return { filtered: f, chartData: cd, totalIdeChats: ide, totalDotcomChats: dotcom, totalCopyEvents: copy, totalInsertionEvents: insert };
    }, [data, languages, editors, models]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-neon-magenta text-sm p-4">Error: {error}</div>;
  if (filtered.length === 0) return <div className="text-gray-500 text-sm p-4">No data available</div>;

  return (
    <PanelCard
      id="chat"
      title="Chat Activity"
      neonColor="purple"
      infoTitle="Chat Activity"
      infoDescription="Copilot Chat usage across IDEs and GitHub.com."
      infoDocsUrl="https://docs.github.com/en/rest/copilot/copilot-metrics"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <KpiCard label="IDE Chats" value={totalIdeChats.toLocaleString()} icon={<MessageSquare size={18} />} neonColor="neon-purple" />
        <KpiCard label="Dotcom Chats" value={totalDotcomChats.toLocaleString()} icon={<Globe size={18} />} neonColor="neon-purple" />
        <KpiCard label="Copy Events" value={totalCopyEvents.toLocaleString()} icon={<Copy size={18} />} neonColor="neon-purple" />
        <KpiCard label="Insertions" value={totalInsertionEvents.toLocaleString()} icon={<Code size={18} />} neonColor="neon-purple" />
      </div>
      <BarChart
        data={chartData}
        dataKeys={['IDE Chat', 'Dotcom Chat']}
        colors={[NEON_COLORS.purple, NEON_COLORS.cyan]}
        xAxisKey="date"
        stacked
        showLegend
        height={250}
      />
    </PanelCard>
  );
}
