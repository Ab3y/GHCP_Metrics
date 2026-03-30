import { useState, useEffect, useCallback } from 'react';
import type { CopilotSeat } from '../api/types';
import { fetchAllSeats } from '../api/client';
import { loadSampleSeats } from '../api/mockData';
import { useAuthStore } from '../store/authStore';
import { useOrgStore } from '../store/orgStore';

export function useSeats() {
  const [data, setData] = useState<CopilotSeat[] | null>(null);
  const [totalSeats, setTotalSeats] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token, baseUrl, demoMode } = useAuthStore();
  const { current } = useOrgStore();

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (demoMode) {
        const mock = await loadSampleSeats();
        setData(mock.seats);
        setTotalSeats(mock.total_seats);
      } else {
        if (!current || current.type !== 'org') {
          setData([]);
          setTotalSeats(0);
          return;
        }
        const seats = await fetchAllSeats({ token, baseUrl }, current.name);
        setData(seats);
        setTotalSeats(seats.length);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch seats');
    } finally {
      setLoading(false);
    }
  }, [demoMode, token, baseUrl, current]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, totalSeats, loading, error, refetch: fetch_ };
}
