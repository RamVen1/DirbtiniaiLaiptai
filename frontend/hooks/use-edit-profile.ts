import { useState } from 'react';
import { useThemePalette } from '@/hooks/use-color-scheme';

export function useEditProfile(){
  const [showAvatarPanel, setShowAvatarPanel] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const avatars = [
    require('@/assets/images/avatars/avatar1.jpg'),
    require('@/assets/images/avatars/avatar2.jpg'),
    require('@/assets/images/avatars/avatar3.jpg')
  ];
  const { tint, text } = useThemePalette();
  const [name, setName] = useState('Name Surname');
  const [role, setRole] = useState('Senior Cloud Architect');
  const [email, setEmail] = useState('engineer@logic.io');
  const defaultAvatar = require('@/assets/images/avatars/avatar1.jpg');
  return { 
    name, 
    setName, 
    role, 
    setRole, 
    email, 
    setEmail, 
    defaultAvatar,
    showAvatarPanel, 
    setShowAvatarPanel,
    selectedAvatar,
    setSelectedAvatar,
    tint,
    text,
    avatars
  };
}