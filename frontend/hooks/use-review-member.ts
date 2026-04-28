import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemePalette } from './use-color-scheme';
import { api } from '@/lib/api';

export const useReviewMember = () => {
  const router = useRouter();
  const { memberId } = useLocalSearchParams();
  const { tint } = useThemePalette();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get(`/moderate/members/${memberId}/progress`);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      } finally {
        setLoading(false);
      }
    };
    if (memberId) fetchProgress();
  }, [memberId]);

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
  };
};