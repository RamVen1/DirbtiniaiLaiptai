import React from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
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

  return (
    <Animated.View
      className="flex-1 bg-background px-6 pt-16"
      style={{ opacity: containerOpacity, transform: [{ translateY: containerTranslateY }] }}
    >
      <Text className="text-3xl text-foreground font-semibold">Join a group</Text>
      <Text className="mt-2 text-muted-foreground">
        Enter the 8-character code your teammate shared with you.
      </Text>

      <View className="mt-6 w-full rounded-2xl border border-border bg-card p-5">
        <Text className="mb-2 text-sm font-medium text-foreground">Group code</Text>
        <TextInput
          className={`w-full rounded-xl border-2 bg-background px-4 py-3 font-mono text-foreground ${
            errorMessage ? 'border-destructive' : 'border-border'
          }`}
          onChangeText={setInput}
          value={input}
          placeholder="ABC12345"
          placeholderTextColor="#7A1CAC"
          autoCapitalize="characters"
          autoCorrect={false}
          autoComplete="off"
          maxLength={8}
          accessibilityLabel="Group code"
          accessibilityHint="Enter your 8-character team invitation code."
        />

        <Text className={`mt-2 text-sm ${errorMessage ? 'text-destructive' : 'text-muted-foreground'}`}>
          {errorMessage || 'Only letters and numbers are accepted.'}
        </Text>

        <Button
          className="mt-4 w-full rounded-xl"
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
            <Text className="font-semibold">Join</Text>
          )}
        </Button>

        <Button
          variant="ghost"
          className="mt-2 w-full rounded-xl"
          onPress={handleCancel}
          disabled={loading}
          accessibilityLabel="Cancel and go back"
        >
          <Text>Cancel</Text>
        </Button>
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
          <View className="bg-card w-full p-6 rounded-2xl border border-border shadow-xl">
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
    </Animated.View>
  );
}