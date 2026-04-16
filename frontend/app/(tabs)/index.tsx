import React from 'react';
import { View, Pressable, Image as RNImage, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ModuleCard } from '@/components/dashboard/module-card';
import { useHomeScreen } from '@/hooks/use-home-screen';
import { useEntranceAnimation } from '@/hooks/use-entrance-animation';
import { usePulseAnimation } from '@/hooks/use-pulse-animation';

export default function HomeScreen() {
  const petSprite = require('@/assets/images/pets/fox-animation.gif');
  const {
    router,
    isTablet,
    tint,
    avatarSource,
    user,
    hasReport,
    destination,
    label,
    icon,
    role,
    isMemberWithoutTeam,
    isMemberWithTeam,
    teams,
    adminSummary,
    petMilestones,
    streak,
  } = useHomeScreen();
  const { opacity: heroOpacity, translateY: heroTranslateY } = useEntranceAnimation();
  const heartScale = usePulseAnimation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-border/20">
          <View className="flex-row items-center justify-between px-6 py-4">
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => router.navigate('/profile')}
                className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden"
              >
                <RNImage
                  source={avatarSource}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </Pressable>
              <Text className="text-lg font-black text-primary tracking-tighter">The Next Step</Text>
            </View>

            <Pressable onPress={() => router.navigate(destination as any)} className="p-2">
              <Ionicons name={icon as any} size={22} color={tint} />
            </Pressable>
          </View>
        </View>

        <Animated.ScrollView
          className="flex-1 bg-background"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 108,
            paddingHorizontal: isTablet ? 34 : 20,
            paddingBottom: 140,
          }}
          style={{ opacity: heroOpacity, transform: [{ translateY: heroTranslateY }] }}
        >
          {isMemberWithoutTeam ? (
            <View className="mt-6 rounded-3xl border border-border/20 bg-card p-8 items-center">
              <Ionicons name="people-outline" size={42} color={tint} />
              <Text className="mt-4 text-2xl font-bold text-foreground text-center">
                You are not part of a team yet
              </Text>
              <Text className="mt-2 text-center text-foreground/70">
                Join a team to unlock your streak, report view, and pets.
              </Text>

              <Button className="mt-6 w-full" onPress={() => router.navigate('/join-group' as any)}>
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-primary font-extrabold text-base">Join a Team</Text>
                  <Ionicons name="add-circle" size={18} color={tint} />
                </View>
              </Button>
            </View>
          ) : role === 'admin' ? (
            <View className="gap-6">
              <View className="rounded-3xl bg-primary p-8 relative overflow-hidden">
                <View className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-secondary/30" />
                <View className="relative z-10">
                  <Text className="text-white/80 text-sm uppercase tracking-[0.3em]">Requests</Text>
                  <Text className="text-white font-extrabold text-6xl mt-2">{adminSummary.pending_count}</Text>
                  <Text className="text-white/80 text-lg mt-2">Pending moderator requests</Text>

                  <Button className="mt-8 bg-background" onPress={() => router.navigate('/AdminRequest' as any)}>
                    <View className="flex-row items-center justify-center gap-2">
                      <Text className="text-primary font-extrabold text-base">Go to requests</Text>
                      <Ionicons name="shield-checkmark" size={18} color={tint} />
                    </View>
                  </Button>
                </View>
              </View>

              <View>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/50">Latest Handled Requests</Text>
                </View>

                {adminSummary.recent_handled_requests.length > 0 ? (
                  <View className="gap-3">
                    {adminSummary.recent_handled_requests.map((request) => (
                      <View key={request.ID} className="rounded-2xl border border-border/20 bg-card p-4">
                        <View className="mb-3">
                          <Text className="text-sm font-bold text-foreground">{request.UserEmail}</Text>
                          <Text className="text-xs text-foreground/60 mt-1">
                            Submitted: {new Date(request.RequestDate).toLocaleDateString()}
                          </Text>
                          <Text className="text-xs text-foreground/60 mt-1">
                            Processed: {request.ProcessedDate ? new Date(request.ProcessedDate).toLocaleDateString() : 'Handled'}
                          </Text>
                        </View>
                      </View>
                    ))}
                    <View className=" items-center justify-center mt-4">
                      <Pressable onPress={() => router.navigate('/AdminRequest' as any)}>
                        <Text className="font-bold text-primary text-xs">See all</Text>
                      </Pressable>
                    </View>
                  </View>

                ) : (
                  <View className="rounded-2xl border border-border/20 bg-card p-4 items-center">
                    <Text className="text-foreground/70 font-bold">No handled requests yet</Text>
                  </View>
                )}
              </View>
            </View>
          ) : role === 'moderator' ? (
            <View className="gap-6">
              <View className="rounded-3xl bg-primary p-8 relative overflow-hidden">
                <View className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-secondary/30" />
                <View className="relative z-10">
                  <Text className="text-white/80 text-sm uppercase tracking-[0.3em]">Your teams</Text>
                  <Text className="text-white font-extrabold text-6xl mt-2">{teams.length}</Text>


                  <Button className="mt-8 bg-background" onPress={() => router.navigate('/ManageTeams' as any)}>
                    <View className="flex-row items-center justify-center gap-2">
                      <Text className="text-primary font-extrabold text-base">Create new team</Text>
                      <Ionicons name="people" size={18} color={tint} />
                    </View>
                  </Button>
                </View>
              </View>

              <View className="rounded-3xl border border-border/20 bg-card p-5">
                <Text className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/50">Manage Your Teams</Text>
                <View className="mt-4 gap-3">
                  {teams.length > 0 ? (
                    teams.map((team) => (
                      <Pressable
                        key={team.ID}
                        onPress={() =>
                          router.push({
                            pathname: '/TeamMembers',
                            params: {
                              teamId: String(team.ID),
                              teamCode: String(team.Code),
                            },
                          })
                        }
                        className="rounded-2xl border border-border/10 bg-background px-4 py-3 flex-row items-center justify-between active:opacity-80"
                      >
                        <View>
                          <Text className="font-bold text-foreground">Team #{team.ID}</Text>
                          <Text className="text-sm text-foreground/60">Code {team.Code}</Text>
                        </View>

                      </Pressable>
                    ))
                  ) : (
                    <Text className="text-foreground/70">No teams assigned yet.</Text>
                  )}
                </View>
              </View>
            </View>
          ) : isMemberWithTeam ? (
            <View className="gap-6">
              <View className="bg-primary rounded-3xl p-8 relative overflow-hidden">
                <View className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-secondary/30" />
                <View className="relative z-10">
                  <Text className="text-white/80 text-sm uppercase tracking-[0.3em]">Streak</Text>
                  <Text className="text-white font-extrabold text-6xl mb-2">{streak} Days</Text>

                  <View className="mt-4 items-center">
                    <Image
                      source={petSprite}
                      style={{ width: 120, height: 120, backgroundColor: 'transparent' }}
                      contentFit="contain"
                      autoplay
                      cachePolicy="memory-disk"
                    />
                  </View>


                  <Button className="mt-8 bg-background" onPress={() => router.navigate(destination as any)}>
                    <View className="flex-row items-center justify-center gap-2">
                      <Text className="text-primary font-extrabold text-base">{label}</Text>
                      <Ionicons name={icon as any} size={18} color={tint} />
                    </View>
                  </Button>
                </View>
              </View>

              <View>
                {hasReport ? (
                  <Pressable onPress={() => router.push(`/MiniReport`)}>
                    <ModuleCard
                      index=""
                      title={`View ${user?.skill || 'Soft-Skills'} report`}
                      completionLabel="COMPLETION"
                      completionValue={40}
                      barColor="primary"
                      icon="analytics"
                      iconColor={tint}
                    />
                  </Pressable>
                ) : (
                  <View className="bg-card/40 border border-dashed border-border p-8 rounded-2xl items-center">
                    <Ionicons name="hourglass-outline" size={32} color={tint} opacity={0.5} />
                    <Text className="text-foreground/50 font-bold mt-2">Finish the course to unlock your report</Text>
                  </View>
                )}
              </View>

              <View>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/50">Companions</Text>
                </View>
                <View className={isTablet ? 'flex-row flex-wrap gap-4' : 'gap-4'}>
                  {petMilestones.map((pet) => (
                    <View
                      key={pet.name}
                      className={`${isTablet ? 'w-[48%]' : 'w-full'} bg-card rounded-3xl p-6 border border-border/20 min-h-[220px]`}
                    >
                      <View className="flex-2 items-center justify-center">
                        <Animated.View
                          className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center"
                          style={{ transform: [{ scale: heartScale }] }}
                        >
                          <Ionicons name="heart" size={42} color={tint} />
                        </Animated.View>
                      </View>

                      <View className="mt-2 flex-1 items-center justify-center">
                        <Text className="text-foreground font-bold text-base">{pet.name}</Text>
                        <Text className="text-foreground/65 mt-1 text-xs">{pet.skill || 'Soft-Skills'}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View className="gap-6">
              <View className={isTablet ? 'flex-row gap-6' : 'flex-col gap-6'}>
                <View className={isTablet ? 'flex-1' : 'w-full'}>
                  <View className="bg-primary rounded-3xl p-8 relative overflow-hidden">
                    <View className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-secondary/30" />
                    <View className="relative z-10">
                      <Text className="text-white/80 text-sm uppercase tracking-[0.3em]">Streak</Text>
                      <Text className="text-white font-extrabold text-6xl mb-2">{streak} Days</Text>
                      <Text className="text-white/80 text-lg">Current daily streak</Text>

                      <View className="items-end relative">
                        <Image
                          source={petSprite}
                          style={{ width: 120, height: 120, backgroundColor: 'transparent' }}
                        />
                      </View>

                      <Button className="mt bg-background" onPress={() => router.navigate(destination as any)}>
                        <View className="flex-row items-center justify-center gap-2">
                          <Text className="text-primary font-extrabold text-base">{label}</Text>
                          <Ionicons name={icon as any} size={18} color={tint} />
                        </View>
                      </Button>
                    </View>
                  </View>
                </View>

                <View className={isTablet ? 'w-80' : 'w-full'}>
                  <View className="bg-card rounded-3xl p-6 flex-1 items-center justify-center border border-border/20">
                    <Animated.View
                      className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center mb-4"
                      style={{ transform: [{ scale: heartScale }] }}
                    >
                      <Ionicons name="heart" size={42} color={tint} />
                    </Animated.View>
                    <Text className="text-foreground font-bold text-xl mb-1">Bit, your Peer</Text>
                    <Text className="text-foreground/80 text-sm italic text-center">
                      &quot;Your empathy logic is compiling perfectly!&quot;
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-2xl font-bold text-foreground mb-4">Current Improvement Course</Text>

                {hasReport ? (
                  <Pressable onPress={() => router.push(`/MiniReport`)}>
                    <ModuleCard
                      index=""
                      title={`View ${user?.skill || 'Soft-Skills'} report`}
                      completionLabel="COMPLETION"
                      completionValue={100}
                      barColor="primary"
                      icon="analytics"
                      iconColor={tint}
                    />
                  </Pressable>
                ) : (
                  <View className="bg-card/40 border border-dashed border-border p-8 rounded-2xl items-center">
                    <Ionicons name="hourglass-outline" size={32} color={tint} opacity={0.5} />
                    <Text className="text-foreground/50 font-bold mt-2">Keep working to see your progress</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}