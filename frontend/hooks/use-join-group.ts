import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { getItem } from '@/utils/storage';
import { useAuth } from '@/hooks/use-auth';

export function useJoinGroup() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const { refreshUser } = useAuth();
  const skills = ['Communication', 'Time-management', 'Problem solving'];
  const normalizedCode = input.trim().toUpperCase();
  const isCodeValid = /^[A-Z0-9]{8}$/.test(normalizedCode);

  const handleInputChange = (value: string) => {
    const cleanedInput = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    setInput(cleanedInput);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleJoinAttempt = () => {
    if (!isCodeValid) {
      setErrorMessage('Enter a valid 8-character group code.');
      return;
    }
    setErrorMessage('');
    setSelectedSkill('');
    setShowSkillModal(true);
  };

  const submitJoin = async () => {
    if (!selectedSkill || !isCodeValid) {
      return;
    }
    setLoading(true);
    setErrorMessage('');
    const token = await getItem('userToken');

    try {
      const response = await fetch(`${API_URL}/group/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: normalizedCode, skill: selectedSkill }),
      });

      const data = await response.json();

      if (response.ok) {
        await refreshUser();
        setShowSkillModal(false);
        router.replace('/profile');
        Alert.alert('Success', 'You have joined the team!');
      } else {
        const detail = typeof data?.detail === 'string' ? data.detail : 'Failed to join group';
        setErrorMessage(detail);
        setShowSkillModal(false);
      }
    } catch {
      setErrorMessage('Could not connect to server');
      setShowSkillModal(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    input,
    setInput: handleInputChange,
    loading,
    showSkillModal,
    setShowSkillModal,
    skills,
    errorMessage,
    isCodeValid,
    selectedSkill,
    setSelectedSkill,
    handleJoinAttempt,
    submitJoin,
  };
}
