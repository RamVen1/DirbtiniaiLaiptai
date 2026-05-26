import React from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useThemePalette } from '@/hooks/use-color-scheme';
import { useJoinGroup } from '@/hooks/use-join-group';
import { useEntranceAnimation } from '@/hooks/use-entrance-animation';
import { useBackOrTabs } from '@/hooks/use-back-or-tabs';

export default function JoinGroupScreen() {
  const {
    input,
    setInput,
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
  } = useJoinGroup();
  const { opacity: containerOpacity, translateY: containerTranslateY } = useEntranceAnimation();
  const handleCancel = useBackOrTabs();
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 34 : 20;
  const { tint } = useThemePalette();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="absolute top-0 left-0 right-0 z-50 bg-background border-b border-border/20">
          <View className="flex-row items-center justify-between px-6 py-4">

        <Pressable
              onPress={handleCancel}
              className="p-2 -ml-2 active:scale-95"
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color="#7A1CAC" />
            </Pressable>

            <Text className="text-lg font-black text-primary tracking-tighter">Join a Team</Text>

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
          style={{ opacity: containerOpacity, transform: [{ translateY: containerTranslateY }] }}
        >

          <View className="w-full">
            <View className="bg-card border border-border/20 rounded-3xl p-5 shadow-sm">
              <View className="flex-row items-start justify-between gap-4 mb-4">
                <View className="flex-1">
              
                  <Text className="text-2xl font-black text-foreground mt-1">Enter code</Text>
                </View>
                <View className="w-9" />
              </View>

              <View className="bg-primary/10 p-4 rounded-2xl flex-row justify-between items-center border border-primary/20">
                <View className="flex-1">
                  <TextInput
                    className={`w-full bg-background rounded-md border border-border px-4 py-3 font-mono text-primary font-bold text-xl tracking-[3px]`}
                    style={{ color: tint }}
                    onChangeText={setInput}
                    value={input}
                    placeholder="ABC12345"
                    placeholderTextColor="#d2b6e0"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    autoComplete="off"
                    maxLength={8}
                    accessibilityLabel="Group code"
                    accessibilityHint="Enter your 8-character team invitation code."
                  />

                   <Text className={`mt-3 text-sm ${errorMessage ? 'text-destructive' : 'text-muted-foreground'}`}>
                {errorMessage || 'Only letters and numbers are accepted.'}
              </Text>
                </View>

                
              </View>

             
              <Button
                size="lg"
                className="mt-6 h-14 bg-primary rounded-2xl flex-row items-center justify-center gap-2"
                onPress={handleJoinAttempt}
                disabled={loading || !isCodeValid}
                accessibilityLabel="Join group"
                accessibilityHint="Opens skill selection after your group code is valid."
              >
                {loading ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator color="white" />
                    <Text className="font-semibold">Joining...</Text>
                  </View>
                ) : (
                  <>
                    <Text className="font-bold text-base">Join</Text>
                  </>
                )}
              </Button>


              <Button
                variant="outline"
                className="mt-3 h-14 rounded-2xl w-full"
                onPress={handleCancel}
                disabled={loading}
                accessibilityLabel="Cancel and go back"
              >
                <Text className="text-lg">Cancel</Text>
              </Button>
            </View>
          </View>

          <Modal
            visible={showSkillModal}
            transparent
            animationType="slide"
            onRequestClose={() => {
              if (!loading) {
                setShowSkillModal(false);
              }
            }}
          >
            <View className="flex-1 items-center justify-center bg-black/50 px-6" accessibilityViewIsModal>
              <View className="bg-card w-full max-w-[420px] p-6 rounded-2xl border border-border shadow-xl">
                <Pressable
                  onPress={() => setShowSkillModal(false)}
                  className="self-end pb-2"
                  disabled={loading}
                  accessibilityLabel="Close skill selection"
                >
                  <Text className="text-muted-foreground text-lg">X</Text>
                </Pressable>
                <Text className="mb-2 text-center text-xl font-bold text-foreground">
                  Select your skill
                </Text>
                <Text className="mb-6 text-center text-muted-foreground">
                  Choose how you will contribute to the team.
                </Text>

                <View className="gap-3">
                  {skills.map((skill) => (
                    <Button
                      key={skill}
                      onPress={() => setSelectedSkill(skill)}
                      variant={selectedSkill === skill ? 'default' : 'outline'}
                      className="w-full rounded-xl"
                      disabled={loading}
                      accessibilityLabel={`Select ${skill}`}
                    >
                      <Text className="text-lg font-semibold">{skill}</Text>
                    </Button>
                  ))}

                  <Button
                    className="mt-1 w-full rounded-xl"
                    onPress={submitJoin}
                    disabled={loading || !selectedSkill}
                    accessibilityLabel="Confirm selected skill and join group"
                  >
                    {loading ? (
                      <View className="flex-row items-center gap-2">
                        <ActivityIndicator color="white" />
                        <Text className="font-semibold">Joining...</Text>
                      </View>
                    ) : (
                      <Text className="font-semibold">Confirm and join</Text>
                    )}
                  </Button>

                  <Pressable
                    onPress={() => setShowSkillModal(false)}
                    className="mt-1"
                    disabled={loading}
                    accessibilityLabel="Go back from skill selection"
                  >
                    <Text className="text-muted-foreground text-center py-2">Go back</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
} 