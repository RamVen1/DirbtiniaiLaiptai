import { useEffect, useState } from 'react';
import { getItem, saveItem } from '@/utils/storage';

export function useElapsedSeconds({ autoStart = true }: { autoStart?: boolean } = {}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!autoStart) return;

    const initializeTimer = async () => {
      const deadline = await getItem('taskDeadline');
      const now = Date.now();

      if (!deadline) {
        // No deadline exists, create a new 24-hour deadline
        const newDeadline = now + 86400000; // 24 hours in milliseconds
        await saveItem('taskDeadline', newDeadline.toString());
        setElapsedSeconds(0);
      } else {
        const deadlineTime = parseInt(deadline);
        const remaining = deadlineTime - now;
        
        if (remaining <= 0) {
          await saveItem('taskDeadline', '');
          setElapsedSeconds(86400);
        } else {
          const elapsed = Math.floor((86400000 - remaining) / 1000);
          setElapsedSeconds(Math.max(0, elapsed));
        }
      }
    };

    initializeTimer();

    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoStart]);

  const resetTimer = async () => {
    await saveItem('taskDeadline', '');
    setElapsedSeconds(0);
  };

  return { elapsedSeconds, setElapsedSeconds, resetTimer };
}