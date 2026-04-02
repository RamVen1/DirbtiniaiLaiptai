import { Alert } from 'react-native';
import { useState } from 'react';
import { deleteItem, getItem } from '@/utils/storage';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';


export function useProfileModal(){

  const { setHasToken, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await deleteItem('userToken');
    await deleteItem('userData');
    setHasToken(false);
  };

  const handleApplyModerator = async () => {
    setLoading(true);
    const token = await getItem('userToken');
    try {
      const response = await fetch(`${API_URL}/admin/request-moderator`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert("Success", "Request submitted! An admin will review it.");
      } else {
        Alert.alert("Notice", data.detail || "You already have a pending request.");
      }
    } catch (e) {
      Alert.alert("Error", "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    setLoading(true);
    const token = await getItem('userToken');
    try {
      const response = await fetch(`${API_URL}/group/leave`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "You have left the group.");
        router.replace('/profile');
      } else {
        Alert.alert("Error", data.detail || "Failed to leave the group.");
      }
    } catch (e) {
      Alert.alert("Error", "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return {user, loading, handleLogout, handleApplyModerator, handleLeaveGroup}
}