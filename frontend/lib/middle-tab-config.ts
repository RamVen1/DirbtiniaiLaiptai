export function getMiddleTabConfig(user: any) {
  const role = user?.role?.toLowerCase();

  if (role === 'admin') return { title: 'Requests', icon: 'shield-checkmark' };
  if (role === 'moderator') return { title: 'Manage', icon: 'people' };
  if (role === 'member' && !user?.team_id) return { title: 'Join', icon: 'add-circle' };

  return { title: 'Task', icon: 'flame' };
}
