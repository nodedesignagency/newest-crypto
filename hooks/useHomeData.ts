import { useCallback, useEffect, useState } from 'react';
import { fetchHomeData } from '../services/mockData';
import { HomeData } from '../services/types';

type State = {
  data: HomeData | null;
  loading: boolean;
  error: Error | null;
  refreshing: boolean;
};

/**
 * Loads the home screen's market data. Backed by mock data today; the component
 * contract (data/loading/error/refresh) already matches what a real API needs.
 */
export function useHomeData() {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
    refreshing: false,
  });

  const load = useCallback(async (isRefresh: boolean) => {
    setState((prev) => ({
      ...prev,
      loading: !isRefresh && prev.data === null,
      refreshing: isRefresh,
      error: null,
    }));

    try {
      const data = await fetchHomeData(isRefresh ? 400 : 600);
      setState({ data, loading: false, error: null, refreshing: false });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: err instanceof Error ? err : new Error('Failed to load market data'),
      }));
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const refresh = useCallback(() => load(true), [load]);
  const retry = useCallback(() => load(false), [load]);

  return { ...state, refresh, retry };
}
