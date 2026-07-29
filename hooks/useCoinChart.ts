import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchChart } from '../services/marketData';
import { ChartRange } from '../services/types';

type State = {
  points: number[] | null;
  loading: boolean;
  error: Error | null;
};

/**
 * Price history for one coin and timeframe.
 *
 * Keeps the previous series visible while a new range loads, so switching
 * timeframes morphs the line instead of blanking the chart. Late responses from
 * an abandoned request are discarded — swiping quickly between coins can leave
 * several in flight, and the last one to arrive is not necessarily the one asked
 * for most recently.
 */
export function useCoinChart(coinId: string | null, range: ChartRange) {
  const [state, setState] = useState<State>({ points: null, loading: false, error: null });
  const requestId = useRef(0);

  const load = useCallback(async () => {
    if (!coinId) return;

    const id = ++requestId.current;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const points = await fetchChart(coinId, range);
      if (id === requestId.current) setState({ points, loading: false, error: null });
    } catch (err) {
      if (id !== requestId.current) return;
      setState({
        points: null,
        loading: false,
        error: err instanceof Error ? err : new Error('Could not load the chart.'),
      });
    }
  }, [coinId, range]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, retry: load };
}
