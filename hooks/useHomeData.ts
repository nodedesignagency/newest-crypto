import { useCallback, useEffect, useState } from 'react';
import { fetchHomeData } from '../services/marketData';
import { HomeData } from '../services/types';

type State = {
  data: HomeData | null;
  loading: boolean;
  error: Error | null;
  refreshing: boolean;
};

/**
 * Loads the home screen's market data. Pull-to-refresh bypasses the client's
 * 60s cache; opening the screen does not, so remounting is free.
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
      const data = await fetchHomeData({ fresh: isRefresh });
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
