import { useMemo } from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import { PanelCard } from '../ui/PanelCard';
import { KpiCard } from '../ui/KpiCard';
import { Spinner } from '../ui/Spinner';
import { GaugeChart, NEON_COLORS } from '../charts';
import { useSeats } from '../../hooks/useSeats';

const INACTIVE_THRESHOLD_DAYS = 7;

export function SeatsPanel() {
  const { data, totalSeats, loading, error } = useSeats();

  const { activeCount, inactiveCount, utilizationPct } = useMemo(() => {
    if (!data || data.length === 0) return { activeCount: 0, inactiveCount: 0, utilizationPct: 0 };
    const now = Date.now();
    const threshold = INACTIVE_THRESHOLD_DAYS * 86_400_000;
    let active = 0;
    let inactive = 0;
    data.forEach((seat) => {
      if (seat.last_activity_at && now - new Date(seat.last_activity_at).getTime() < threshold) {
        active++;
      } else {
        inactive++;
      }
    });
    const total = totalSeats || data.length;
    return { activeCount: active, inactiveCount: inactive, utilizationPct: total > 0 ? Math.round((active / total) * 100) : 0 };
  }, [data, totalSeats]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-neon-magenta text-sm p-4">Error: {error}</div>;
  if (!data || data.length === 0) return <div className="text-gray-500 text-sm p-4">No seat data available</div>;

  return (
    <PanelCard
      id="seats"
      title="Seat Utilization"
      neonColor="cyan"
      infoTitle="Seat Utilization"
      infoDescription="Overview of Copilot seat allocation and activity."
      infoDocsUrl="https://docs.github.com/en/rest/copilot/copilot-user-management"
    >
      <div className="grid grid-cols-3 gap-3 mb-4">
        <KpiCard label="Total Seats" value={totalSeats} icon={<Users size={18} />} neonColor="neon-cyan" />
        <KpiCard label="Active (7d)" value={activeCount} icon={<UserCheck size={18} />} neonColor="neon-lime" />
        <KpiCard label="Inactive" value={inactiveCount} icon={<UserX size={18} />} neonColor="neon-orange" />
      </div>
      <div className="flex justify-center">
        <GaugeChart value={utilizationPct} label="Utilization" color={NEON_COLORS.cyan} size={200} />
      </div>
    </PanelCard>
  );
}
