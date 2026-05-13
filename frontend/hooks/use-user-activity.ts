import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export const useUserActivity = () => {
  const [completedDates, setCompletedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    try {
      const response = await api.get('/activity');
      if (response.data && response.data.completed_dates) {
        const dateObjects = response.data.completed_dates.map(
          (dateString: string) => new Date(dateString)
        );
        setCompletedDates(dateObjects);
      }
    } catch (error) {
      console.error("Failed to fetch activity:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return { completedDates, loading, refreshActivity: fetchActivity };
};