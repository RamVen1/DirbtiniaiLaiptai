import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

export default function TaskPage() {
  const [task, setTask] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Daily Mission</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <View style={styles.taskCard}>
            <Text style={styles.taskBody}>
              {task || 'No task found. Click below to generate one!'}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleRefresh} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Generating...' : 'Generate New Task'}</Text>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 30 },
  taskCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    elevation: 4,
    marginBottom: 20,
  },
  taskBody: { fontSize: 18, textAlign: 'center', color: '#333' },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  errorText: { color: 'red', marginTop: 20 },
});
