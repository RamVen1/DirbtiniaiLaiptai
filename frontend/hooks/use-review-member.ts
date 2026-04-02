import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemePalette } from '@/hooks/use-color-scheme';

export function useReviewMember() {
  const router = useRouter();
  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');
  const { memberId, memberName, memberRole, memberEmail } = useLocalSearchParams();
  const { tint } = useThemePalette();

  const completedModules = [
    { id: 1, name: 'Active Listening', score: 92, hours: 4.5 },
    { id: 2, name: 'Constructive Feedback', score: 88, hours: 3.0 },
    { id: 3, name: 'Conflict Resolution', score: 90, hours: 2.5 },
    { id: 4, name: 'Mentorship', score: 85, hours: 3.5 },
    { id: 5, name: 'Presentation', score: 94, hours: 2.0 },
  ];

  const activeModule = {
    title: 'Strategic Communication in Projects',
    progress: 68,
    nextTask: 'Stakeholder Alignment Exercise',
  };

  const totalHours = completedModules.reduce((sum, item) => sum + item.hours, 0);
  const avgScore = Math.round(
    completedModules.reduce((sum, item) => sum + item.score, 0) / completedModules.length
  );

  return {
    router,
    avatarSource,
    memberId,
    memberName,
    memberRole,
    memberEmail,
    tint,
    completedModules,
    activeModule,
    totalHours,
    avgScore,
  };
}
