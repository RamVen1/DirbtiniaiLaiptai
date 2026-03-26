import { useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getItem } from '@/utils/storage';


type DailyTaskResponse = {
  task?: string | null;
  dailyTask?: string | null;
};

export function useDailyTask({ enabled = true }: { enabled?: boolean } = {}) {
  const isFocused = useIsFocused();

  const [dailyTask, setDailyTask] = useState<string | null>(null);
  const [loadingDailyTask, setLoadingDailyTask] = useState(false);
  const [dailyTaskError, setDailyTaskError] = useState<string | null>(null);

  const hasFetchedRef = useRef(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (!enabled) return;

    // Reset the "fetch once per focus" guard when leaving the screen.
    if (!isFocused) {
      hasFetchedRef.current = false;
      return;
    }

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    let cancelled = false;

    const fetchDailyTask = async () => {
      if (!API_URL) {
        setDailyTaskError('API URL is not set. Check EXPO_PUBLIC_API_URL.');
        return;
      }

      try {
        setLoadingDailyTask(true);
        setDailyTaskError(null);

        const token = await getItem('userToken');
        const response = await fetch(`${API_URL}/task`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const data = (await response.json()) as DailyTaskResponse;

        const taskFromApi = data?.task ?? data?.dailyTask ?? null;
        if (!cancelled) setDailyTask(taskFromApi);
      } catch {
        if (!cancelled)
          setDailyTaskError('Failed to load daily task. Check if your backend is running.');
      } finally {
        if (!cancelled) setLoadingDailyTask(false);
      }
    };

    fetchDailyTask();

    return () => {
      cancelled = true;
    };
  }, [API_URL, enabled, isFocused]);

  return { dailyTask, loadingDailyTask, dailyTaskError };
}
