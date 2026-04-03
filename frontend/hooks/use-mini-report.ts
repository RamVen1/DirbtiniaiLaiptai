import { useState } from "react";
import { useEffect } from "react";
import { getItem } from "@/utils/storage";

export function useMiniReport() {
  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    chart_data: [0, 0, 0, 0, 0, 0, 0],
    total_practice_hours: 0
  });

  const completedDaysCount = reportData.chart_data.filter(val => val > 0).length;

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const token = await getItem('userToken');
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/mini-report-data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    avatarSource,
    loading,
    reportData,
    completedDaysCount,
    fetchReportData
  }
}