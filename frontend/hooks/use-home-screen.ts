import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { useThemePalette } from '@/hooks/use-color-scheme';
import { useAuth } from "@/hooks/use-auth";
import { getItem } from '@/utils/storage';

type AdminRequest = {
  ID: number;
  UserEmail: string;
  RequestDate: string;
  Status?: string;
  ProcessedDate?: string;
  AdminEmail?: string | null;
};

type AdminRequestSummary = {
  pending_count: number;
  latest_handled: AdminRequest | null;
  recent_handled_requests: AdminRequest[];
};

type TeamSummary = {
  ID: number;
  Code: string;
  ModeratorID: number;
};

type PetMilestone = {
  name: string;
  skill: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const getPetMilestones = (streak: number): PetMilestone[] => [
  {
    name: 'Dragon',
    skill: 'Networking',
  },
  {
    name: 'Bunny',
    skill: 'Time Management',
  },
  {
    name: 'Dog',
    skill: 'Active Listening',
  },
];

export function useHomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const { tint } = useThemePalette();
  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');
  const { user } = useAuth();

  const [hasReport, setHasReport] = useState(false);
  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [adminSummary, setAdminSummary] = useState<AdminRequestSummary>({
    pending_count: 0,
    latest_handled: null,
    recent_handled_requests: [],
  });
  const [loading, setLoading] = useState(true);

  const role = user?.role?.toLowerCase();
  const isMemberWithoutTeam = role === 'member' && !user?.team_id;
  const isMemberWithTeam = role === 'member' && !!user?.team_id;
  const streak = Number(user?.streak || 0);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const token = await getItem('userToken');
        if (!token) {
          setHasReport(false);
          setTeams([]);
          setAdminSummary({ pending_count: 0, latest_handled: null, recent_handled_requests: [] });
          setLoading(false);
          return;
        }

        if (isMemberWithTeam) {
          const response = await fetch(`${API_URL}/check-report`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setHasReport(Boolean(data?.exists));
          } else {
            setHasReport(false);
          }
        } else {
          setHasReport(false);
        }

        if (role === 'moderator') {
          const response = await fetch(`${API_URL}/moderate/teams`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setTeams((data?.teams || []) as TeamSummary[]);
          } else {
            setTeams([]);
          }
        } else {
          setTeams([]);
        }

        if (role === 'admin') {
          const response = await fetch(`${API_URL}/admin/requests/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setAdminSummary({
              pending_count: data?.pending_count || 0,
              latest_handled: data?.latest_handled || null,
              recent_handled_requests: data?.recent_handled_requests || [],
            });
          } else {
            setAdminSummary({ pending_count: 0, latest_handled: null, recent_handled_requests: [] });
          }
        } else {
          setAdminSummary({ pending_count: 0, latest_handled: null, recent_handled_requests: [] });
        }
      } catch {
        setHasReport(false);
        setTeams([]);
        setAdminSummary({ pending_count: 0, latest_handled: null, recent_handled_requests: [] });
      } finally {
        setLoading(false);
      }
    };
    
    loadHomeData();
  }, [isMemberWithTeam, role]);

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
  const petMilestones = getPetMilestones(streak);

  return {
    router,
    isTablet,
    tint,
    avatarSource,
    user,
    hasReport,
    destination,
    label,
    icon,
    role,
    isMemberWithoutTeam,
    isMemberWithTeam,
    teams,
    adminSummary,
    petMilestones,
    streak,
    loading,
  };
}
