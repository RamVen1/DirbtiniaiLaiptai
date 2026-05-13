import { useState, useEffect } from 'react';
import { getItem } from '@/utils/storage';

export interface SkillData {
  [skill: string]: {
    weeks: number;
    tasks: number;
    hours: number;
  };
}

export interface WeeklyData {
  week: number;
  tasks: number;
  hours: number;
  skill: string;
  week_start: string;
  report_id: number;
}

export interface QuarterlyReportData {
  quarter_number: number;
  total_weeks: number;
  total_tasks: number;
  total_hours: number;
  avg_tasks_per_week: number;
  consistency_score: number;
  skills: SkillData;
  weekly_data: WeeklyData[];
  progression_trend: 'improving' | 'maintaining' | 'declining' | 'new';
  improvement_percent: number;
  quarter_start: string;
  quarter_end: string;
}

export interface QuarterSummary {
  quarter_number: number;
  total_tasks: number;
  total_hours: number;
  skills: string[];
  consistency_score: number;
}

export function useQuarterlyReport() {
  const [quarterlyData, setQuarterlyData] = useState<QuarterlyReportData | null>(null);
  const [quarters, setQuarters] = useState<QuarterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuarterlyData();
  }, []);

  const fetchQuarterlyData = async (quarterNumber?: number) => {
    try {
      setLoading(true);
      const token = await getItem('userToken');

      const queryString = quarterNumber ? `?quarter_number=${quarterNumber}` : '';

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/quarterly-report${queryString}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status !== 'no_data') {
          setQuarterlyData(data);
        } else {
          setError('No quarterly data available yet');
        }
      } else {
        setError('Failed to fetch quarterly report');
      }
    } catch (err) {
      setError('Error fetching quarterly report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuartersSummary = async () => {
    try {
      const token = await getItem('userToken');

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/quarterly-summary`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setQuarters(data.quarters || []);
      }
    } catch (err) {
      console.error('Error fetching quarters summary:', err);
    }
  };

  return {
    quarterlyData,
    quarters,
    loading,
    error,
    fetchQuarterlyData,
    fetchQuartersSummary,
  };
}
