import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TaskPage() {
  const [task, setTask] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const spinnerColor = colorScheme === 'dark' ? '#AD49E1' : '#7A1CAC';

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchDailyTask = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/task`);
      const data = await response.json();

      setTask(data.task);
      setError(null);
    } catch (err) {
      setError('Check if your Python backend is running.');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/refresh-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setTask(data.task);
    } catch (err) {
      setError('Failed to generate a new AI task.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Global Env URL:', process.env.EXPO_PUBLIC_API_URL);
    fetchDailyTask();
  }, [fetchDailyTask]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center items-center">
        <Text className="text-3xl text-foreground font-extrabold mb-8">Daily Mission</Text>

        {loading ? (
          <ActivityIndicator size="large" color={spinnerColor} />
        ) : (
          <View className="w-full bg-card border border-border rounded-2xl p-6 mb-5">
            <Text className="text-lg text-foreground text-center">
              {task || 'No task found. Click below to generate one!'}
            </Text>
          </View>
        )}

        <Button
          className="mt-2 w-full h-12 rounded-xl"
          onPress={handleRefresh}
          disabled={loading}
          accessibilityLabel="Generate a new task"
        >
          <Text className="text-base font-semibold">
            {loading ? 'Generating...' : 'Generate New Task'}
          </Text>
        </Button>

        {error && <Text className="text-foreground/80 mt-5 text-center">{error}</Text>}
      </View>
    </SafeAreaView>
  );
}
