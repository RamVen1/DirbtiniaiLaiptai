import { useState } from "react";
import { useEffect } from "react";
import { getItem } from "@/utils/storage";

export interface Report {
  id: number;
  week_start: string;
  week_end: string;
  tasks_completed: number;
  practice_hours: number;
  completed_at: string;
}

export interface GroupedReportHistory {
  [skill: string]: Report[];
}

export function useReportHistory() {
  const [loading, setLoading] = useState(true);
  const [groupedHistory, setGroupedHistory] = useState<GroupedReportHistory>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportHistory();
  }, []);

  const fetchReportHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getItem('userToken');
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/report-history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGroupedHistory(data.grouped_history || {});
      } else {
        setError('Failed to fetch report history');
      }
    } catch (error) {
      console.error(error);
      setError('Error fetching report history');
    } finally {
      setLoading(false);
    }
  };


  const getSortedSkills = () => {
    return Object.keys(groupedHistory).sort((skillA, skillB) => {
      const reportsA = groupedHistory[skillA];
      const reportsB = groupedHistory[skillB];
      
      const mostRecentA = new Date(reportsA[0]?.week_start || 0);
      const mostRecentB = new Date(reportsB[0]?.week_start || 0);
      
      return mostRecentB.getTime() - mostRecentA.getTime();
    });
  };

  const getSkillStats = (skill: string) => {
    const reports = groupedHistory[skill] || [];
    return {
      totalReports: reports.length,
      totalHours: reports.reduce((sum, r) => sum + r.practice_hours, 0),
      totalTasks: reports.reduce((sum, r) => sum + r.tasks_completed, 0),
      averageTasksPerWeek: reports.length > 0 
        ? Math.round(reports.reduce((sum, r) => sum + r.tasks_completed, 0) / reports.length)
        : 0
    };
  };

  return {
    loading,
    groupedHistory,
    error,
    fetchReportHistory,
    getSortedSkills,
    getSkillStats
  };
}
