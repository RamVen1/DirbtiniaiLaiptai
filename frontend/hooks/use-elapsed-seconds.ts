import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

export function useElapsedSeconds({ autoStart = true }: { autoStart?: boolean } = {}) {
  const isFocused = useIsFocused();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!autoStart || !isFocused) return;

    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [autoStart, isFocused]);

  return { elapsedSeconds, setElapsedSeconds };
}
