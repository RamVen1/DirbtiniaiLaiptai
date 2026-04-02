import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemePalette } from '@/hooks/use-color-scheme';

export function useTeamMembers() {
  const router = useRouter();
  const avatarSource = require('@/assets/images/avatars/avatar1.jpg');
  const { teamId, teamCode } = useLocalSearchParams();
  const { tint } = useThemePalette();

  const members = [
    { id: 1, fullName: 'Mantas Jankauskas', itRole: 'Backend Developer', email: 'mantas.jankauskas@company.lt' },
    { id: 2, fullName: 'Egle Kazlaite', itRole: 'Frontend Developer', email: 'egle.kazlaite@company.lt' },
    { id: 3, fullName: 'Lukas Petraitis', itRole: 'QA Engineer', email: 'lukas.petraitis@company.lt' },
    { id: 4, fullName: 'Greta Vaiciulyte', itRole: 'DevOps Engineer', email: 'greta.vaiciulyte@company.lt' },
  ];

  const handleReviewStats = (member: any) => {
    router.push({
      pathname: '/ReviewMember',
      params: {
        memberId: String(member.id),
        memberName: member.fullName,
        memberRole: member.itRole,
        memberEmail: member.email,
      },
    });
  };

  return {
    router,
    avatarSource,
    teamId,
    teamCode,
    tint,
    members,
    handleReviewStats,
  };
}
