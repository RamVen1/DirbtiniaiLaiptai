import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function AdminRequestScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tint = Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint;
  
  // Demo duomenys (vėliau pakeisi į API call)
  const [requests, setRequests] = useState([
    { id: 1, email: 'user1@gmail.com', date: '2026-03-25', status: 'Pending' },
    { id: 2, email: 'dev_hero@gmail.com', date: '2026-03-24', status: 'Pending' },
  ]);

  const handleAction = (id: number, action: 'Accept' | 'Decline') => {
    Alert.alert(action, `Are you sure you want to ${action.toLowerCase()} this request?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => {
          // Čia būtų tavo API užklausa
          setRequests(prev => prev.filter(r => r.id !== id));
      }},
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-border/20">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} color={tint} />
        </Pressable>
        <Text className="text-xl font-bold text-foreground">Role Requests</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        <Text className="text-foreground/60 mb-6">
          Review and manage user requests to become Moderators.
        </Text>

        {requests.length === 0 ? (
          <View className="mt-20 items-center">
            <Ionicons name="checkmark-circle-outline" size={64} color={tint} opacity={0.3} />
            <Text className="text-foreground/50 mt-4">No pending requests</Text>
          </View>
        ) : (
          requests.map((req) => (
            <View key={req.id} className="bg-card border border-border/20 rounded-2xl p-4 mb-4 shadow-sm">
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="font-bold text-lg text-foreground">{req.email}</Text>
                  <Text className="text-xs text-foreground/50 uppercase font-bold mt-1">
                    Requested: {req.date}
                  </Text>
                </View>
                <View className="bg-primary/10 px-2 py-1 rounded-md">
                  <Text className="text-primary text-[10px] font-bold uppercase">{req.status}</Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <Button 
                  className="flex-1 bg-primary h-10" 
                  onPress={() => handleAction(req.id, 'Accept')}
                >
                  <Text className="text-white font-bold text-sm">Accept</Text>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-destructive h-10"
                  onPress={() => handleAction(req.id, 'Decline')}
                >
                  <Text className="text-destructive font-bold text-sm">Decline</Text>
                </Button>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}