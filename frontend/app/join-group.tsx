import { useState } from 'react';
import { Text, View, TextInput, Alert, ActivityIndicator, Modal, Pressable } from 'react-native';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
import { getItem } from '@/utils/storage';
import { useAuth } from '@/app/_layout';

const SKILLS = ['Communication', 'Time-management', 'Problem solving'];

export default function JoinGroupScreen() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  const { refreshUser } = useAuth();

  const handleJoinAttempt = () => {
    if (input.length < 4) {
      Alert.alert("Error", "Code is too short");
      return;
    }
    setShowSkillModal(true);
  };

  const submitJoin = async (selectedSkill: string) => {
    setShowSkillModal(false);
    setLoading(true);
    const token = await getItem('userToken');

    try {
      const response = await fetch(`${API_URL}/group/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code: input.trim(),
          skill: selectedSkill 
        })
      });

      const data = await response.json();

      if (response.ok) {
        await refreshUser();
        router.replace('/profile') 
        Alert.alert("Success", `Joined team as ${selectedSkill}!`, [
          { text: "OK", onPress: () => router.replace('/profile') }
        ]);
      } else {
        Alert.alert("Error", data.detail || "Failed to join group");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-16 items-start">
      <Text className="text-3xl text-foreground font-semibold pb-5">Join a group</Text>
      
      <View className="w-full">
        <TextInput
          className="border-border bg-card text-foreground border-2 rounded-md py-3 px-4 w-full font-mono"
          onChangeText={setInput}
          value={input}
          placeholder="Group code e.g. ABC12345"
          placeholderTextColor="#7A1CAC"
          autoCapitalize="characters"
          maxLength={8}
        />
        
        <Button 
          className="mt-3 w-full" 
          onPress={handleJoinAttempt}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Join</Text>
          )}
        </Button>

        <Button 
          variant="outline" 
          className="mt-2 w-full border-none" 
          onPress={() => router.replace('/(tabs)')}
        >
          <Text className="text-muted-foreground">Cancel</Text>
        </Button>
      </View>

      {/* Skills Selection Modal */}
      <Modal
        visible={showSkillModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-card w-full p-6 rounded-2xl border border-border shadow-xl">
            <Text className="text-xl font-bold text-foreground mb-4 text-center">
              Select your skill
            </Text>
            <Text className="text-muted-foreground mb-6 text-center">
              Choose how you will contribute to the team.
            </Text>

            <View className="gap-3">
              {SKILLS.map((skill) => (
                <Pressable
                  key={skill}
                  onPress={() => submitJoin(skill)}
                  className="w-full bg-secondary py-4 rounded-xl active:bg-primary/20 border border-primary/10"
                >
                  <Text className="text-primary font-semibold text-center text-lg">{skill}</Text>
                </Pressable>
              ))}
              
              <Pressable 
                onPress={() => setShowSkillModal(false)}
                className="mt-2"
              >
                <Text className="text-muted-foreground text-center py-2">Go back</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}