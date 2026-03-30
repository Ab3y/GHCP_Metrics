import { useMemo, useState } from 'react';
import { Users, UserCheck, UserX, Clock, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { FilterBar } from '../components/filters/FilterBar';
import { KpiCard } from '../components/ui/KpiCard';
import { GaugeChart, NEON_COLORS } from '../components/charts';
import { useSeats } from '../hooks/useSeats';
import { useThemeStore } from '../store/themeStore';
import type { CopilotSeat } from '../api/types';

type SortKey = 'login' | 'team' | 'plan' | 'lastActivity' | 'editor' | 'status';
type SortDir = 'asc' | 'desc';

function seatStatus(seat: CopilotSeat): 'active' | 'inactive' | 'pending_cancellation' {
  if (seat.pending_cancellation_date) return 'pending_cancellation';
  if (!seat.last_activity_at) return 'inactive';
  const diffMs = Date.now() - new Date(seat.last_activity_at).getTime();
  return diffMs < 30 * 86_400_000 ? 'active' : 'inactive';
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending_cancellation: 'Pending',
};

function StatusBadge({ status, isDark }: { status: string; isDark: boolean }) {
  const styles: Record<string, string> = {
    active: 'bg-neon-lime/15 text-neon-lime',
    inactive: isDark ? 'bg-gray-700/40 text-gray-400' : 'bg-gray-200 text-gray-500',
    pending_cancellation: 'bg-neon-orange/15 text-neon-orange',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? ''}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return '\u2014';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function Seats() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { data: seats, totalSeats, loading } = useSeats();

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('login');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const kpis = useMemo(() => {
    if (!seats?.length) return { total: 0, active: 0, inactive: 0, pending: 0 };
    let active = 0, inactive = 0, pending = 0;
    seats.forEach(s => {
      const st = seatStatus(s);
      if (st === 'active') active++;
      else if (st === 'pending_cancellation') pending++;
      else inactive++;
    });
    return { total: totalSeats || seats.length, active, inactive, pending };
  }, [seats, totalSeats]);

  const utilization = kpis.total ? Math.round((kpis.active / kpis.total) * 100) : 0;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sortedSeats = useMemo(() => {
    if (!seats?.length) return [];
    let filtered = seats;
    if (search) {
      const q = search.toLowerCase();
      filtered = seats.filter(s => s.assignee.login.toLowerCase().includes(q));
    }

    const getValue = (s: CopilotSeat, key: SortKey): string => {
      switch (key) {
        case 'login': return s.assignee.login;
        case 'team': return s.assigning_team?.name ?? '';
        case 'plan': return s.plan_type ?? '';
        case 'lastActivity': return s.last_activity_at ?? '';
        case 'editor': return s.last_activity_editor ?? '';
        case 'status': return seatStatus(s);
      }
    };

    return [...filtered].sort((a, b) => {
      const av = getValue(a, sortKey);
      const bv = getValue(b, sortKey);
      const cmp = av.localeCompare(bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [seats, search, sortKey, sortDir]);

  const cardClass = `rounded-xl border p-5 ${isDark ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'}`;
  const thClass = `text-left px-4 py-3 font-medium cursor-pointer select-none ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`;

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc' ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan" />
      </div>
    );
  }

  if (!seats?.length) {
    return (
      <div>
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Seats & Users</h1>
        <FilterBar />
        <div className={`flex items-center justify-center h-64 rounded-xl border ${isDark ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'}`}>
          <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No data available</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Seats & Users</h1>
      <FilterBar />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <KpiCard label="Total Seats" value={kpis.total} icon={<Users size={18} />} neonColor="neon-cyan" />
        <KpiCard label="Active (30d)" value={kpis.active} icon={<UserCheck size={18} />} neonColor="neon-lime" />
        <KpiCard label="Inactive" value={kpis.inactive} icon={<UserX size={18} />} neonColor="neon-magenta" />
        <KpiCard label="Pending Cancel" value={kpis.pending} icon={<Clock size={18} />} neonColor="neon-orange" />
        <div className={cardClass}>
          <GaugeChart value={utilization} label="Utilization" color={NEON_COLORS.cyan} size={140} />
        </div>
      </div>

      <div className={`${cardClass} mb-6`}>
        <div className="relative">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search by user login..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
              isDark
                ? 'bg-dark-surface border-dark-border text-white placeholder:text-gray-500'
                : 'bg-light-surface border-light-border text-gray-900 placeholder:text-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-neon-cyan/40`}
          />
        </div>
      </div>

      <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? 'bg-dark-surface' : 'bg-light-surface'}>
                <th className={thClass} onClick={() => toggleSort('login')}>User<SortIcon col="login" /></th>
                <th className={thClass} onClick={() => toggleSort('team')}>Team<SortIcon col="team" /></th>
                <th className={thClass} onClick={() => toggleSort('plan')}>Plan<SortIcon col="plan" /></th>
                <th className={thClass} onClick={() => toggleSort('lastActivity')}>Last Activity<SortIcon col="lastActivity" /></th>
                <th className={thClass} onClick={() => toggleSort('editor')}>Editor<SortIcon col="editor" /></th>
                <th className={thClass} onClick={() => toggleSort('status')}>Status<SortIcon col="status" /></th>
              </tr>
            </thead>
            <tbody>
              {sortedSeats.map(seat => {
                const status = seatStatus(seat);
                return (
                  <tr key={seat.assignee.id} className={`border-t ${isDark ? 'border-dark-border hover:bg-dark-hover' : 'border-light-border hover:bg-light-hover'} transition-colors`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-dark-hover text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                          {seat.assignee.login.charAt(0).toUpperCase()}
                        </div>
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>{seat.assignee.login}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{seat.assigning_team?.name ?? '\u2014'}</td>
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{seat.plan_type ?? '\u2014'}</td>
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(seat.last_activity_at)}</td>
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{seat.last_activity_editor ?? '\u2014'}</td>
                    <td className="px-4 py-3"><StatusBadge status={status} isDark={isDark} /></td>
                  </tr>
                );
              })}
              {sortedSeats.length === 0 && (
                <tr>
                  <td colSpan={6} className={`px-4 py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    No matching users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}