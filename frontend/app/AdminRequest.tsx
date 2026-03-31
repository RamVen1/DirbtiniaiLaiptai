import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAdminRequest } from '@/hooks/use-admin-request';

export default function AdminRequestScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;
  const { requests, loading, handleAction } = useAdminRequest();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={tint} />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-border/20">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color={tint} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">Admin Control</Text>
        <View className="w-10" /> {/* Balansas tarpui */}
      </View>

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-muted-foreground mb-6">
          Review and manage user requests to become Moderators.
        </Text>

        {requests.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <View className="bg-muted p-6 rounded-full mb-4">
              <Ionicons name="shield-checkmark-outline" size={48} color={tint} opacity={0.5} />
            </View>
            <Text className="text-xl font-bold text-foreground">No pending requests</Text>
            <Text className="text-muted-foreground text-center mt-2">
              All moderator applications have been processed.
            </Text>
          </View>
        ) : (
          requests.map((req) => (
            <View key={req.ID} className="bg-card border border-border/20 rounded-2xl p-5 mb-4 shadow-sm">
              <View className="mb-4">
                <Text className="text-sm text-primary font-bold uppercase mb-1">Moderator Request</Text>
                <Text className="text-lg font-bold text-foreground">{req.Email}</Text>
                <Text className="text-xs text-muted-foreground mt-1">
                  Submitted: {req.RequestDate}
                </Text>
              </View>

              <View className="flex-row gap-3">
                <Button 
                  className="flex-1 bg-primary h-12 rounded-xl" 
                  onPress={() => handleAction(req.ID, 'Accept')}
                >
                  <Text className="text-white font-bold">Accept</Text>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl border-destructive" 
                  onPress={() => handleAction(req.ID, 'Decline')}
                >
                  <Text className="text-destructive font-bold">Decline</Text>
                </Button>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}