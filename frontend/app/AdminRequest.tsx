import React from 'react';
import { View, Pressable, ActivityIndicator, Animated, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useThemePalette } from '@/hooks/use-color-scheme';
import { useAdminRequest } from '@/hooks/use-admin-request';
import { useAuth } from '@/hooks/use-auth';
import { useEntranceAnimation } from '@/hooks/use-entrance-animation';

export default function AdminRequestScreen() {
  const router = useRouter();
  const { tint } = useThemePalette();
  const { user } = useAuth();
  const { requests, loading, handleAction } = useAdminRequest();
  const { opacity: contentOpacity, translateY: contentTranslateY } = useEntranceAnimation();
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 34 : 20;

  if (!user || user.role?.toLowerCase() !== 'admin' || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-border/20">
          <View className="flex-row items-center justify-between px-6 py-4">
            <Pressable
              onPress={() => router.back()}
              className="p-2 -ml-2 active:scale-95"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color={tint} />
            </Pressable>

            <Text className="text-lg font-black text-primary tracking-tighter">Admin Control</Text>

            <View className="w-8" />
          </View>
        </View>

        <Animated.ScrollView
          className="flex-1 bg-background"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 108,
            paddingHorizontal: horizontalPadding,
            paddingBottom: 140,
          }}
          style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }}
        >
          <View className="w-full">
            

            {requests.length === 0 ? (
              <View className="bg-card rounded-3xl p-8 items-center justify-center border border-border/20">
                <Text className="text-xl font-bold text-foreground mb-2">No pending requests</Text>
                <Text className="text-center text-foreground/70">
                  All moderator applications have been processed.
                </Text>
              </View>
            ) : (
              <View className="flex-col gap-4">
                {requests.map((req) => (
                  <View key={req.ID} className="bg-card border border-border/20 rounded-3xl p-5 shadow-sm">
                    <View className="flex-row items-start justify-between gap-4 mb-4">
                      <View className="flex-1">
                      
                        <Text className="text-2xl font-black text-foreground mt-1">{req.Username}</Text>
                        <Text className="text-sm text-foreground/70 mt-2">Submitted: {req.RequestDate}</Text>
                      </View>
                      <View className="w-11 h-11 rounded-full bg-primary/10 items-center justify-center">
                        <Ionicons name="person-add-outline" size={20} color={tint} />
                      </View>
                    </View>

                    <View className="bg-primary/10 p-4 rounded-2xl flex-row justify-between items-center border border-primary/20">
                      <View className="flex-1">
                        <Text className="text-xs uppercase tracking-widest text-foreground/60 mb-1">Email</Text>
                        <Text className="text-primary font-bold text-lg">{req.Email}</Text>
                      </View>
                    </View>

                    <View className="flex-row gap-3 mt-4">
                      <Button
                        className="flex-1 bg-primary h-12 rounded-2xl"
                        onPress={() => handleAction(req.ID, 'Accept')}
                      >
                        <Text className="text-white font-bold">Accept</Text>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 h-12 rounded-2xl border-destructive"
                        onPress={() => handleAction(req.ID, 'Decline')}
                      >
                        <Text className="text-destructive font-bold">Decline</Text>
                      </Button>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}