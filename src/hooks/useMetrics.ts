import { useState, useEffect, useCallback } from 'react';
import type { CopilotMetricsDay } from '../api/types';
import { fetchMetrics } from '../api/client';
import { loadSampleMetrics } from '../api/mockData';
import { useAuthStore } from '../store/authStore';
import { useOrgStore } from '../store/orgStore';
import { useFilterStore } from '../store/filterStore';

export function useMetrics() {
  const [data, setData] = useState<CopilotMetricsDay[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token, baseUrl, demoMode } = useAuthStore();
  const { current, teamSlug } = useOrgStore();
  const { dateRange } = useFilterStore();

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (demoMode) {
        const mockData = await loadSampleMetrics();
        const filtered = mockData.filter(
          (d) => d.date >= dateRange.since && d.date <= dateRange.until
        );
        setData(filtered);
      } else {
        if (!current) {
          setData([]);
          return;
        }
        const result = await fetchMetrics(
          { token, baseUrl },
          { type: current.type, name: current.name, teamSlug: teamSlug ?? undefined },
          { since: dateRange.since, until: dateRange.until }
        );
        setData(result);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, [demoMode, token, baseUrl, current, teamSlug, dateRange.since, dateRange.until]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}
