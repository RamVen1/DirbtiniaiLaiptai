import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, View } from 'react-native';
import * as Notifications from 'expo-notifications';

import { ensureNotificationPermissionsAsync, getExpoPushTokenAsync } from '@/lib/notifications';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function TestNotificationScreen() {
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const [lastResponse, setLastResponse] = useState<Notifications.NotificationResponse | null>(null);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      setLastResponse(response);
    });
    return () => sub.remove();
  }, []);

  async function refreshPermissions() {
    const perms = await Notifications.getPermissionsAsync();
    setPermissionStatus(perms.status);
  }

  async function requestPermissionOnly() {
    try {
      await refreshPermissions();
      const status = await ensureNotificationPermissionsAsync();
      await refreshPermissions();
      if (status !== 'granted') Alert.alert('Permission not granted');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : String(e));
    }
  }

  async function scheduleLocal(secondsFromNow: number) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test notification',
        body: secondsFromNow === 0 ? 'Triggered immediately' : `Scheduled for ${secondsFromNow}s`,
        data: { type: 'test', secondsFromNow, platform: Platform.OS },
      },
      trigger:
        secondsFromNow === 0
          ? null
          : {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: secondsFromNow,
              repeats: false,
            },
    });
    Alert.alert(
      'Scheduled',
      secondsFromNow === 0 ? 'Sent now.' : `Will fire in ${secondsFromNow} seconds.`,
    );
  }

  useEffect(() => {
    refreshPermissions();
  }, []);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 gap-4">
        <Text variant="h3" className="text-left">
          Notifications test
        </Text>

        <View className="bg-card border border-border rounded-lg p-4 gap-1">
          <Text variant="muted">Permission status</Text>
          <Text className="font-semibold">{permissionStatus}</Text>
        </View>

        <View className="gap-3">
          <Button onPress={requestPermissionOnly}>
            <Text>Request notification permission</Text>
          </Button>
          <Button variant="secondary" onPress={() => scheduleLocal(0)}>
            <Text>Send local notification now</Text>
          </Button>
          <Button variant="secondary" onPress={() => scheduleLocal(5)}>
            <Text>Send local notification in 5s</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
