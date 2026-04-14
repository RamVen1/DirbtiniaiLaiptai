import { useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { getItem } from '@/utils/storage';
import { useElapsedSeconds } from '@/hooks/use-elapsed-seconds';


type DailyTaskResponse = {
  task?: string | null;
  dailyTask?: string | null;
};

export function useDailyTask({ enabled = true }: { enabled?: boolean } = {}) {
  const isFocused = useIsFocused();

  const [dailyTask, setDailyTask] = useState<string | null>(null);
  const [loadingDailyTask, setLoadingDailyTask] = useState(false);
  const [dailyTaskError, setDailyTaskError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { elapsedSeconds, resetTimer } = useElapsedSeconds({ autoStart: true });

  const hasFetchedRef = useRef(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (!enabled) return;

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

  useEffect(() => {
    if (elapsedSeconds >= 86400) {
      handleCompleteTask();
    }
  }, [elapsedSeconds]);

  const handleCompleteTask = async () => {
    await resetTimer();
    router.navigate('/task/active');
  };

  const handleDonePress = async () => {
    if (isCompleting || !dailyTask || loadingDailyTask) return;

    setIsCompleting(true);
    setShowConfetti(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    await handleCompleteTask();
  };

  return {
    dailyTask,
    loadingDailyTask,
    dailyTaskError,
    elapsedSeconds,
    showConfetti,
    isCompleting,
    handleCompleteTask,
    handleDonePress,
  };
}
