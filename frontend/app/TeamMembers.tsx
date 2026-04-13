import React from 'react';
import { View, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Text } from '@/components/ui/text';
import { useTeamMembers } from '@/hooks/use-team-members';

export default function TeamMembersScreen() {
  const { router, avatarSource, teamId, teamCode, tint, members, handleReviewStats } = useTeamMembers();

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

            <Text className="text-lg font-black text-primary tracking-tighter">Team Members</Text>

            <View className="w-8" />
          </View>
        </View>

        <ScrollView
          className="flex-1 pt-28 px-6 pb-8"
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-card border border-border/20 rounded-3xl p-6">
            <Text className="text-[11px] text-primary font-bold uppercase tracking-widest">Selected Team</Text>
            <Text className="text-3xl font-black text-foreground mt-1">Team #{teamId ?? 'N/A'}</Text>

            <View className="mt-5 bg-primary/10 p-4 rounded-2xl border border-primary/20">
              <Text className="text-xs uppercase tracking-widest text-foreground/60">Code</Text>
              <Text className="font-mono text-primary font-bold text-xl tracking-[3px] mt-1">
                {teamCode ?? 'Not available'}
              </Text>
            </View>

            <View className="mt-6 flex-row items-center justify-between">
              <Text className="text-xl font-black text-foreground">Members</Text>
              <Text className="text-sm text-foreground/70">{members.length} total</Text>
            </View>

            <View className="mt-4 gap-3">
              {members.map((member) => (
                <View
                  key={member.id}
                  className="bg-background border border-border/20 rounded-2xl p-4"
                >
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-10 h-10 rounded-full overflow-hidden border border-border/30">
                        <Image source={avatarSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-foreground">{member.fullName}</Text>
                        <Text className="text-sm text-foreground/70">{member.itRole}</Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => handleReviewStats(member)}
                      className="px-4 py-2 rounded-xl bg-primary/15 border border-primary/25 active:scale-95"
                      accessibilityRole="button"
                      accessibilityLabel={`Review stats for ${member.fullName}`}
                    >
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="stats-chart" size={16} color={tint} />
                        <Text className="text-primary font-bold">Review</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
