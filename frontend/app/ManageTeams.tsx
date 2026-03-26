import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAuth } from './_layout';
import { getItem } from '@/utils/storage';
import * as Clipboard from 'expo-clipboard';

export default function ManageTeamsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    const token = await getItem('userToken');
  
    try {
      const response = await fetch(`${API_URL}/moderate/teams`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    
      const data = await response.json();
      if (data.teams) {
        setTeams(data.teams);
      }
    } catch (error) {
      console.error("Fetch teams error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeams(); }, [user]);

  const handleCreateTeam = async () => {
    const token = await getItem('userToken');
    try {
      const response = await fetch(`${API_URL}/moderate/teams/create`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
      });

      if (response.ok) {
        const newTeam = await response.json();
        Alert.alert("Success", `Created Team #${newTeam.ID}`);
        fetchTeams();
      } else {
        Alert.alert("Error", "Failed to create team.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
  try {
    const token = await getItem('userToken');

    const url = `${API_URL}/moderate/teams/${teamId}`;

    const response = await fetch(url, { 
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      fetchTeams(); 
    } else {
      const errorText = await response.text();
      console.log("KLAIDA IŠ SERVERIO:", errorText);
    }
  } catch (e) {
    console.error("TINKLO KLAIDA:", e);
  }
};

  const copyToClipboard = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Alert.alert("Copied", "Team code copied to clipboard!");
  };

  if (loading) return <ActivityIndicator style={{flex: 1}} color={tint} />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-border/20">
        <Pressable onPress={() => router.navigate('/(tabs)')} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color={tint} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">My Teams</Text>
        <Pressable onPress={handleCreateTeam} className="p-2">
          <Ionicons name="add" size={28} color={tint} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        {teams.length === 0 ? (
          <Text className="text-center text-muted-foreground mt-10">No teams created yet.</Text>
        ) : (
          teams.map((team) => (
            <View key={team.ID} className="bg-card border border-border/20 rounded-2xl p-5 mb-4 shadow-sm">
              <View className="flex-row justify-between items-start mb-3">
                <View>
                  <Text className="text-sm text-primary font-bold uppercase">Active Team</Text>
                  <Text className="text-2xl font-black text-foreground">Team #{team.ID}</Text>
                </View>
                <Pressable onPress={() => handleDeleteTeam(team.ID)} className="p-2 bg-destructive/10 rounded-full">
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </Pressable>
              </View>

              <View className="bg-muted p-4 rounded-xl flex-row justify-between items-center border border-border/50">
                <Text className="font-mono text-primary font-bold text-xl tracking-[4px]">
                  {team.Code}
                </Text>
                <Pressable onPress={() => copyToClipboard(team.Code)}>
                  <Ionicons name="copy-outline" size={20} color={tint} />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}