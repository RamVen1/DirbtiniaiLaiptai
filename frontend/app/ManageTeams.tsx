import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ManageTeamsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;

  const [teams, setTeams] = useState([
    { id: 1, name: 'Frontend Unit', code: 'A7B2X9P1', members: 5 },
    { id: 2, name: 'Backend Squad', code: 'K9L0M1Z2', members: 3 },
  ]);

  const createTeam = () => {
    // Čia būtų generuojamas kodas ir siunčiama į Backend
    const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    Alert.alert("New Team Created", `Team Code: ${newCode}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-border/20">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color={tint} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">My Teams</Text>
        <Pressable onPress={createTeam} className="p-2">
          <Ionicons name="add" size={28} color={tint} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        <View className="mb-6 bg-primary/10 p-4 rounded-2xl border border-primary/20">
          <Text className="text-primary font-bold">Moderator Mode</Text>
          <Text className="text-primary/80 text-sm mt-1">
            Create teams and share the 8-symbol code with your members.
          </Text>
        </View>

        <Text className="text-lg font-bold text-foreground mb-4">Active Teams</Text>

        {teams.map((team) => (
          <View key={team.id} className="bg-card border border-border/20 rounded-2xl p-5 mb-4 relative overflow-hidden">
            <View className="absolute -right-4 -bottom-4 opacity-5">
               <Ionicons name="people" size={80} color={tint} />
            </View>

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-extrabold text-foreground">{team.name}</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="person" size={14} color={tint} />
                <Text className="text-foreground/60 font-bold">{team.members}</Text>
              </View>
            </View>

            <View className="bg-muted p-3 rounded-xl flex-row justify-between items-center border border-border/50">
              <Text className="font-mono text-primary font-bold text-lg tracking-widest">
                {team.code}
              </Text>
              <Pressable onPress={() => Alert.alert("Copied", "Code copied to clipboard")}>
                <Ionicons name="copy-outline" size={20} color={tint} />
              </Pressable>
            </View>
          </View>
        ))}

        <Button 
          className="mt-4 bg-primary rounded-2xl h-14" 
          onPress={createTeam}
        >
          <Text className="text-white font-black text-lg">Create New Team</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}