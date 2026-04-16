import React from 'react';
import { View, Pressable, ActivityIndicator, Animated, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useManageTeam } from '@/hooks/use-manage-team';
import { useAuth } from '@/hooks/use-auth';
import { useEntranceAnimation } from '@/hooks/use-entrance-animation';
import { useBackOrTabs } from '@/hooks/use-back-or-tabs';
export default function ManageTeamsScreen() {
  const { user } = useAuth();
  const { teams, loading, tint, handleCreateTeam, handleDeleteTeam, copyToClipboard } = useManageTeam();
  const { opacity: contentOpacity, translateY: contentTranslateY } = useEntranceAnimation();
  const handleBack = useBackOrTabs();
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 34 : 20;

  if (!user || !['admin', 'moderator'].includes(user.role?.toLowerCase()) || loading) {
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
              onPress={handleBack}
              className="p-2 -ml-2 active:scale-95"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color={tint} />
            </Pressable>

            <Text className="text-lg font-black text-primary tracking-tighter">Create Teams</Text>

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
            {teams.length === 0 ? (
              <View className="bg-card rounded-3xl p-8 items-center justify-center border border-border/20">
                <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-4">
                  <Ionicons name="people" size={34} color={tint} />
                </View>
                <Text className="text-xl font-bold text-foreground mb-2">No teams created yet</Text>
                <Text className="text-center text-foreground/70 mb-6">
                  Start by creating your first team and invite members with the generated code.
                </Text>
              </View>
            ) : (
              <View className="flex-col gap-4">
                {teams.map((team) => (
                  <View
                    key={team.ID}
                    className="bg-card border border-border/20 rounded-3xl p-5 shadow-sm"
                  >
                    <View className="flex-row items-start justify-between gap-4 mb-4">
                      <View className="flex-1">
                        <Text className="text-[11px] text-primary font-bold uppercase tracking-widest">Active Team</Text>
                        <Text className="text-2xl font-black text-foreground mt-1">Team #{team.ID}</Text>
                      </View>
                      <Pressable
                        onPress={() => handleDeleteTeam(team.ID)}
                        className="w-9 h-9 items-center justify-center bg-destructive/10 rounded-full active:scale-95"
                      >
                        <Ionicons name="trash-outline" size={18} color="#ff4444" />
                      </Pressable>
                    </View>

                    <View className="bg-primary/10 p-4 rounded-2xl flex-row justify-between items-center border border-primary/20">
                      <View className="flex-1">
                        <Text className="text-xs uppercase tracking-widest text-foreground/60 mb-1">Team code</Text>
                        <Text className="font-mono text-primary font-bold text-xl tracking-[3px]">
                          {team.Code}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => copyToClipboard(team.Code)}
                        className="w-9 h-9 rounded-lg bg-background border border-border/20 items-center justify-center active:scale-95"
                      >
                        <Ionicons name="copy-outline" size={18} color={tint} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View className="mt-6">
            <Button onPress={handleCreateTeam} className="bg-primary py-4 rounded-2xl flex-row items-center justify-center gap-2">
              <Ionicons name="add" size={20} color="#ffffff" />
              <Text className="text-white font-bold text-base">Add team</Text>
            </Button>
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}