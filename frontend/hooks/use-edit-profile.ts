import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useThemePalette } from '@/hooks/use-color-scheme';
import { api } from '@/lib/api';
import { Alert } from 'react-native';

export const useEditProfile = () => {
  const { user, setUser } = useAuth();
  const { tint } = useThemePalette();

  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role] = useState(user?.role || '');
  const [loading, setLoading] = useState(false);
  const [showAvatarPanel, setShowAvatarPanel] = useState(false);
  
  const [selectedAvatar, setSelectedAvatar] = useState<number>(user?.avatar_index ?? 0);

  const avatars = [
    require('@/assets/images/avatars/avatar1.jpg'),
    require('@/assets/images/avatars/avatar2.jpg'),
    require('@/assets/images/avatars/avatar3.jpg')
  ]; 

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert("Klaida", "Vardas ir el. paštas negali būti tušti.");
      return false;
    }

    setLoading(true);
    try {
      const response = await api.put('/me', { 
        username: name, 
        email: email,
        avatar_index: selectedAvatar
      });

      if (response.data) {
        setUser(response.data);
        return true;
      }
    } catch (error: any) {
      console.error("Profile update failed:", error.response?.data || error.message);
      Alert.alert("Klaida", "Nepavyko išsaugoti pakeitimų.");
      return false;
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    name, setName,
    role,
    email, setEmail,
    loading, handleSave,
    showAvatarPanel, setShowAvatarPanel,
    selectedAvatar, setSelectedAvatar,
    tint,
    avatars
  };
};