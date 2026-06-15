import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemePalette } from './use-color-scheme';
import { api } from '@/lib/api';

export const useReviewMember = () => {
  const router = useRouter();
  const { memberId } = useLocalSearchParams();
  const { tint } = useThemePalette();
  const [data, setData] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const [progressRes, reportsRes] = await Promise.all([
          api.get(`/moderate/members/${memberId}/progress`),
          api.get(`/moderate/members/${memberId}/reports`)
        ]);
        setData(progressRes.data);
        setReports(reportsRes.data.reports || []);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };
    if (memberId) fetchProgress();
  }, [memberId]);

  const handleViewReport = (reportId: number) => {
    router.push({
      pathname: '/MiniReport',
      params: { reportId: reportId.toString() }
    });
  };

  return {
    router,
    avatarSource,
    tint,
    loading,
    memberName: data?.memberName,
    memberRole: data?.memberRole,
    memberEmail: data?.memberEmail,
    completedModules: data?.completedModules || [],
    activeModule: data?.activeModule || { title: 'N/A', progress: 0 },
    totalHours: data?.totalHours || 0,
    avgScore: data?.avgScore || 0,
    reports,
    handleViewReport,
  };
};