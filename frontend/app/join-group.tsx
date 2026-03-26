import { useState } from 'react';
import { Text, View, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
import { getItem } from '@/utils/storage';

export default function JoinGroupScreen() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleJoin = async () => {
    if (input.length < 4) {
      Alert.alert("Error", "Code is too short");
      return;
    }

    setLoading(true);
    const token = await getItem('userToken');

    try {
      const response = await fetch(`${API_URL}/group/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: input.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "You have joined the team!", [
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
          maxLength={8} // Pakeista į 8, nes tavo UUID generatorius naudoja 8 simbolius
        />
        
        <Button 
          className="mt-3 w-full" 
          onPress={handleJoin}
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
          onPress={() => router.back()}
        >
          <Text className="text-muted-foreground">Cancel</Text>
        </Button>
      </View>
    </View>
  );
}