import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { getItem } from '@/utils/storage';
import { useAuth } from '@/hooks/use-auth';

export function useJoinGroup() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const { refreshUser } = useAuth();

  const handleJoin = async () => {
    if (input.length < 4) {
      Alert.alert('Error', 'Code is too short');
      return;
    }

    setLoading(true);
    const token = await getItem('userToken');

    try {
      const response = await fetch(`${API_URL}/group/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: input.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        await refreshUser();
        router.replace('/profile');
        Alert.alert('Success', 'You have joined the team!', [
          { text: 'OK', onPress: () => router.replace('/profile') },
        ]);
      } else {
        Alert.alert('Error', data.detail || 'Failed to join group');
      }
    } catch {
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };


  return {
    input,
    setInput,
    loading,
    handleJoin,
  };
}
