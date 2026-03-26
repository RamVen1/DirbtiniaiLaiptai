import { useEffect, useState } from 'react';
import { getItem, saveItem } from '@/utils/storage';

export function useElapsedSeconds({ autoStart = true }: { autoStart?: boolean } = {}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!autoStart) return;

    const initializeTimer = async () => {
      const startTime = await getItem('taskStartTime');
      const now = Date.now();

      if (!startTime) {
        await saveItem('taskStartTime', now.toString());
        setElapsedSeconds(0);
      } else {
        const diff = Math.floor((now - parseInt(startTime)) / 1000);
        setElapsedSeconds(diff);
      }
    };

    initializeTimer();

    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoStart]);

  const resetTimer = async () => {
    await saveItem('taskStartTime', '');
    setElapsedSeconds(0);
  };

  return { elapsedSeconds, setElapsedSeconds, resetTimer };
}