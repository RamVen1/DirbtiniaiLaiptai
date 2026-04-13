import React from 'react';
import { View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useManageTeam } from '@/hooks/use-manage-team';
export default function ManageTeamsScreen() {

  const { 
    teams,
    loading,
    tint,
    handleCreateTeam,
    handleDeleteTeam,
    copyToClipboard
   } = useManageTeam();

  if (loading) return <ActivityIndicator style={{flex: 1}} color={tint} />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-border/20">
          <View className="flex-row items-center justify-between px-6 py-4">
            <Pressable
              onPress={() => router.navigate('/(tabs)')}
              className="p-2 -ml-2 active:scale-95"
              accessibilityRole="button"
              accessibilityLabel="Back to home"
            >
              <Ionicons name="chevron-back" size={22} color={tint} />
            </Pressable>

            <Text className="text-lg font-black text-primary tracking-tighter">My Teams</Text>

            <Pressable
              onPress={handleCreateTeam}
              className="w-10 h-10 rounded-full bg-primary items-center justify-center active:scale-95"
              accessibilityRole="button"
              accessibilityLabel="Create team"
            >
              <Ionicons name="add" size={22} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        <ScrollView
          className="flex-1 bg-background pt-24 px-6 pb-24"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6">
            <Text className="text-3xl font-bold tracking-tight text-foreground">
              Organize teams
            </Text>
          </View>

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
                <Button onPress={handleCreateTeam} className="bg-primary px-6">
                  <Text className="text-white font-bold">Create Team</Text>
                </Button>
              </View>
            ) : (
              <View className="flex-col gap-4">
                {teams.map((team) => (
                  <View
                    key={team.ID}
                    className="bg-card border border-border/20 rounded-3xl p-5 shadow-sm"
                  >
                    <View className="flex-row justify-between items-start mb-4">
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: '/TeamMembers',
                            params: {
                              teamId: String(team.ID),
                              teamCode: String(team.Code),
                            },
                          })
                        }
                        className="flex-1"
                        accessibilityRole="button"
                        accessibilityLabel={`Open Team ${team.ID} members`}
                      >
                        <Text className="text-[11px] text-primary font-bold uppercase tracking-widest">Active Team</Text>
                        <Text className="text-2xl font-black text-foreground">Team #{team.ID}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleDeleteTeam(team.ID)}
                        className="w-9 h-9 items-center justify-center bg-destructive/10 rounded-full active:scale-95"
                        accessibilityRole="button"
                        accessibilityLabel={`Delete team ${team.ID}`}
                      >
                        <Ionicons name="trash-outline" size={18} color="#ff4444" />
                      </Pressable>
                    </View>

                    <View className="bg-primary/10 p-4 rounded-2xl flex-row justify-between items-center border border-primary/20">
                      <Pressable
                        onPress={() =>
                          router.push({
                            pathname: '/TeamMembers',
                            params: {
                              teamId: String(team.ID),
                              teamCode: String(team.Code),
                            },
                          })
                        }
                        className="flex-1"
                        accessibilityRole="button"
                        accessibilityLabel={`Open Team ${team.ID} members`}
                      >
                        <Text className="font-mono text-primary font-bold text-xl tracking-[3px]">
                          {team.Code}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => copyToClipboard(team.Code)}
                        className="w-9 h-9 rounded-lg bg-background border border-border/20 items-center justify-center active:scale-95"
                        accessibilityRole="button"
                        accessibilityLabel={`Copy team ${team.ID} code`}
                      >
                        <Ionicons name="copy-outline" size={18} color={tint} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}