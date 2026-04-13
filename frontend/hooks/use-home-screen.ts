import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { useThemePalette } from '@/hooks/use-color-scheme';
import { useAuth } from "@/hooks/use-auth";
import { getItem } from '@/utils/storage';

export function useHomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const { tint } = useThemePalette();
  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');
  const { user } = useAuth();

  const [hasReport, setHasReport] = useState(false);
  const [loading, setLoading] = useState(true);

  const role = user?.role?.toLowerCase();

  useEffect(() => {
    const checkReportStatus = async () => {
      try {
        const token = await getItem('userToken');
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/check-report`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setHasReport(data.exists);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    checkReportStatus();
  }, []);

  const getDestination = () => {
    if (role === 'admin') return '/AdminRequest';
    if (role === 'moderator') return '/ManageTeams';
    if (role === 'member' && !user?.team_id) return '/join-group';
    return '/task';
  };

  const getButtonProps = () => {
    if (role === 'admin') return { label: 'Review Requests', icon: 'shield-checkmark' };
    if (role === 'moderator') return { label: 'Manage My Teams', icon: 'people' };
    if (role === 'member' && !user?.team_id) return { label: 'Join a Team', icon: 'add-circle' };
    return { label: 'Continue Daily Next Step', icon: 'flame' };
  };

  const destination = getDestination();
  const { label, icon } = getButtonProps();

  return {
    router,
    isTablet,
    tint,
    avatarSource,
    user,
    hasReport,
    loading,
    destination,
    label,
    icon,
  };
}
