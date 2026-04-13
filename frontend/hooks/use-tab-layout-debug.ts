import { useEffect } from 'react';

export function useTabLayoutDebug(user: any) {
  useEffect(() => {
    console.log('TAB LAYOUT DEBUG:', user?.team_id);
  }, [user?.team_id]);
}
