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
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
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

    const isChangingPassword = oldPassword.trim() !== '' || newPassword.trim() !== '';
    
    if (isChangingPassword) {
      if (!oldPassword || !newPassword) {
        Alert.alert("Klaida", "Norėdami pakeisti slaptažodį, turite įvesti ir senąjį, ir naująjį slaptažodį.");
        return false;
      }
      if (newPassword.length < 6) {
        Alert.alert("Klaida", "Naujas slaptažodis turi būti bent 6 simbolių ilgio.");
        return false;
      }
    }

    setLoading(true);
    try {
      const payload: any = {
        username: name,
        email: email,
        avatar_index: selectedAvatar
      };

      if (isChangingPassword) {
        payload.old_password = oldPassword;
        payload.new_password = newPassword;
      }

      const response = await api.put('/me', payload);

      if (response.data) {
        setUser(response.data);
        setOldPassword('');
        setNewPassword('');
        return true;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Nepavyko išsaugoti pakeitimų.";
      Alert.alert("Klaida", message);
      console.error("Profile update failed:", error.response?.data || error.message);
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
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    loading, handleSave,
    showAvatarPanel, setShowAvatarPanel,
    selectedAvatar, setSelectedAvatar,
    tint,
    avatars
  };
};