import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemePalette } from './use-color-scheme';
import { api } from '@/lib/api';

export const useTeamMembers = () => {
  const router = useRouter();
  const { teamId, teamCode } = useLocalSearchParams();
  const { tint } = useThemePalette();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get(`/moderate/teams/${teamId}/members`);
        setMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    };
    if (teamId) fetchMembers();
  }, [teamId]);

  const handleReviewStats = (member: any) => {
    router.push({
      pathname: '/ReviewMember',
      params: { memberId: member.id }
    });
  };

  return { router, avatarSource, teamId, teamCode, tint, members, loading, handleReviewStats };
};